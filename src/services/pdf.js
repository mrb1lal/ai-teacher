import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProfileService, ChatHistoryService } from '../database/service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PDF_DIR = path.resolve(__dirname, '../../data/pdfs');
await fs.ensureDir(PDF_DIR);

export class PDFService {
  async generateStudyReport(userId) {
    const profile = ProfileService.getProfileSummary(userId);
    const chatStats = ChatHistoryService.getStats(userId);
    const recentMessages = ChatHistoryService.getRecent(userId, 20);

    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;

    const drawText = (text, font = timesRomanFont, size = 12, color = rgb(0, 0, 0), x = margin) => {
      page.drawText(text, { x, y, size, font, color });
      y -= size + 4;
    };

    const drawLine = () => {
      page.drawLine({
        start: { x: margin, y: y + 2 },
        end: { x: width - margin, y: y + 2 },
        thickness: 1,
        color: rgb(0.7, 0.7, 0.7)
      });
      y -= 10;
    };

    const checkSpace = (needed = 50) => {
      if (y < margin + needed) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - margin;
      }
    };

    drawText('AI ENGLISH TEACHER - STUDY REPORT', timesRomanBold, 24, rgb(0.1, 0.3, 0.6));
    drawText(`Generated: ${new Date().toLocaleString()}`, timesRomanFont, 10, rgb(0.5, 0.5, 0.5));
    drawLine();

    drawText('PROFILE SUMMARY', timesRomanBold, 16, rgb(0.1, 0.3, 0.6));
    drawText(`English Level (CEFR): ${profile.englishLevel.toUpperCase()}`, timesRomanFont, 12);
    drawText(`Estimated IELTS Band: ${profile.estimatedIelts.toFixed(1)}`, timesRomanFont, 12);
    drawText(`Total Messages: ${profile.totalMessages}`, timesRomanFont, 12);
    drawText(`Audio Requests: ${profile.totalAudioRequests}`, timesRomanFont, 12);
    drawText(`Images Analyzed: ${profile.totalImagesAnalyzed}`, timesRomanFont, 12);
    drawText(`Preferred Study Hours: ${profile.preferredStudyHours.map(h => `${h}:00`).join(', ') || 'Not enough data'}`, timesRomanFont, 12);
    drawText(`Last Active Hour: ${profile.lastActiveHour ? `${profile.lastActiveHour}:00` : 'Unknown'}`, timesRomanFont, 12);
    drawLine();

    drawText('WEAK TOPICS (Need Practice)', timesRomanBold, 14, rgb(0.7, 0.2, 0.2));
    if (profile.weakTopics.length > 0) {
      profile.weakTopics.forEach((topic, i) => {
        checkSpace();
        drawText(`${i + 1}. ${topic}`, timesRomanFont, 11, rgb(0.5, 0.1, 0.1), margin + 10);
      });
    } else {
      drawText('No weak topics identified yet.', timesRomanFont, 11, rgb(0.5, 0.5, 0.5), margin + 10);
    }
    drawLine();

    drawText('STRONG TOPICS (Mastered)', timesRomanBold, 14, rgb(0.2, 0.6, 0.2));
    if (profile.strongTopics.length > 0) {
      profile.strongTopics.forEach((topic, i) => {
        checkSpace();
        drawText(`${i + 1}. ${topic}`, timesRomanFont, 11, rgb(0.1, 0.5, 0.1), margin + 10);
      });
    } else {
      drawText('No strong topics identified yet.', timesRomanFont, 11, rgb(0.5, 0.5, 0.5), margin + 10);
    }
    drawLine();

    drawText('CHAT STATISTICS', timesRomanBold, 14, rgb(0.1, 0.3, 0.6));
    drawText(`Total Messages: ${chatStats?.total_messages || 0}`, timesRomanFont, 12);
    drawText(`Your Messages: ${chatStats?.user_messages || 0}`, timesRomanFont, 12);
    drawText(`Bot Responses: ${chatStats?.assistant_messages || 0}`, timesRomanFont, 12);
    drawText(`Total Tokens Used: ${chatStats?.total_tokens || 0}`, timesRomanFont, 12);
    drawText(`First Conversation: ${chatStats?.first_message ? new Date(chatStats.first_message).toLocaleDateString() : 'N/A'}`, timesRomanFont, 12);
    drawText(`Last Conversation: ${chatStats?.last_message ? new Date(chatStats.last_message).toLocaleDateString() : 'N/A'}`, timesRomanFont, 12);
    drawLine();

    drawText('RECENT CONVERSATION HISTORY', timesRomanBold, 14, rgb(0.1, 0.3, 0.6));
    for (const msg of recentMessages.slice(-10)) {
      checkSpace(80);
      const role = msg.role === 'user' ? 'YOU' : 'AI TEACHER';
      const time = new Date(msg.created_at).toLocaleString();
      drawText(`[${time}] ${role}:`, timesRomanBold, 10, rgb(0.2, 0.2, 0.2));
      const content = msg.content.length > 150 ? msg.content.substring(0, 150) + '...' : msg.content;
      const lines = this.wrapText(content, width - 2 * margin - 20, timesRomanFont, 10);
      lines.forEach(line => {
        checkSpace();
        drawText(line, timesRomanFont, 10, rgb(0.3, 0.3, 0.3), margin + 10);
      });
      y -= 5;
    }
    drawLine();

