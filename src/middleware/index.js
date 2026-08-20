import { UserService } from '../database/service.js';

export function userMiddleware() {
  return async (ctx, next) => {
    if (ctx.from) {
      const user = UserService.getByTelegramId(ctx.from.id);
      if (user) {
        ctx.dbUser = user;
      }
    }
    return next();
  };
}

export function sessionMiddleware() {
  return async (ctx, next) => {
    ctx.session = ctx.session || {};
    return next();
  };
}

export function loggingMiddleware() {
  return async (ctx, next) => {
    const start = Date.now();
    const userInfo = ctx.from ? `${ctx.from.id} (@${ctx.from.username || 'no-username'})` : 'unknown';
    const updateType = Object.keys(ctx.update).find(k => k !== 'update_id');
    
    console.log(`[${new Date().toISOString()}] ${userInfo} - ${updateType}`);
    
    try {
      await next();
    } finally {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] Completed in ${duration}ms`);
    }
  };
}

export function errorMiddleware() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      console.error('Bot error:', error);
      console.error('Update:', JSON.stringify(ctx.update, null, 2));
      
      try {
        await ctx.reply('❌ An error occurred. Please try again or contact support if it persists.');
      } catch (e) {
        console.error('Failed to send error message:', e);
      }
    }
  };
}

export function rateLimitMiddleware(maxRequests = 30, windowMs = 60000) {
  const requests = new Map();
  
  return async (ctx, next) => {
    if (!ctx.from) return next();
    
    const userId = ctx.from.id;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(userId)) {
      requests.set(userId, []);
    }
    
    const userRequests = requests.get(userId).filter(t => t > windowStart);
    
    if (userRequests.length >= maxRequests) {
      const resetTime = Math.ceil((userRequests[0] + windowMs - now) / 1000);
      await ctx.reply(`⏱️ Rate limit exceeded. Please wait ${resetTime}s before sending more messages.`);
      return;
    }
    
    userRequests.push(now);
    requests.set(userId, userRequests);
    
    if (requests.size > 1000) {
      for (const [id, times] of requests.entries()) {
        const filtered = times.filter(t => t > windowStart);
        if (filtered.length === 0) requests.delete(id);
        else requests.set(id, filtered);
      }
    }
    
    return next();
  };
}

export default {
  userMiddleware,
  sessionMiddleware,
  loggingMiddleware,
  errorMiddleware,
  rateLimitMiddleware
};