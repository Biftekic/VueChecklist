/**
 * Database Migration System
 * Handles schema evolution and data transformation
 */

import { logger } from "@/services/logger"
import Dexie from 'dexie'

export interface Migration {
  version: number
  name: string
  description: string
  up: (db: Dexie, transaction: any) => Promise<void>
  down?: (db: Dexie, transaction: any) => Promise<void>
  timestamp: Date
}

export interface MigrationRecord {
  version: number
  name: string
  appliedAt: Date
  success: boolean
  error?: string
}

/**
 * Migration Manager
 * Handles database schema migrations and version control
 */
export class MigrationManager {
  private migrations: Migration[] = []
  private currentVersion: number = 0
  private migrationHistory: MigrationRecord[] = []

  constructor(private database: Dexie) {}

  /**
   * Register a migration
   */
  register(migration: Migration): void {
    // Ensure migrations are in order
    const existing = this.migrations.find(m => m.version === migration.version)
    if (existing) {
      throw new Error(`Migration version ${migration.version} already exists`)
    }
    
    this.migrations.push(migration)
    this.migrations.sort((a, b) => a.version - b.version)
  }

  /**
   * Get current database version
   */
  async getCurrentVersion(): Promise<number> {
    try {
      const versionRecord = await this.database
        .table('_migrations')
        .orderBy('version')
        .last()
      
      return versionRecord?.version || 0
    } catch (error) {
      // Table doesn't exist yet
      return 0
    }
  }

  /**
   * Run pending migrations
   */
  async migrate(): Promise<void> {
    const currentVersion = await this.getCurrentVersion()
    const pendingMigrations = this.migrations.filter(m => m.version > currentVersion)
    
    if (pendingMigrations.length === 0) {
      logger.debug('Database is up to date')
      return
    }
    
    logger.debug(`Running ${pendingMigrations.length} migrations...`)
    
    for (const migration of pendingMigrations) {
      await this.runMigration(migration)
    }
    
    logger.debug('All migrations completed successfully')
  }

  /**
   * Run a single migration
   */
  private async runMigration(migration: Migration): Promise<void> {
    const record: MigrationRecord = {
      version: migration.version,
      name: migration.name,
      appliedAt: new Date(),
      success: false
    }
    
    try {
      logger.debug(`Running migration ${migration.version}: ${migration.name}`)
      
      await this.database.transaction('rw', 
        this.database.tables, 
        async (trans) => {
          await migration.up(this.database, trans)
          
          // Record successful migration
          await this.database.table('_migrations').add({
            ...record,
            success: true
          })
        }
      )
      
      logger.debug(`✓ Migration ${migration.version} completed`)
      this.currentVersion = migration.version
      
    } catch (error) {
      record.error = error instanceof Error ? error.message : String(error)
      logger.error(`✗ Migration ${migration.version} failed:`, error)
      
      // Record failed migration
      try {
        await this.database.table('_migrations').add(record)
      } catch (e) {
        logger.error('Failed to record migration failure:', e)
      }
      
      throw new Error(`Migration ${migration.version} failed: ${record.error}`)
    }
  }

  /**
   * Rollback to a specific version
   */
  async rollback(targetVersion: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion()
    
    if (targetVersion >= currentVersion) {
      throw new Error(`Cannot rollback to version ${targetVersion} (current: ${currentVersion})`)
    }
    
    const migrationsToRollback = this.migrations
      .filter(m => m.version > targetVersion && m.version <= currentVersion)
      .reverse()
    
    for (const migration of migrationsToRollback) {
      if (!migration.down) {
        throw new Error(`Migration ${migration.version} does not support rollback`)
      }
      
      logger.debug(`Rolling back migration ${migration.version}: ${migration.name}`)
      
      await this.database.transaction('rw',
        this.database.tables,
        async (trans) => {
          await migration.down!(this.database, trans)
          
          // Remove migration record
          await this.database.table('_migrations')
            .where('version')
            .equals(migration.version)
            .delete()
        }
      )
      
      logger.debug(`✓ Rolled back migration ${migration.version}`)
    }
  }

  /**
   * Get migration history
   */
  async getHistory(): Promise<MigrationRecord[]> {
    try {
      return await this.database
        .table('_migrations')
        .orderBy('version')
        .toArray()
    } catch (error) {
      return []
    }
  }

  /**
   * Reset database (dangerous!)
   */
  async reset(): Promise<void> {
    logger.warn('⚠️ Resetting database - all data will be lost!')
    
    // Delete all tables
    await this.database.delete()
    
    // Recreate database
    await this.database.open()
    
    // Run all migrations from scratch
    await this.migrate()
  }
}

// Migration manager will be created when needed
let migrationManager: MigrationManager | null = null

