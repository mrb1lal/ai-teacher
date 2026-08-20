import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const TEXT_MODEL = 'gemini-1.5-flash';
const VISION_MODEL = 'gemini-1.5-flash';

export class GeminiService {
  constructor() {
    this.textModel = genAI.getGenerativeModel({ model: TEXT_MODEL });
    this.visionModel = genAI.getGenerativeModel({ model: VISION_MODEL });
  }

  async generateText(prompt, systemPrompt = '', options = {}) {
    try {
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
      
      const generationConfig = {
        temperature: options.temperature ?? 0.7,
        topK: options.topK ?? 40,
        topP: options.topP ?? 0.95,
        maxOutputTokens: options.maxTokens ?? 4096,
      };

      const result = await this.textModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();
      
      const usage = response.usageMetadata;
      const tokensUsed = usage ? usage.totalTokenCount : 0;

      return { text, tokensUsed };
    } catch (error) {
      console.error('Gemini text generation error:', error);
      throw new Error(`Failed to generate text: ${error.message}`);
    }
  }

  async generateTextWithHistory(history, systemPrompt = '', options = {}) {
    try {
      const contents = [];
      
      if (systemPrompt) {
        contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
        contents.push({ role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] });
      }

      for (const msg of history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }

      const generationConfig = {
        temperature: options.temperature ?? 0.7,
        topK: options.topK ?? 40,
        topP: options.topP ?? 0.95,
        maxOutputTokens: options.maxTokens ?? 4096,
      };

      const result = await this.textModel.generateContent({
        contents,
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();
      const usage = response.usageMetadata;
      const tokensUsed = usage ? usage.totalTokenCount : 0;

      return { text, tokensUsed };
    } catch (error) {
      console.error('Gemini history generation error:', error);
      throw new Error(`Failed to generate text with history: ${error.message}`);
    }
  }

  async analyzeImages(images, prompt, options = {}) {
    try {
      const imageParts = images.map(img => ({
        inlineData: {
          mimeType: img.mimeType || 'image/jpeg',
          data: img.data
        }
      }));

      const contents = [
        { role: 'user', parts: [{ text: prompt }, ...imageParts] }
      ];

      const generationConfig = {
        temperature: options.temperature ?? 0.4,
        topK: options.topK ?? 32,
        topP: options.topP ?? 0.9,
        maxOutputTokens: options.maxTokens ?? 4096,
      };

      const result = await this.visionModel.generateContent({
        contents,
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();
      const usage = response.usageMetadata;
      const tokensUsed = usage ? usage.totalTokenCount : 0;

      return { text, tokensUsed };
    } catch (error) {
      console.error('Gemini image analysis error:', error);
      throw new Error(`Failed to analyze images: ${error.message}`);
    }
  }

  async analyzeImageWithContext(images, context, prompt, options = {}) {
    try {
      const imageParts = images.map(img => ({
        inlineData: {
          mimeType: img.mimeType || 'image/jpeg',
          data: img.data
        }
      }));

      const contents = [
        { role: 'user', parts: [{ text: `Context: ${context}\n\nTask: ${prompt}` }, ...imageParts] }
      ];

      const generationConfig = {
        temperature: options.temperature ?? 0.4,
        topK: options.topK ?? 32,
        topP: options.topP ?? 0.9,
        maxOutputTokens: options.maxTokens ?? 4096,
      };

      const result = await this.visionModel.generateContent({
        contents,
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();
      const usage = response.usageMetadata;
      const tokensUsed = usage ? usage.totalTokenCount : 0;

      return { text, tokensUsed };
    } catch (error) {
      console.error('Gemini image with context error:', error);
      throw new Error(`Failed to analyze images with context: ${error.message}`);
    }
  }

  async generateAudioScript(text, language = 'en') {
    const prompt = `Convert this text to a natural, clear pronunciation guide for English learners. 
    Text: "${text}"
    Language: ${language}
    
    Provide:
    1. IPA transcription
    2. Syllable breakdown
    3. Stress markers
    4. Common pronunciation tips for learners
    5. Audio generation instructions (pace, intonation)`;

    return this.generateText(prompt, '', { temperature: 0.3, maxTokens: 1024 });
  }

  async extractVocabularyFromText(text) {
    const prompt = `Extract key vocabulary words from this text that would be useful for English learners.
    Text: "${text}"
    
    Return a JSON array of objects with:
    - word: the vocabulary word
    - definition: simple English definition
    - example: example sentence
    - difficulty: beginner/intermediate/advanced
    - ipa: IPA transcription if possible`;

    return this.generateText(prompt, '', { temperature: 0.3, maxTokens: 2048 });
  }

  async estimateUserLevel(conversationHistory) {
    const prompt = `Analyze this conversation and estimate the user's English proficiency level (CEFR: A1, A2, B1, B2, C1, C2) and approximate IELTS band score (0-9).
    
    Conversation:
    ${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
    
    Consider: grammar accuracy, vocabulary range, fluency, complexity of ideas.
    Return JSON: { "cefr_level": "...", "ielts_estimate": 0.0, "reasoning": "..." }`;

    return this.generateText(prompt, '', { temperature: 0.2, maxTokens: 1024 });
  }

  async identifyWeakStrongTopics(conversationHistory) {
    const prompt = `Analyze this conversation and identify topics the user struggles with (weak topics) and topics they handle well (strong topics).
    
    Conversation:
    ${conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n')}
    
    Return JSON: { "weak_topics": [...], "strong_topics": [...], "reasoning": "..." }`;

    return this.generateText(prompt, '', { temperature: 0.2, maxTokens: 1024 });
  }
}

export const geminiService = new GeminiService();
export default geminiService;