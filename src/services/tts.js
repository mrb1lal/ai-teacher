import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, '../../cache/audio');

await fs.ensureDir(CACHE_DIR);

export class TTSService {
  constructor() {
    this.provider = process.env.TTS_PROVIDER || 'gemini';
    this.elevenlabsKey = process.env.ELEVENLABS_API_KEY;
  }

  async generateAudio(text, options = {}) {
    const { language = 'en', voice = 'default', speed = 1.0 } = options;
    const cacheKey = this.getCacheKey(text, language, voice, speed);
    const cachePath = path.join(CACHE_DIR, `${cacheKey}.mp3`);

    if (await fs.pathExists(cachePath)) {
      return { path: cachePath, cached: true };
    }

    let audioBuffer;
    
    switch (this.provider) {
      case 'elevenlabs':
        audioBuffer = await this.generateElevenLabs(text, voice, speed);
        break;
      case 'google':
        audioBuffer = await this.generateGoogleTTS(text, language);
        break;
      case 'gemini':
      default:
        audioBuffer = await this.generateGeminiTTS(text, language);
        break;
    }

    await fs.writeFile(cachePath, audioBuffer);
    return { path: cachePath, cached: false };
  }

  async generateGeminiTTS(text, language) {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `Generate a clear, natural pronunciation audio guide for this text: "${text}"
      Language: ${language}
      Provide detailed pronunciation instructions that could be used for TTS generation.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      return Buffer.from(response.text(), 'utf-8');
    } catch (error) {
      console.error('Gemini TTS error:', error);
      return this.generateFallbackAudio(text);
    }
  }

  async generateElevenLabs(text, voiceId, speed) {
    if (!this.elevenlabsKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || '21m00Tcm4TlvDq8ikWAM'}`,
      {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed
        }
      },
      {
        headers: {
          'xi-api-key': this.elevenlabsKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  }

  async generateGoogleTTS(text, language) {
    const response = await axios.get('https://translate.google.com/translate_tts', {
      params: {
        ie: 'UTF-8',
        q: text,
        tl: language,
        client: 'tw-ob'
      },
      responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
  }

  generateFallbackAudio(text) {
    const info = `FALLBACK AUDIO INFO:\nText: ${text}\nGenerated: ${new Date().toISOString()}\nNote: Actual TTS requires ElevenLabs or Google Cloud TTS API key.`;
    return Buffer.from(info, 'utf-8');
  }

  getCacheKey(text, language, voice, speed) {
    const str = `${text}|${language}|${voice}|${speed}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `tts_${Math.abs(hash).toString(36)}`;
  }

  async getAudioFile(text, options = {}) {
    const result = await this.generateAudio(text, options);
    return result.path;
  }

  async cleanupCache(maxAgeDays = 7) {
    const files = await fs.readdir(CACHE_DIR);
    const now = Date.now();
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;

    for (const file of files) {
      const filePath = path.join(CACHE_DIR, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtimeMs > maxAge) {
        await fs.remove(filePath);
      }
    }
  }
}

export const ttsService = new TTSService();
export default ttsService;