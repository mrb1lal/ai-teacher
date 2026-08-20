import { ProfileService, ChatHistoryService, SessionService } from '../database/service.js';
import { geminiService } from './gemini.js';

export class UserProfiler {
  constructor() {
    this.updateInterval = parseInt(process.env.USER_PROFILE_UPDATE_INTERVAL) || 3600000;
    this.lastUpdate = new Map();
  }

  async updateProfileFromMessage(userId, messageText, messageDate) {
    const hour = new Date(messageDate).getHours();
    
    ProfileService.updateActiveHour(userId, hour);
    ProfileService.incrementMessageCount(userId);
    ProfileService.addStudyHour(userId, hour);
    
    await this.maybeDeepAnalyze(userId);
  }

  async updateProfileFromAudio(userId) {
    ProfileService.incrementAudioCount(userId);
  }

  async updateProfileFromImages(userId, count = 1) {
    for (let i = 0; i < count; i++) {
      ProfileService.incrementImageCount(userId);
    }
  }

  async maybeDeepAnalyze(userId) {
    const now = Date.now();
    const lastUpdateTime = this.lastUpdate.get(userId) || 0;
    
    if (now - lastUpdateTime < this.updateInterval) {
      return;
    }

    this.lastUpdate.set(userId, now);
    
    try {
      await this.performDeepAnalysis(userId);
    } catch (error) {
      console.error(`Deep analysis failed for user ${userId}:`, error);
    }
  }

  async performDeepAnalysis(userId) {
    const history = ChatHistoryService.getRecent(userId, 50);
    if (history.length < 10) return;

    const conversationHistory = history.map(m => ({
      role: m.role,
      content: m.content
    }));

    try {
      const [levelResult, topicsResult] = await Promise.all([
        geminiService.estimateUserLevel(conversationHistory),
        geminiService.identifyWeakStrongTopics(conversationHistory)
      ]);

      let levelData, topicsData;
      
      try {
        levelData = JSON.parse(levelResult.text);
      } catch {
        levelData = { cefr_level: 'unknown', ielts_estimate: 0, reasoning: 'Parse failed' };
      }

      try {
        topicsData = JSON.parse(topicsResult.text);
      } catch {
        topicsData = { weak_topics: [], strong_topics: [], reasoning: 'Parse failed' };
      }

      ProfileService.update(userId, {
        english_level: levelData.cefr_level,
        estimated_ielts: levelData.ielts_estimate,
        weak_topics: topicsData.weak_topics,
        strong_topics: topicsData.strong_topics
      });

      console.log(`Updated profile for user ${userId}:`, {
        level: levelData.cefr_level,
        ielts: levelData.ielts_estimate,
        weak: topicsData.weak_topics.length,
        strong: topicsData.strong_topics.length
      });
    } catch (error) {
      console.error('Deep analysis error:', error);
    }
  }

  async getPersonalizedPrompt(userId) {
    const profile = ProfileService.getProfileSummary(userId);
    if (!profile) return '';

    const weakTopics = profile.weakTopics.length > 0 
      ? `\nUser struggles with: ${profile.weakTopics.join(', ')}` 
      : '';
    const strongTopics = profile.strongTopics.length > 0
      ? `\nUser is good at: ${profile.strongTopics.join(', ')}`
      : '';
    const studyHours = profile.preferredStudyHours.length > 0
      ? `\nUser usually studies at: ${profile.preferredStudyHours.map(h => `${h}:00`).join(', ')}`
      : '';

    return `USER PROFILE:
- English Level: ${profile.englishLevel}
- Estimated IELTS: ${profile.estimatedIelts}
- Total Messages: ${profile.totalMessages}
- Audio Requests: ${profile.totalAudioRequests}
- Images Analyzed: ${profile.totalImagesAnalyzed}${weakTopics}${strongTopics}${studyHours}
- Learning Goals: ${profile.learningGoals || 'Not specified'}

Adapt your teaching style to this user's level and needs.`;
  }

  async getStudyRecommendations(userId) {
    const profile = ProfileService.getProfileSummary(userId);
    if (!profile) return null;

    const prompt = `Based on this user profile, provide 3 specific study recommendations:
    
    Level: ${profile.englishLevel}
    IELTS Estimate: ${profile.estimatedIelts}
    Weak Topics: ${profile.weakTopics.join(', ') || 'None identified'}
    Strong Topics: ${profile.strongTopics.join(', ') || 'None identified'}
    Active Hours: ${profile.preferredStudyHours.map(h => `${h}:00`).join(', ') || 'Unknown'}
    
    Return JSON: { "recommendations": [...], "best_study_time": "...", "focus_areas": [...] }`;

    const result = await geminiService.generateText(prompt, '', { temperature: 0.4, maxTokens: 1024 });
    
    try {
      return JSON.parse(result.text);
    } catch {
      return { recommendations: [], best_study_time: 'Unknown', focus_areas: [] };
    }
  }

  async getUserSummary(userId) {
    const profile = ProfileService.getProfileSummary(userId);
    const chatStats = ChatHistoryService.getStats(userId);
    const sessionStats = SessionService.getSessionStats(userId);
    
    return {
      profile,
      chatStats,
      sessionStats,
      lastAnalyzed: this.lastUpdate.get(userId)
    };
  }
}

export const userProfiler = new UserProfiler();
export default userProfiler;