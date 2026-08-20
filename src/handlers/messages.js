import { UserService, ChatHistoryService, SessionService } from '../database/service.js';
import { geminiService } from '../services/gemini.js';
import { ttsService } from '../services/tts.js';
import { userProfiler } from '../services/profiler.js';

const MAX_HISTORY = parseInt(process.env.MAX_CHAT_HISTORY) || 100;

export async function handleStart(ctx) {
  const user = ctx.from;
  const dbUser = UserService.createOrUpdate(user.id, {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    language_code: user.language_code
  });

  SessionService.start(dbUser.id);

  const welcomeMessage = `👋 Welcome to AI English Teacher!

I'm your personal English tutor powered by Gemini AI. Here's what I can do:

📚 **Explain any English topic** - Just ask me anything!
🔊 **Pronunciation audio** - Send me words/phrases and I'll generate audio
🖼️ **Analyze images** - Send up to 6 images at once (text, exercises, etc.)
💾 **Full chat memory** - I remember our entire conversation
📊 **Personalized learning** - I track your level, weak/strong topics, and study patterns

**Commands:**
/start - Show this message
/profile - View your learning profile
/history - View chat history stats
/clear - Clear chat history
/recommend - Get personalized study recommendations
/help - Show detailed help

Just start chatting! Ask me about grammar, vocabulary, idioms, IELTS prep, or anything English-related.`;

  await ctx.reply(welcomeMessage);
}

export async function handleHelp(ctx) {
  const helpMessage = `📖 **AI English Teacher - Detailed Help**

**🗣️ Text Chat:**
- Ask any English question: grammar, vocabulary, idioms, phrasal verbs, etc.
- Request explanations: "Explain the difference between 'make' and 'do'"
- Practice conversations: "Let's practice a job interview"
- IELTS/TOEFL prep: "Give me IELTS speaking topic with sample answer"

**🔊 Audio Generation:**
- Send any word/phrase and say "pronounce this" or "read this"
- I'll generate pronunciation guide with IPA, stress markers, and audio
- Example: "pronounce: entrepreneurship" or "read this: The quick brown fox..."

**🖼️ Image Analysis (up to 6 images):**
- Send photos of textbook pages, exercises, signs, menus, etc.
- Ask: "Explain this grammar exercise" or "Translate this menu"
- Multiple images: Send 5-6 photos at once, I'll analyze all

**📊 Your Profile (Auto-built):**
- English level (CEFR) & estimated IELTS band
- Weak topics you struggle with
- Strong topics you've mastered
- Your preferred study hours
- Personalized recommendations

**💾 Memory & History:**
- Full conversation history saved
- Context-aware responses
- /history to see stats
- /clear to reset (but profile stays)

**⚡ Tips for Best Results:**
1. Be specific: "Explain present perfect vs past simple with examples"
2. Send context: "I'm B1 level, explain simply"
3. Use images for textbook exercises
4. Ask for audio for new vocabulary
5. Chat regularly - I learn your patterns!`;

  await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
}

export async function handleProfile(ctx) {
  const user = ctx.from;
  const dbUser = UserService.getByTelegramId(user.id);
  
  if (!dbUser) {
    await ctx.reply('User not found. Please /start first.');
    return;
  }

  const summary = await userProfiler.getUserSummary(dbUser.id);
  
  const profile = summary.profile;
  const chatStats = summary.chatStats;
  const sessionStats = summary.sessionStats;

  const weakTopics = profile.weakTopics.length > 0 ? profile.weakTopics.join(', ') : 'Not identified yet';
  const strongTopics = profile.strongTopics.length > 0 ? profile.strongTopics.join(', ') : 'Not identified yet';
  const studyHours = profile.preferredStudyHours.length > 0 
    ? profile.preferredStudyHours.map(h => `${h}:00`).join(', ') 
    : 'Not enough data';

  const message = `📊 **Your Learning Profile**

**👤 Basic Info:**
- Name: ${dbUser.first_name || 'N/A'} ${dbUser.last_name || ''}
- Username: @${dbUser.username || 'N/A'}
- Member since: ${new Date(dbUser.created_at).toLocaleDateString()}

**📈 English Level:**
- CEFR Level: **${profile.englishLevel.toUpperCase()}**
- Estimated IELTS: **${profile.estimatedIelts.toFixed(1)}**

**🎯 Topic Analysis:**
- Weak areas: ${weakTopics}
- Strong areas: ${strongTopics}

**⏰ Study Patterns:**
- Preferred hours: ${studyHours}
- Last active: ${profile.lastActiveHour ? `${profile.lastActiveHour}:00` : 'Unknown'}

**📊 Activity Stats:**
- Total messages: ${profile.totalMessages}
- Audio requests: ${profile.totalAudioRequests}
- Images analyzed: ${profile.totalImagesAnalyzed}
- Chat history: ${chatStats?.user_messages || 0} user / ${chatStats?.assistant_messages || 0} bot messages
- Total tokens used: ${chatStats?.total_tokens || 0}
- Sessions (30 days): ${sessionStats?.total_sessions || 0}
- Avg messages/session: ${sessionStats?.avg_messages_per_session?.toFixed(1) || 0}

**🎯 Learning Goals:** ${profile.learningGoals || 'Not set - tell me your goals!'}

Use /recommend for personalized study recommendations!`;

  await ctx.reply(message, { parse_mode: 'Markdown' });
}

