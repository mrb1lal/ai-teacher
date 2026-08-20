import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, '../../cache/images');
const MAX_IMAGES = parseInt(process.env.MAX_IMAGES_PER_MESSAGE) || 6;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

await fs.ensureDir(CACHE_DIR);

export class ImageService {
  constructor(bot) {
    this.bot = bot;
  }

  async downloadTelegramPhoto(fileId) {
    try {
      const fileLink = await this.bot.telegram.getFileLink(fileId);
      const response = await axios.get(fileLink.href, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      if (response.data.length > MAX_FILE_SIZE) {
        throw new Error('Image too large (max 20MB)');
      }

      const mimeType = response.headers['content-type'] || 'image/jpeg';
      const extension = this.getExtensionFromMime(mimeType);
      const filename = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${extension}`;
      const filepath = path.join(CACHE_DIR, filename);

      await fs.writeFile(filepath, response.data);
      
      return {
        path: filepath,
        mimeType,
        size: response.data.length,
        base64: response.data.toString('base64')
      };
    } catch (error) {
      console.error('Image download error:', error);
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  async downloadTelegramDocument(fileId) {
    try {
      const fileLink = await this.bot.telegram.getFileLink(fileId);
      const response = await axios.get(fileLink.href, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      if (response.data.length > MAX_FILE_SIZE) {
        throw new Error('File too large (max 20MB)');
      }

      const mimeType = response.headers['content-type'] || 'application/octet-stream';
      if (!mimeType.startsWith('image/')) {
        throw new Error('File is not an image');
      }

      const extension = this.getExtensionFromMime(mimeType);
      const filename = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${extension}`;
      const filepath = path.join(CACHE_DIR, filename);

      await fs.writeFile(filepath, response.data);
      
      return {
        path: filepath,
        mimeType,
        size: response.data.length,
        base64: response.data.toString('base64')
      };
    } catch (error) {
      console.error('Document download error:', error);
      throw new Error(`Failed to download document: ${error.message}`);
    }
  }

  async processImages(ctx, maxImages = MAX_IMAGES) {
    const images = [];
    
    if (ctx.message.photo) {
      const photoArray = Array.isArray(ctx.message.photo) ? ctx.message.photo : [ctx.message.photo];
      const sortedPhotos = photoArray.sort((a, b) => b.file_size - a.file_size);
      
      for (let i = 0; i < Math.min(sortedPhotos.length, maxImages); i++) {
        try {
          const image = await this.downloadTelegramPhoto(sortedPhotos[i].file_id);
          images.push(image);
        } catch (error) {
          console.error(`Failed to process photo ${i}:`, error);
        }
      }
    }

    if (ctx.message.document && ctx.message.document.mime_type?.startsWith('image/')) {
      try {
        const image = await this.downloadTelegramDocument(ctx.message.document.file_id);
        images.push(image);
      } catch (error) {
        console.error('Failed to process document image:', error);
      }
    }

    if (ctx.message.media_group_id) {
      console.log('Media group detected, but handling individual messages for simplicity');
    }

    return images;
  }

  async processImagesFromMediaGroup(bot, mediaGroupId, maxImages = MAX_IMAGES) {
    console.log('Media group processing not fully implemented - handle via individual messages');
    return [];
  }

  getExtensionFromMime(mimeType) {
    const extensions = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/bmp': '.bmp',
      'image/tiff': '.tiff',
      'image/heic': '.heic',
      'image/heif': '.heif'
    };
    return extensions[mimeType] || '.jpg';
  }

  validateImageCount(count) {
    return count <= MAX_IMAGES;
  }

  formatImageForGemini(imageData) {
    return {
      mimeType: imageData.mimeType,
      data: imageData.base64
    };
  }

  formatImagesForGemini(images) {
    return images.map(img => this.formatImageForGemini(img));
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

  getCacheInfo() {
    return { cacheDir: CACHE_DIR, maxImages: MAX_IMAGES, maxFileSize: MAX_FILE_SIZE };
  }
}

export default ImageService;