    drawText('RECOMMENDATIONS', timesRomanBold, 14, rgb(0.1, 0.3, 0.6));
    const recommendations = this.generateRecommendations(profile);
    recommendations.forEach((rec, i) => {
      checkSpace();
      drawText(`${i + 1}. ${rec}`, timesRomanFont, 11, rgb(0.2, 0.2, 0.6), margin + 10);
    });

    const pdfBytes = await pdfDoc.save();
    const filename = `study_report_${userId}_${Date.now()}.pdf`;
    const filepath = path.join(PDF_DIR, filename);
    await fs.writeFile(filepath, pdfBytes);
    
    return filepath;
  }

  async generateVocabularyPDF(userId, words, title = 'Vocabulary List') {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;

    const drawText = (text, f = font, size = 12, x = margin) => {
      page.drawText(text, { x, y, size, font: f });
      y -= size + 4;
    };

    const checkSpace = (needed = 40) => {
      if (y < margin + needed) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - margin;
      }
    };

    drawText(title, boldFont, 20, rgb(0.1, 0.3, 0.6));
    drawText(`Generated: ${new Date().toLocaleString()}`, font, 10, rgb(0.5, 0.5, 0.5));
    drawText(`Total words: ${words.length}`, font, 10, rgb(0.5, 0.5, 0.5));
    y -= 10;

    words.forEach((word, i) => {
      checkSpace(60);
      drawText(`${i + 1}. ${word.word}`, boldFont, 13, rgb(0.1, 0.3, 0.6));
      drawText(`   Definition: ${word.definition}`, font, 11);
      if (word.example) {
        drawText(`   Example: ${word.example}`, font, 10, rgb(0.3, 0.3, 0.3));
      }
      if (word.ipa) {
        drawText(`   IPA: /${word.ipa}/`, font, 10, rgb(0.4, 0.4, 0.4));
      }
      if (word.difficulty) {
        drawText(`   Level: ${word.difficulty}`, font, 10, rgb(0.5, 0.5, 0.5));
      }
      y -= 5;
    });

    const pdfBytes = await pdfDoc.save();
    const filename = `vocabulary_${userId}_${Date.now()}.pdf`;
    const filepath = path.join(PDF_DIR, filename);
    await fs.writeFile(filepath, pdfBytes);
    
    return filepath;
  }

  async generateLessonPDF(userId, topic, content, exercises = []) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;

    const drawText = (text, f = font, size = 12, x = margin) => {
      page.drawText(text, { x, y, size, font: f });
      y -= size + 4;
    };

    const checkSpace = (needed = 40) => {
      if (y < margin + needed) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - margin;
      }
    };

    const wrapAndDraw = (text, f = font, size = 11, indent = 0) => {
      const lines = this.wrapText(text, width - 2 * margin - indent, f, size);
      lines.forEach(line => {
        checkSpace();
        drawText(line, f, size, margin + indent);
      });
    };

    drawText(`LESSON: ${topic.toUpperCase()}`, boldFont, 20, rgb(0.1, 0.3, 0.6));
    drawText(`Date: ${new Date().toLocaleDateString()}`, font, 10, rgb(0.5, 0.5, 0.5));
    y -= 10;

    drawText('CONTENT', boldFont, 14, rgb(0.1, 0.3, 0.6));
    wrapAndDraw(content);
    y -= 10;

    if (exercises.length > 0) {
      drawLine();
      drawText('EXERCISES', boldFont, 14, rgb(0.1, 0.3, 0.6));
      exercises.forEach((ex, i) => {
        checkSpace(60);
        drawText(`Exercise ${i + 1}:`, boldFont, 12);
        wrapAndDraw(ex.question || ex);
        if (ex.answer) {
          drawText(`Answer: ${ex.answer}`, font, 11, rgb(0.2, 0.6, 0.2), margin + 10);
        }
        y -= 8;
      });
    }

    const pdfBytes = await pdfDoc.save();
    const filename = `lesson_${topic.replace(/\s+/g, '_')}_${userId}_${Date.now()}.pdf`;
    const filepath = path.join(PDF_DIR, filename);
    await fs.writeFile(filepath, pdfBytes);
    
    return filepath;
  }

  wrapText(text, maxWidth, font, size) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, size);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  generateRecommendations(profile) {
    const recs = [];
    
    if (profile.weakTopics.length > 0) {
      recs.push(`Focus on weak areas: ${profile.weakTopics.slice(0, 3).join(', ')}`);
      recs.push('Practice these topics daily with exercises and examples');
    }
    
    if (profile.strongTopics.length > 0) {
      recs.push(`Maintain strength in: ${profile.strongTopics.slice(0, 3).join(', ')}`);
    }
    
    if (profile.preferredStudyHours.length > 0) {
      const bestHour = profile.preferredStudyHours[0];
      recs.push(`Study at ${bestHour}:00 when you're most active`);
    }
    
    if (profile.estimatedIelts < 6.0) {
      recs.push('Target IELTS 6.0+: Practice writing essays & speaking daily');
    } else if (profile.estimatedIelts < 7.0) {
      recs.push('Target IELTS 7.0+: Focus on advanced vocabulary & complex grammar');
    } else {
      recs.push('Excellent level! Practice native-level content (podcasts, news, literature)');
    }
    
    if (profile.totalMessages < 50) {
      recs.push('Chat more with AI Teacher to improve fluency and get better analysis');
    }
    
    if (profile.totalAudioRequests < 10) {
      recs.push('Use audio feature more: "pronounce: [word]" for pronunciation practice');
    }
    
    return recs.length > 0 ? recs : ['Keep practicing regularly!'];
  }
}

export const pdfService = new PDFService();
export default pdfService;