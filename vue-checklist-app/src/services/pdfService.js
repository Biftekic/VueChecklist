import jsPDF from 'jspdf'
import 'jspdf-autotable'

export class PDFService {
  constructor() {
    this.doc = null
    this.primaryColor = [33, 150, 243] // Material Blue
    this.textColor = [33, 33, 33]
    this.lightGray = [245, 245, 245]
  }

  generateChecklistPDF(checklist) {
    this.doc = new jsPDF()
    
    // Add header
    this.addHeader(checklist)
    
    // Add client information
    this.addClientInfo(checklist.clientInfo)
    
    // Add property details
    this.addPropertyDetails(checklist)
    
    // Add tasks by room
    this.addTasksByRoom(checklist)
    
    // Add summary
    this.addSummary(checklist)
    
    // Add footer
    this.addFooter()
    
    return this.doc
  }

  addHeader(checklist) {
    const pageWidth = this.doc.internal.pageSize.getWidth()
    
    // Company name placeholder
    this.doc.setFontSize(20)
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('Cleaning Service', pageWidth / 2, 20, { align: 'center' })
    
    // Checklist title
    this.doc.setFontSize(16)
    this.doc.setTextColor(...this.textColor)
    const title = checklist.name || `${checklist.industry} Cleaning Checklist`
    this.doc.text(title, pageWidth / 2, 30, { align: 'center' })
    
    // Date
    this.doc.setFontSize(10)
    const date = new Date().toLocaleDateString()
    this.doc.text(`Generated: ${date}`, pageWidth / 2, 37, { align: 'center' })
    
    // Line separator
    this.doc.setDrawColor(...this.primaryColor)
    this.doc.setLineWidth(0.5)
    this.doc.line(20, 42, pageWidth - 20, 42)
  }

  addClientInfo(clientInfo) {
    if (!clientInfo) return
    
    let yPos = 50
    
    this.doc.setFontSize(14)
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('Client Information', 20, yPos)
    
    yPos += 8
    this.doc.setFontSize(10)
    this.doc.setTextColor(...this.textColor)
    
    if (clientInfo.name) {
      this.doc.text(`Name: ${clientInfo.name}`, 25, yPos)
      yPos += 6
    }
    
    if (clientInfo.address) {
      this.doc.text(`Address: ${clientInfo.address}`, 25, yPos)
      yPos += 6
    }
    
    if (clientInfo.phone) {
      this.doc.text(`Phone: ${clientInfo.phone}`, 25, yPos)
      yPos += 6
    }
    
    if (clientInfo.email) {
      this.doc.text(`Email: ${clientInfo.email}`, 25, yPos)
      yPos += 6
    }
    
    if (clientInfo.frequency) {
      this.doc.text(`Service Frequency: ${clientInfo.frequency}`, 25, yPos)
      yPos += 6
    }
    
    if (clientInfo.specialInstructions) {
      this.doc.text(`Special Instructions: ${clientInfo.specialInstructions}`, 25, yPos)
      yPos += 6
    }
    
    return yPos + 4
  }

  addPropertyDetails(checklist) {
    let yPos = 95
    
    this.doc.setFontSize(14)
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('Property Details', 20, yPos)
    
    yPos += 8
    this.doc.setFontSize(10)
    this.doc.setTextColor(...this.textColor)
    
    this.doc.text(`Type: ${checklist.industry}`, 25, yPos)
    yPos += 6
    
    if (checklist.propertySize) {
      this.doc.text(`Size: ${checklist.propertySize} m²`, 25, yPos)
      yPos += 6
    }
    
    if (checklist.numberOfFloors) {
      this.doc.text(`Floors: ${checklist.numberOfFloors}`, 25, yPos)
      yPos += 6
    }
    
    const modifiers = []
    if (checklist.difficulty) modifiers.push(`Difficulty: ${checklist.difficulty}`)
    if (checklist.expectations) modifiers.push(`Expectations: ${checklist.expectations}`)
    if (checklist.challenges) modifiers.push(`Challenges: ${checklist.challenges}`)
    
    if (modifiers.length > 0) {
      this.doc.text(modifiers.join(' | '), 25, yPos)
      yPos += 6
    }
    
    return yPos + 4
  }

