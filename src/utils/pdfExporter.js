import { jsPDF } from 'jspdf';

/**
 * PDF Export Utility for World Building App
 * Creates a professional PDF document from the generated world data
 */
class WorldPDFExporter {
  constructor() {
    this.pdf = null;
    this.pageWidth = 210; // A4 width in mm
    this.pageHeight = 297; // A4 height in mm
    this.margin = 20;
    this.currentY = 20;
    this.lineHeight = 7;
    this.brandColor = '#3f4d64';
  }

  /**
   * Initialize a new PDF document
   */
  initializePDF() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.currentY = this.margin;
  }

  /**
   * Add header with logo branding
   */
  addHeader(worldType, userIdea) {
    // Brand background
    this.pdf.setFillColor(63, 77, 100); // #3f4d64
    this.pdf.rect(0, 0, this.pageWidth, 40, 'F');

    // Brand text
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('LUMINA OZ', this.margin, 20);
    
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Game Dev - World Building Tool', this.margin, 28);

    // World info
    this.pdf.setFontSize(12);
    this.pdf.text(`World Type: ${worldType}`, this.margin, 35);

    this.currentY = 50;
  }

  /**
   * Add a section header
   */
  addSectionHeader(title) {
    this.checkPageBreak(15);
    
    this.pdf.setTextColor(63, 77, 100);
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    
    // Underline
    this.pdf.setDrawColor(63, 77, 100);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY + 2, this.margin + 60, this.currentY + 2);
    
    this.currentY += 12;
  }

  /**
   * Add regular text content
   */
  addText(text, fontSize = 11, fontStyle = 'normal') {
    if (!text) return;

    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontStyle);

    const textWidth = this.pageWidth - (2 * this.margin);
    const lines = this.pdf.splitTextToSize(text, textWidth);
    
    for (let line of lines) {
      this.checkPageBreak(this.lineHeight);
      this.pdf.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }
    
    this.currentY += 3; // Extra spacing after text blocks
  }

  /**
   * Add a character card
   */
  addCharacterCard(character, index) {
    this.checkPageBreak(25);

    // Card background
    this.pdf.setFillColor(248, 250, 252);
    this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (2 * this.margin), 20, 'F');

    // Character number badge
    this.pdf.setFillColor(139, 92, 246);
    this.pdf.circle(this.margin + 8, this.currentY + 2, 4, 'F');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${index + 1}`, this.margin + 6, this.currentY + 3);

    // Character info
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(character.name || `Character ${index + 1}`, this.margin + 20, this.currentY + 2);

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text(character.role || 'Role not specified', this.margin + 20, this.currentY + 8);

    this.pdf.setTextColor(0, 0, 0);
    const descText = character.description || 'Character description available for expansion';
    const lines = this.pdf.splitTextToSize(descText, this.pageWidth - (2 * this.margin) - 20);
    
    let textY = this.currentY + 12;
    for (let line of lines.slice(0, 2)) { // Limit to 2 lines in card
      this.pdf.text(line, this.margin + 20, textY);
      textY += 5;
    }

    this.currentY += 25;
  }

  /**
   * Add a scenario card
   */
  addScenarioCard(index) {
    this.checkPageBreak(20);

    // Card background
    this.pdf.setFillColor(239, 246, 255);
    this.pdf.rect(this.margin, this.currentY - 5, this.pageWidth - (2 * this.margin), 18, 'F');

    // Scenario number badge
    this.pdf.setFillColor(59, 130, 246);
    this.pdf.circle(this.margin + 8, this.currentY + 2, 4, 'F');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${index + 1}`, this.margin + 6, this.currentY + 3);

    // Scenario info
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`Scenario ${index + 1}`, this.margin + 20, this.currentY + 2);

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);
    this.pdf.text('Quest', this.margin + 20, this.currentY + 8);

    this.pdf.setTextColor(0, 0, 0);
    const descText = 'This scenario represents a key moment or location in your world, offering unique challenges and opportunities for storytelling.';
    const lines = this.pdf.splitTextToSize(descText, this.pageWidth - (2 * this.margin) - 20);
    
    this.pdf.text(lines[0], this.margin + 20, this.currentY + 12);

    this.currentY += 23;
  }

  /**
   * Add game/book idea
   */
  addGameBookIdea(idea, index) {
    this.checkPageBreak(15);

    this.pdf.setTextColor(34, 197, 94);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${index + 1}. ${idea.title}`, this.margin, this.currentY);
    
    this.currentY += 7;
    
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.addText(idea.synopsis, 10);
  }

  /**
   * Add customization option
   */
  addCustomizationOption(option, index) {
    this.checkPageBreak(12);

    this.pdf.setTextColor(245, 158, 11);
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${index + 1}. ${option.title}`, this.margin, this.currentY);
    
    this.currentY += 6;
    
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.addText(option.description, 10);
  }

  /**
   * Check if we need a page break
   */
  checkPageBreak(spaceNeeded) {
    if (this.currentY + spaceNeeded > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  /**
   * Add footer with page numbers and branding
   */
  addFooter() {
    const pageCount = this.pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      
      // Footer line
      this.pdf.setDrawColor(200, 200, 200);
      this.pdf.setLineWidth(0.3);
      this.pdf.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
      
      // Page number
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(`Page ${i} of ${pageCount}`, this.pageWidth - this.margin - 20, this.pageHeight - 8);
      
      // Brand footer
      this.pdf.text('Generated by Lumina Oz Game Dev - World Building Tool', this.margin, this.pageHeight - 8);
    }
  }

  /**
   * Main export function
   */
  async exportWorldToPDF(worldData) {
    if (!worldData) {
      throw new Error('No world data to export');
    }

    this.initializePDF();

    const {
      worldNarrative,
      gameBookIdeas,
      customizationOptions,
      characterConcepts,
      conceptualMaps,
      userIdea,
      worldType
    } = worldData;

    // Header
    this.addHeader(worldType, userIdea);

    // User's original idea
    this.addSectionHeader('Original World Idea');
    this.addText(`"${userIdea}"`, 12, 'italic');

    // World Narrative
    if (worldNarrative) {
      this.addSectionHeader('World Narrative');
      this.addText(worldNarrative);
    }

    // Character Concepts (always show 6)
    this.addSectionHeader('Character Concepts');
    const allCharacters = [...(characterConcepts || [])];
    
    // Fill up to 6 characters
    while (allCharacters.length < 6) {
      allCharacters.push({
        name: `Character ${allCharacters.length + 1}`,
        role: 'Available for expansion',
        description: 'Additional character concept available for development in your world.'
      });
    }

    allCharacters.slice(0, 6).forEach((character, index) => {
      this.addCharacterCard(character, index);
    });

    // World Scenarios (always show 3)
    this.addSectionHeader('World Scenarios');
    for (let i = 0; i < 3; i++) {
      this.addScenarioCard(i);
    }

    // Game & Book Ideas
    if (gameBookIdeas && gameBookIdeas.length > 0) {
      this.addSectionHeader('Game & Book Ideas');
      gameBookIdeas.forEach((idea, index) => {
        this.addGameBookIdea(idea, index);
      });
    }

    // Customization Options
    if (customizationOptions && customizationOptions.length > 0) {
      this.addSectionHeader('Customization Options');
      customizationOptions.forEach((option, index) => {
        this.addCustomizationOption(option, index);
      });
    }

    // Conceptual Maps
    if (conceptualMaps) {
      this.addSectionHeader('Conceptual Maps & Regions');
      this.addText(conceptualMaps);
    }

    // Footer
    this.addFooter();

    // Generate filename
    const sanitizedWorldType = worldType.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `world_${sanitizedWorldType}_${timestamp}.pdf`;

    // Save the PDF
    this.pdf.save(filename);

    return filename;
  }
}

export default WorldPDFExporter;