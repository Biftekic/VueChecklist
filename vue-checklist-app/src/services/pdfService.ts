// PDF Generation Service
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

export interface PdfOptions {
  orientation?: 'portrait' | 'landscape'
  unit?: 'mm' | 'cm' | 'in' | 'px' | 'pt' | 'pc' | 'em' | 'ex'
  format?: string | number[]
  compress?: boolean
  precision?: number
  userUnit?: number
}

export interface ChecklistData {
  id: string
  title: string
  type: string
  rooms: Room[]
  metadata: ChecklistMetadata
  completedTasks: CompletedTask[]
  totalTasks: number
  completedCount: number
  startTime?: string
  endTime?: string
  duration?: number
  inspector?: string
  notes?: string
}

export interface Room {
  id: string
  name: string
  completed: boolean
  tasks: Task[]
}

export interface Task {
  id: string
  name: string
  completed: boolean
  notes?: string
  timeSpent?: number
  photo?: string
}

export interface CompletedTask {
  taskId: string
  taskName: string
  roomName: string
  completedAt: string
  timeSpent: number
  notes?: string
  inspector?: string
}

export interface ChecklistMetadata {
  company?: string
  inspector?: string
  customer?: string
  location?: string
  date: string
  startTime?: string
  endTime?: string
  totalTime?: number
  weather?: string
  temperature?: string
  notes?: string
}

export interface PdfReportOptions {
  includeTaskDetails?: boolean
  includePhotos?: boolean
  includeNotes?: boolean
  includeTimeTracking?: boolean
  includeMetadata?: boolean
  customLogo?: string | File
  customHeader?: string
  customFooter?: string
  colorScheme?: 'default' | 'blue' | 'green' | 'red' | 'minimal'
}

export interface PdfProgressCallback {
  (progress: number, status: string): void
}

// Default color schemes
const COLOR_SCHEMES = {
  default: {
    primary: '#2196F3',
    secondary: '#FFC107',
    success: '#4CAF50',
    error: '#F44336',
    text: '#333333',
    lightGray: '#F5F5F5'
  },
  blue: {
    primary: '#1976D2',
    secondary: '#42A5F5',
    success: '#66BB6A',
    error: '#EF5350',
    text: '#263238',
    lightGray: '#ECEFF1'
  },
  green: {
    primary: '#388E3C',
    secondary: '#66BB6A',
    success: '#4CAF50',
    error: '#F44336',
    text: '#1B5E20',
    lightGray: '#E8F5E8'
  },
  red: {
    primary: '#D32F2F',
    secondary: '#EF5350',
    success: '#4CAF50',
    error: '#F44336',
    text: '#B71C1C',
    lightGray: '#FFEBEE'
  },
  minimal: {
    primary: '#424242',
    secondary: '#757575',
    success: '#616161',
    error: '#9E9E9E',
    text: '#212121',
    lightGray: '#FAFAFA'
  }
}

class PDFService {
  private doc: jsPDF | null = null
  private currentY = 20
  private pageHeight = 0
  private pageWidth = 0
  private margins = { top: 20, bottom: 20, left: 20, right: 20 }
  private colors = COLOR_SCHEMES.default

  // Initialize PDF document
  private initDocument(options: PdfOptions = {}): jsPDF {
    const defaultOptions: PdfOptions = {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    }

    const config = { ...defaultOptions, ...options }
    this.doc = new jsPDF(config)
    
    // Set page dimensions
    this.pageHeight = this.doc.internal.pageSize.height
    this.pageWidth = this.doc.internal.pageSize.width
    this.currentY = this.margins.top

    return this.doc
  }

  // Check if we need a new page
  private checkPageBreak(neededSpace: number = 20): void {
    if (!this.doc) return
    
    if (this.currentY + neededSpace > this.pageHeight - this.margins.bottom) {
      this.doc.addPage()
      this.currentY = this.margins.top
    }
  }

  // Add header to page
  private addHeader(title: string, subtitle?: string): void {
    if (!this.doc) return

    this.doc.setFontSize(18)
    this.doc.setTextColor(this.colors.primary)
    this.doc.text(title, this.margins.left, this.currentY)
    this.currentY += 10

    if (subtitle) {
      this.doc.setFontSize(12)
      this.doc.setTextColor(this.colors.text)
      this.doc.text(subtitle, this.margins.left, this.currentY)
      this.currentY += 8
    }

    // Add line separator
    this.doc.setDrawColor(this.colors.primary)
    this.doc.line(
      this.margins.left, 
      this.currentY, 
      this.pageWidth - this.margins.right, 
      this.currentY
    )
    this.currentY += 10
  }

  // Add footer to page
  private addFooter(pageNumber: number, totalPages: number): void {
    if (!this.doc) return

    const footerY = this.pageHeight - 10
    this.doc.setFontSize(8)
    this.doc.setTextColor(this.colors.text)
    
    // Page number
    this.doc.text(
      `Page ${pageNumber} of ${totalPages}`, 
      this.pageWidth - this.margins.right - 30, 
      footerY,
      { align: 'right' }
    )
    
    // Timestamp
    this.doc.text(
      `Generated: ${new Date().toLocaleString()}`, 
      this.margins.left, 
      footerY
    )
  }

