import 'dotenv/config';
import http from 'http';
import { Telegraf, session } from 'telegraf';
import { initDatabase, closeDatabase } from './database/init.js';
import { 
  handleStart, 
  handleHelp, 
  handleProfile, 
  handleHistory, 
  handleClear, 
  handleRecommend,
  handleLanguage,
  handlePDFReport,
  handlePDFLesson,
  handlePDFVocab,
  handleAdminPanel,
  handleAdminUsers,
  handleAdminBroadcast,
  handleAdminStats,
  handleAdminUser,
  handleTextMessage,
  handleAudioRequest,
  handleImages,
  handleDocument,
  handleVoice,
  handleCallbackQuery
} from './handlers/messages.js';
import { 
  userMiddleware, 
  sessionMiddleware, 
  loggingMiddleware, 
  errorMiddleware, 
  rateLimitMiddleware 
} from './middleware/index.js';
import { ImageService } from './services/image.js';
import { SessionService } from './database/service.js';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found in environment variables!');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables!');
  process.exit(1);
}

initDatabase();

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use(loggingMiddleware());
bot.use(errorMiddleware());
bot.use(rateLimitMiddleware(30, 60000));
bot.use(userMiddleware());
bot.use(sessionMiddleware());

const imageService = new ImageService(bot);

bot.use((ctx, next) => {
  ctx.imageService = imageService;
  return next();
});

bot.start(handleStart);
bot.help(handleHelp);
bot.command('profile', handleProfile);
bot.command('history', handleHistory);
bot.command('clear', handleClear);
bot.command('recommend', handleRecommend);
bot.command('lang', handleLanguage);
bot.command('pdfreport', handlePDFReport);
bot.command('pdflesson', handlePDFLesson);
bot.command('pdfvocab', handlePDFVocab);

// Admin commands (only for admin user)
bot.command('admin', handleAdminPanel);
bot.command('admin_users', handleAdminUsers);
bot.command('admin_broadcast', handleAdminBroadcast);
bot.command('admin_stats', handleAdminStats);
bot.command('admin_user', handleAdminUser);

bot.on('text', async (ctx, next) => {
  const text = ctx.message.text;
  
  if (text.startsWith('/')) {
    return next();
  }
  
  if (/^(pronounce|read|audio|speak|say|generate audio for)[\s:]/i.test(text)) {
    return handleAudioRequest(ctx);
  }
  
  if (/^(create|make|generate)\s+(?:a\s+)?(?:pdf|lesson)\s+(?:for|about|on)\s+/i.test(text)) {
    return handlePDFLesson(ctx);
  }
  
  if (/^(create|make|generate)\s+(?:a\s+)?(?:pdf|vocab|vocabulary)\s+(?:for|from|with)\s+/i.test(text)) {
    return handlePDFVocab(ctx);
  }
  
  return handleTextMessage(ctx);
});

bot.on('photo', handleImages);
bot.on('document', handleDocument);
bot.on('voice', handleVoice);
bot.on('callback_query', handleCallbackQuery);

bot.catch((err, ctx) => {
  console.error('Unhandled error:', err);
  console.error('Context:', ctx?.update?.update_id);
});

async function gracefulShutdown() {
  console.log('\n🛑 Shutting down gracefully...');
  
  try {
    const users = await import('./database/service.js').then(m => m.UserService.getAllActive());
    for (const user of users) {
      SessionService.end(user.id);
    }
  } catch (e) {
    console.error('Error ending sessions:', e);
  }
  
  bot.stop('SIGINT');
  closeDatabase();
  console.log('✅ Shutdown complete');
  process.exit(0);
}

process.once('SIGINT', gracefulShutdown);
process.once('SIGTERM', gracefulShutdown);

// Health check endpoint for Render free tier
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL; // e.g. https://your-app.onrender.com

const server = http.createServer(async (req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }
  
  if (req.url === '/webhook' && req.method === 'POST') {
    // Telegraf webhook handling
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        bot.handleUpdate(update);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
    return;
  }
  
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => console.log(`🌐 Server on port ${PORT}`));

// Set webhook and launch
if (WEBHOOK_URL) {
  await bot.telegram.setWebhook(`${WEBHOOK_URL}/webhook`);
  console.log(`🔗 Webhook set: ${WEBHOOK_URL}/webhook`);
}

bot.launch().then(() => {
  console.log('🤖 AI English Teacher Bot started successfully!');
  console.log(`📝 Bot: @${bot.botInfo?.username || 'unknown'}`);
  console.log('🔧 Features enabled:');
  console.log('   ✅ Gemini AI chat with full memory');
  console.log('   ✅ Audio pronunciation generation');
  console.log('   ✅ Multi-image analysis (up to 6)');
  console.log('   ✅ User profiling & level estimation');
  console.log('   ✅ Study pattern detection');
  console.log('   ✅ Personalized recommendations');
  console.log('   ✅ SQLite database with WAL mode');
  console.log('   ✅ Rate limiting & error handling');
  console.log('\n💡 Press Ctrl+C to stop');
}).catch((err) => {
  console.error('❌ Failed to start bot:', err);
  process.exit(1);
});

export default bot;