export async function handleHistory(ctx) {
  const user = ctx.from;
  const dbUser = UserService.getByTelegramId(user.id);
  
  if (!dbUser) {
    await ctx.reply('User not found. Please /start first.');
    return;
  }

  const stats = ChatHistoryService.getStats(dbUser.id);
  const recent = ChatHistoryService.getRecent(dbUser.id, 10);

  let message = `📜 **Chat History Stats**

**📊 Overall:**
- Total messages: ${stats?.total_messages || 0}
- Your messages: ${stats?.user_messages || 0}
- My responses: ${stats?.assistant_messages || 0}
- Total tokens: ${stats?.total_tokens || 0}
- First chat: ${stats?.first_message ? new Date(stats.first_message).toLocaleDateString() : 'N/A'}
- Last chat: ${stats?.last_message ? new Date(stats.last_message).toLocaleDateString() : 'N/A'}

**🕐 Recent Messages:**\n`;

  for (const msg of recent.slice(-5)) {
    const role = msg.role === 'user' ? '👤 You' : '🤖 Bot';
    const time = new Date(msg.created_at).toLocaleTimeString();
    const content = msg.content.length > 50 ? msg.content.substring(0, 50) + '...' : msg.content;
    message += `\n${role} [${time}]: ${content}`;
  }

  message += `\n\nUse /clear to clear history (profile data preserved).`;

  await ctx.reply(message, { parse_mode: 'Markdown' });
}

export async function handleClear(ctx) {
  const user = ctx.from;
  const dbUser = UserService.getByTelegramId(user.id);
  
  if (!dbUser) {
    await ctx.reply('User not found. Please /start first.');
    return;
  }

  ChatHistoryService.clear(dbUser.id);
  await ctx.reply('🗑️ Chat history cleared! Your profile and learning data are preserved.');
}

export async function handleRecommend(ctx) {
  const user = ctx.from;
  const dbUser = UserService.getByTelegramId(user.id);
  
  if (!dbUser) {
    await ctx.reply('User not found. Please /start first.');
    return;
  }

  const recommendations = await userProfiler.getStudyRecommendations(dbUser.id);
  
  if (!recommendations) {
    await ctx.reply('Not enough data yet. Chat more so I can analyze your patterns!');
    return;
  }

  let message = `🎯 **Personalized Study Recommendations**

**⏰ Best Study Time:** ${recommendations.best_study_time}

**📚 Focus Areas:**
${recommendations.focus_areas.map((area, i) => `${i+1}. ${area}`).join('\n') || 'Keep practicing all areas!'}

**💡 Recommendations:**
${recommendations.recommendations.map((rec, i) => `${i+1}. ${rec}`).join('\n') || 'Chat more for personalized advice!'}

**💬 Want specific practice?** Just ask me:
- "Give me exercises for [weak topic]"
- "Practice IELTS speaking part 2"
- "Explain [topic] with examples"
- "Quiz me on vocabulary"`;

  await ctx.reply(message, { parse_mode: 'Markdown' });
}