  // Add checklist metadata section
  private addMetadata(metadata: ChecklistMetadata): void {
    if (!this.doc) return

    this.checkPageBreak(40)
    
    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colors.primary)
    this.doc.text('Inspection Details', this.margins.left, this.currentY)
    this.currentY += 10

    const details = [
      { label: 'Company:', value: metadata.company || 'N/A' },
      { label: 'Inspector:', value: metadata.inspector || 'N/A' },
      { label: 'Customer:', value: metadata.customer || 'N/A' },
      { label: 'Location:', value: metadata.location || 'N/A' },
      { label: 'Date:', value: metadata.date },
      { label: 'Start Time:', value: metadata.startTime || 'N/A' },
      { label: 'End Time:', value: metadata.endTime || 'N/A' },
      { label: 'Duration:', value: metadata.totalTime ? `${Math.round(metadata.totalTime)} minutes` : 'N/A' }
    ]

    this.doc.setFontSize(10)
    details.forEach(detail => {
      this.doc!.setTextColor(this.colors.text)
      this.doc!.text(detail.label, this.margins.left, this.currentY)
      this.doc!.text(detail.value, this.margins.left + 30, this.currentY)
      this.currentY += 5
    })

    this.currentY += 5
  }

  // Add completion summary
  private addSummary(data: ChecklistData): void {
    if (!this.doc) return

    this.checkPageBreak(30)

    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colors.primary)
    this.doc.text('Completion Summary', this.margins.left, this.currentY)
    this.currentY += 10

    const completionRate = (data.completedCount / data.totalTasks) * 100

    // Summary stats
    this.doc.setFontSize(10)
    this.doc.setTextColor(this.colors.text)
    this.doc.text(`Total Tasks: ${data.totalTasks}`, this.margins.left, this.currentY)
    this.currentY += 5
    this.doc.text(`Completed: ${data.completedCount}`, this.margins.left, this.currentY)
    this.currentY += 5
    this.doc.text(`Completion Rate: ${completionRate.toFixed(1)}%`, this.margins.left, this.currentY)
    this.currentY += 5

    if (data.duration) {
      this.doc.text(`Total Time: ${Math.round(data.duration)} minutes`, this.margins.left, this.currentY)
      this.currentY += 5
    }

    // Progress bar
    const barWidth = 100
    const barHeight = 6
    const filledWidth = (barWidth * completionRate) / 100

    // Background
    this.doc.setFillColor(this.colors.lightGray)
    this.doc.rect(this.margins.left, this.currentY, barWidth, barHeight, 'F')

    // Progress
    this.doc.setFillColor(completionRate === 100 ? this.colors.success : this.colors.primary)
    this.doc.rect(this.margins.left, this.currentY, filledWidth, barHeight, 'F')

    this.currentY += 15
  }

  // Add room details
  private addRoomDetails(rooms: Room[], options: PdfReportOptions): void {
    if (!this.doc) return

    rooms.forEach(room => {
      this.checkPageBreak(30)

      // Room header
      this.doc!.setFontSize(12)
      this.doc!.setTextColor(this.colors.primary)
      this.doc!.text(`${room.name} (${room.tasks.filter(t => t.completed).length}/${room.tasks.length} completed)`, 
        this.margins.left, this.currentY)
      this.currentY += 8

      // Tasks
      if (options.includeTaskDetails) {
        room.tasks.forEach(task => {
          this.checkPageBreak(15)

          // Task status icon
          const icon = task.completed ? '✓' : '○'
          const color = task.completed ? this.colors.success : this.colors.error

          this.doc!.setTextColor(color)
          this.doc!.setFontSize(10)
          this.doc!.text(icon, this.margins.left + 5, this.currentY)

          // Task name
          this.doc!.setTextColor(this.colors.text)
          this.doc!.text(task.name, this.margins.left + 15, this.currentY)
          this.currentY += 5

          // Task notes
          if (options.includeNotes && task.notes) {
            this.doc!.setFontSize(8)
            this.doc!.setTextColor('#666666')
            const noteLines = this.doc!.splitTextToSize(task.notes, this.pageWidth - this.margins.left - this.margins.right - 20)
            this.doc!.text(noteLines, this.margins.left + 20, this.currentY)
            this.currentY += noteLines.length * 3
          }

          // Time tracking
          if (options.includeTimeTracking && task.timeSpent) {
            this.doc!.setFontSize(8)
            this.doc!.setTextColor('#888888')
            this.doc!.text(`Time: ${task.timeSpent} min`, this.margins.left + 20, this.currentY)
            this.currentY += 4
          }
        })
      }

      this.currentY += 5
    })
  }

  // Add notes section
  private addNotes(notes?: string): void {
    if (!this.doc || !notes) return

    this.checkPageBreak(20)

    this.doc.setFontSize(14)
    this.doc.setTextColor(this.colors.primary)
    this.doc.text('Additional Notes', this.margins.left, this.currentY)
    this.currentY += 10

    this.doc.setFontSize(10)
    this.doc.setTextColor(this.colors.text)
    const noteLines = this.doc.splitTextToSize(notes, this.pageWidth - this.margins.left - this.margins.right)
    this.doc.text(noteLines, this.margins.left, this.currentY)
    this.currentY += noteLines.length * 5
  }

  // Generate checklist report PDF
  async generateChecklistReport(
    data: ChecklistData, 
    options: PdfReportOptions = {},
    progressCallback?: PdfProgressCallback
  ): Promise<Blob> {
    progressCallback?.(10, 'Initializing PDF...')

    // Set color scheme
    if (options.colorScheme && COLOR_SCHEMES[options.colorScheme]) {
      this.colors = COLOR_SCHEMES[options.colorScheme]
    }

    // Initialize document
    this.initDocument({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    if (!this.doc) {
      throw new Error('Failed to initialize PDF document')
    }

    progressCallback?.(20, 'Adding header...')

    // Add header
    this.addHeader(
      options.customHeader || `${data.type} Inspection Report`,
      data.title
    )

    progressCallback?.(30, 'Adding metadata...')

    // Add metadata
    if (options.includeMetadata !== false) {
      this.addMetadata(data.metadata)
    }

    progressCallback?.(40, 'Adding summary...')

    // Add summary
    this.addSummary(data)

    progressCallback?.(60, 'Adding room details...')

    // Add room details
    this.addRoomDetails(data.rooms, options)

    progressCallback?.(80, 'Adding notes...')

    // Add notes
    if (options.includeNotes && data.notes) {
      this.addNotes(data.notes)
    }

    progressCallback?.(90, 'Finalizing PDF...')

    // Add footers to all pages
    const totalPages = this.doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i)
      this.addFooter(i, totalPages)
    }

    progressCallback?.(100, 'Complete!')

    // Return blob
    return new Promise(resolve => {
      resolve(this.doc!.output('blob'))
    })
  }

  // Generate task list PDF
  async generateTaskList(
    title: string,
    tasks: Array<{ name: string; category?: string; estimatedTime?: number }>,
    options: PdfOptions = {}
  ): Promise<Blob> {
    this.initDocument(options)

    if (!this.doc) {
      throw new Error('Failed to initialize PDF document')
    }

    this.addHeader('Task Checklist', title)

    let currentCategory = ''
    
    tasks.forEach(task => {
      this.checkPageBreak(10)

      // Category header
      if (task.category && task.category !== currentCategory) {
        this.checkPageBreak(15)
        currentCategory = task.category

        this.doc!.setFontSize(12)
        this.doc!.setTextColor(this.colors.primary)
        this.doc!.text(currentCategory, this.margins.left, this.currentY)
        this.currentY += 8
      }

      // Checkbox
      this.doc!.setDrawColor(this.colors.text)
      this.doc!.rect(this.margins.left + 5, this.currentY - 3, 3, 3)

      // Task name
      this.doc!.setFontSize(10)
      this.doc!.setTextColor(this.colors.text)
      this.doc!.text(task.name, this.margins.left + 15, this.currentY)

      // Estimated time
      if (task.estimatedTime) {
        this.doc!.setFontSize(8)
        this.doc!.setTextColor('#888888')
        this.doc!.text(`(${task.estimatedTime} min)`, this.pageWidth - this.margins.right - 20, this.currentY)
      }

      this.currentY += 6
    })

    // Add footers
    const totalPages = this.doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i)
      this.addFooter(i, totalPages)
    }

    return new Promise(resolve => {
      resolve(this.doc!.output('blob'))
    })
  }

  // Convert HTML element to PDF
  async htmlToPdf(element: HTMLElement, options: PdfOptions = {}): Promise<Blob> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })

    this.initDocument(options)

    if (!this.doc) {
      throw new Error('Failed to initialize PDF document')
    }

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = this.pageWidth - this.margins.left - this.margins.right
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    this.doc.addImage(imgData, 'PNG', this.margins.left, this.margins.top, imgWidth, imgHeight)

    return new Promise(resolve => {
      resolve(this.doc!.output('blob'))
    })
  }

  // Save PDF file
  savePdf(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  // Preview PDF in new window
  previewPdf(blob: Blob): void {
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  // Convert blob to base64
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Email PDF (requires backend integration)
  async emailPdf(blob: Blob, emailData: {
    to: string
    subject: string
    body: string
    filename: string
  }): Promise<boolean> {
    try {
      const base64 = await this.blobToBase64(blob)
      
      // This would typically send to your backend
      const response = await fetch('/api/email/send-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...emailData,
          attachment: base64
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error sending email:', error)
      return false
    }
  }
}

// Export singleton instance
export const pdfService = new PDFService()

// Export default
export default pdfService