  addTasksByRoom(checklist) {
    let yPos = 130
    
    this.doc.setFontSize(14)
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('Cleaning Tasks', 20, yPos)
    
    yPos += 10
    
    // Group tasks by room
    const tasksByRoom = {}
    checklist.selectedTasks?.forEach(task => {
      const room = task.room || 'General'
      if (!tasksByRoom[room]) {
        tasksByRoom[room] = []
      }
      tasksByRoom[room].push(task)
    })
    
    // Create table data
    const tableData = []
    
    Object.entries(tasksByRoom).forEach(([room, tasks]) => {
      // Add room header
      tableData.push([
        { content: room, colSpan: 3, styles: { fillColor: this.lightGray, fontStyle: 'bold' } }
      ])
      
      // Add tasks
      tasks.forEach(task => {
        const time = task.adjustedTime || task.estimatedTime || 0
        const timeStr = this.formatTime(time)
        tableData.push([
          '☐',
          task.name,
          timeStr
        ])
      })
    })
    
    // Generate table
    this.doc.autoTable({
      startY: yPos,
      head: [['', 'Task', 'Time']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: this.primaryColor,
        textColor: [255, 255, 255]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 25, halign: 'right' }
      },
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 9,
        cellPadding: 3
      }
    })
  }

  addSummary(checklist) {
    const finalY = this.doc.lastAutoTable.finalY + 10
    let yPos = finalY
    
    // Check if we need a new page
    if (yPos > 250) {
      this.doc.addPage()
      yPos = 20
    }
    
    this.doc.setFontSize(14)
    this.doc.setTextColor(...this.primaryColor)
    this.doc.text('Summary', 20, yPos)
    
    yPos += 8
    
    // Calculate totals
    const totalTasks = checklist.selectedTasks?.length || 0
    const totalTime = checklist.selectedTasks?.reduce((sum, task) => {
      return sum + (task.adjustedTime || task.estimatedTime || 0)
    }, 0) || 0
    
    const rooms = new Set()
    checklist.selectedTasks?.forEach(task => {
      if (task.room) rooms.add(task.room)
    })
    
    // Create summary box
    this.doc.setFillColor(...this.lightGray)
    this.doc.rect(20, yPos, this.doc.internal.pageSize.getWidth() - 40, 30, 'F')
    
    yPos += 8
    this.doc.setFontSize(10)
    this.doc.setTextColor(...this.textColor)
    
    this.doc.text(`Total Tasks: ${totalTasks}`, 30, yPos)
    this.doc.text(`Total Rooms: ${rooms.size}`, 90, yPos)
    this.doc.text(`Estimated Time: ${this.formatTime(totalTime)}`, 150, yPos)
    
    yPos += 8
    
    // Gather unique chemicals and tools
    const chemicals = new Set()
    const tools = new Set()
    
    checklist.selectedTasks?.forEach(task => {
      task.chemicals?.forEach(chem => chemicals.add(chem))
      task.tools?.forEach(tool => tools.add(tool))
    })
    
    if (chemicals.size > 0) {
      this.doc.text(`Chemicals: ${Array.from(chemicals).slice(0, 5).join(', ')}${chemicals.size > 5 ? '...' : ''}`, 30, yPos)
      yPos += 8
    }
    
    if (tools.size > 0) {
      this.doc.text(`Equipment: ${Array.from(tools).slice(0, 5).join(', ')}${tools.size > 5 ? '...' : ''}`, 30, yPos)
    }
  }

  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      const pageHeight = this.doc.internal.pageSize.getHeight()
      const pageWidth = this.doc.internal.pageSize.getWidth()
      
      // Page number
      this.doc.setFontSize(8)
      this.doc.setTextColor(128, 128, 128)
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
      
      // Signature lines if on last page
      if (i === pageCount) {
        const signY = pageHeight - 40
        
        this.doc.setDrawColor(128, 128, 128)
        this.doc.setLineWidth(0.3)
        
        // Client signature
        this.doc.line(30, signY, 90, signY)
        this.doc.text('Client Signature', 60, signY + 5, { align: 'center' })
        
        // Service provider signature
        this.doc.line(pageWidth - 90, signY, pageWidth - 30, signY)
        this.doc.text('Service Provider', pageWidth - 60, signY + 5, { align: 'center' })
        
        // Date lines
        const dateY = signY + 15
        this.doc.line(30, dateY, 90, dateY)
        this.doc.text('Date', 60, dateY + 5, { align: 'center' })
        
        this.doc.line(pageWidth - 90, dateY, pageWidth - 30, dateY)
        this.doc.text('Date', pageWidth - 60, dateY + 5, { align: 'center' })
      }
    }
  }

  formatTime(minutes) {
    if (!minutes) return '0 min'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins} min`
  }

  download(filename = 'checklist.pdf') {
    if (this.doc) {
      this.doc.save(filename)
    }
  }

  getBlob() {
    if (this.doc) {
      return this.doc.output('blob')
    }
    return null
  }

  getDataUri() {
    if (this.doc) {
      return this.doc.output('datauristring')
    }
    return null
  }
}

export default new PDFService()