// Define migrations
const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    description: 'Create initial database schema',
    timestamp: new Date('2024-01-01'),
    async up(db: Dexie) {
      // This migration is handled by Dexie's version system
      logger.debug('Initial schema created')
    }
  },
  
  {
    version: 2,
    name: 'add_checklist_fields',
    description: 'Add version and tags fields to checklists',
    timestamp: new Date('2024-01-15'),
    async up(db: Dexie) {
      await db.table('checklists').toCollection().modify(checklist => {
        checklist.version = checklist.version || 1
        checklist.tags = checklist.tags || []
      })
    },
    async down(db: Dexie) {
      await db.table('checklists').toCollection().modify(checklist => {
        delete checklist.version
        delete checklist.tags
      })
    }
  },
  
  {
    version: 3,
    name: 'add_completion_tracking',
    description: 'Add completion tracking fields',
    timestamp: new Date('2024-02-01'),
    async up(db: Dexie) {
      await db.table('checklists').toCollection().modify(checklist => {
        if (!checklist.completionPercentage) {
          const completedTasks = (checklist.tasks || []).filter((t: any) => t.completed).length
          const totalTasks = (checklist.tasks || []).length
          checklist.completionPercentage = totalTasks > 0 
            ? (completedTasks / totalTasks) * 100 
            : 0
        }
        
        if (checklist.status === 'completed' && !checklist.completedAt) {
          checklist.completedAt = checklist.updatedAt || new Date()
        }
      })
    }
  },
  
  {
    version: 4,
    name: 'add_task_metadata',
    description: 'Add metadata fields to tasks',
    timestamp: new Date('2024-02-15'),
    async up(db: Dexie) {
      await db.table('checklists').toCollection().modify(checklist => {
        if (checklist.tasks && Array.isArray(checklist.tasks)) {
          checklist.tasks = checklist.tasks.map((task: any) => ({
            ...task,
            priority: task.priority || 'normal',
            estimatedTime: task.estimatedTime || null,
            actualTime: task.actualTime || null,
            notes: task.notes || '',
            attachments: task.attachments || []
          }))
        }
      })
    }
  },
  
  {
    version: 5,
    name: 'add_client_preferences',
    description: 'Add preferences field to client data',
    timestamp: new Date('2024-03-01'),
    async up(db: Dexie) {
      await db.table('checklists').toCollection().modify(checklist => {
        if (checklist.client) {
          checklist.client.preferences = checklist.client.preferences || {
            preferredTime: null,
            specialInstructions: '',
            allergies: [],
            petInfo: null
          }
        }
      })
    }
  },
  
  {
    version: 6,
    name: 'create_migrations_table',
    description: 'Create migrations tracking table',
    timestamp: new Date('2024-03-15'),
    async up(db: Dexie) {
      // Check if table exists
      if (!db.tables.some(table => table.name === '_migrations')) {
        // This would be handled by Dexie versioning
        logger.debug('Migrations table will be created')
      }
    }
  }
]

// Migrations will be registered when runMigrations is called

/**
 * Run database migrations
 */
export async function runMigrations(database?: Dexie): Promise<void> {
  try {
    // Create migration manager if not exists
    if (!migrationManager && database) {
      migrationManager = new MigrationManager(database)
      // Register all migrations
      migrations.forEach(migration => {
        migrationManager!.register(migration)
      })
    }
    
    if (!migrationManager) {
      logger.warn('Migration manager not initialized, skipping migrations')
      return
    }
    
    logger.debug('Checking for database migrations...')
    await migrationManager.migrate()
  } catch (error) {
    logger.error('Migration failed:', error)
    throw error
  }
}

/**
 * Export migration utilities
 */
export async function getMigrationStatus(): Promise<{
  currentVersion: number
  latestVersion: number
  pendingMigrations: number
  history: MigrationRecord[]
}> {
  if (!migrationManager) {
    const latestVersion = Math.max(...migrations.map(m => m.version), 0)
    return {
      currentVersion: 0,
      latestVersion,
      pendingMigrations: migrations.length,
      history: []
    }
  }
  
  const currentVersion = await migrationManager.getCurrentVersion()
  const latestVersion = Math.max(...migrations.map(m => m.version))
  const history = await migrationManager.getHistory()
  
  return {
    currentVersion,
    latestVersion,
    pendingMigrations: migrations.filter(m => m.version > currentVersion).length,
    history
  }
}

/**
 * Create a new migration template
 */
export function createMigrationTemplate(name: string): string {
  const version = Math.max(...migrations.map(m => m.version)) + 1
  const timestamp = new Date().toISOString()
  
  return `{
  version: ${version},
  name: '${name}',
  description: 'Description of what this migration does',
  timestamp: new Date('${timestamp}'),
  async up(db: Dexie, transaction: Dexie.Transaction) {
    // Implement forward migration
    await db.table('tableName').toCollection().modify(record => {
      // Modify records
    })
  },
  async down(db: Dexie, transaction: Dexie.Transaction) {
    // Implement rollback (optional)
    await db.table('tableName').toCollection().modify(record => {
      // Rollback changes
    })
  }
}`
}