export async function handleTextMessage(ctx) {
  const user = ctx.from;
  const text = ctx.message.text;
  const messageId = ctx.message.message_id;
  const messageDate = ctx.message.date * 1000;

  const dbUser = UserService.createOrUpdate(user.id, {
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    language_code: user.language_code
  });

  SessionService.start(dbUser.id);
  SessionService.incrementMessageCount(dbUser.id);

  ChatHistoryService.save(dbUser.id, messageId, 'user', text, 'text', {}, 0);

  await userProfiler.updateProfileFromMessage(dbUser.id, text, messageDate);

  const personalizedPrompt = await userProfiler.getPersonalizedPrompt(dbUser.id);
  const history = ChatHistoryService.getConversationContext(dbUser.id, 20);

  const systemPrompt = `You are an expert English teacher. Be encouraging, clear, and adaptive to the student's level.
${personalizedPrompt}

Guidelines:
- Explain concepts clearly with examples
- Adapt complexity to user's level (${personalizedPrompt.includes('Level:') ? 'see profile' : 'unknown'})
- Correct errors gently with explanations
- Provide practice exercises when appropriate
- Use formatting (bold, italics, code blocks) for clarity
- Keep responses concise but complete`;

  try {
    const { text: response, tokensUsed } = await geminiService.generateTextWithHistory(
      history,
      systemPrompt,
      { temperature: 0.7, maxTokens: 4096 }
    );

    ChatHistoryService.save(dbUser.id, 0, 'assistant', response, 'text', {}, tokensUsed);
    
    await ctx.reply(response, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Text message error:', error);
    await ctx.reply('Sorry, I encountered an error. Please try again.');
  }
}

export async function handleAudioRequest(ctx) {
  const user = ctx.from;
  const text = ctx.message.text;
  const messageId = ctx.message.message_id;

  const dbUser = UserService.getByTelegramId(user.id);
  if (!dbUser) {
    await ctx.reply('Please /start first.');
    return;
  }

  const match = text.match(/(?:pronounce|read|audio|speak|say|generate audio for)[\s:]+(.+)/i);
  if (!match) {
    await ctx.reply('Usage: "pronounce: word" or "read this: phrase" or "audio for: sentence"');
    return;
  }

  const content = match[1].trim();
  
  ChatHistoryService.save(dbUser.id, messageId, 'user', text, 'text', {}, 0);
  
  await userProfiler.updateProfileFromAudio(dbUser.id);

  try {
    await ctx.reply('🔊 Generating pronunciation guide and audio...');

    const { text: pronunciationGuide } = await geminiService.generateAudioScript(content);
    
    const audioPath = await ttsService.getAudioFile(content, { language: 'en' });

    const caption = `🔊 **Pronunciation Guide for:** "${content}"

${pronunciationGuide}`;

    await ctx.replyWithAudio({ source: audioPath }, { caption, parse_mode: 'Markdown' });

    ChatHistoryService.save(dbUser.id, 0, 'assistant', `Audio generated for: "${content}"`, 'audio', { originalText: content }, 0);
  } catch (error) {
    console.error('Audio generation error:', error);
    await ctx.reply('Sorry, failed to generate audio. Please try again.');
  }
}

export async function handleImages(ctx) {
  const user = ctx.from;
  const caption = ctx.message.caption || '';
  const messageId = ctx.message.message_id;

  const dbUser = UserService.getByTelegramId(user.id);
  if (!dbUser) {
    await ctx.reply('Please /start first.');
    return;
  }

  const imageService = ctx.imageService;
  const images = await imageService.processImages(ctx);

  if (images.length === 0) {
    await ctx.reply('No valid images found. Please send photos or image documents.');
    return;
  }

  ChatHistoryService.save(dbUser.id, messageId, 'user', caption || '[Images sent]', 'image', { count: images.length }, 0);
  
  await userProfiler.updateProfileFromImages(dbUser.id, images.length);

  try {
    await ctx.reply(`🖼️ Analyzing ${images.length} image(s)...`);

    const personalizedPrompt = await userProfiler.getPersonalizedPrompt(dbUser.id);
    
    const prompt = caption || 'Analyze these images for English learning. Explain any text, exercises, vocabulary, or grammar found. Provide translations, explanations, and learning tips.';

    const systemPrompt = `You are an expert English teacher analyzing images for a student.
${personalizedPrompt}

Provide clear, educational analysis of the images. If there's text, explain it. If there are exercises, solve them. If there's vocabulary, teach it.`;

    const geminiImages = imageService.formatImagesForGemini(images);
    const { text: response, tokensUsed } = await geminiService.analyzeImages(geminiImages, prompt);

    ChatHistoryService.save(dbUser.id, 0, 'assistant', response, 'text', { imageCount: images.length }, tokensUsed);
    
    await ctx.reply(response, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Image analysis error:', error);
    await ctx.reply('Sorry, failed to analyze images. Please try again.');
  }
}

export async function handleDocument(ctx) {
  const user = ctx.from;
  const document = ctx.message.document;
  
  if (document.mime_type?.startsWith('image/')) {
    return handleImages(ctx);
  }

  await ctx.reply('📄 Document received. I can only analyze images currently. Send photos or image files!');
}

export async function handleVoice(ctx) {
  await ctx.reply('🎤 Voice messages not yet supported. Please type your question or send images!');
}

export async function handleCallbackQuery(ctx) {
  await ctx.answerCbQuery();
}

export default {
  handleStart,
  handleHelp,
  handleProfile,
  handleHistory,
  handleClear,
  handleRecommend,
  handleTextMessage,
  handleAudioRequest,
  handleImages,
  handleDocument,
  handleVoice,
  handleCallbackQuery
};