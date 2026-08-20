import { getDb } from './init.js';
import {
    syncUserToSupabase,
    saveChatMessage,
    updateUserProfile,
    incrementProfileCounter,
    startSession,
    endSession,
    incrementSessionMessageCount,
    saveLesson,
    saveVocabulary,
    saveStudyReport
} from '../services/supabase.js';

function run(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  const result = stmt.run(params);
  stmt.free();
  return result;
}

function get(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  const result = stmt.getAsObject(params);
  stmt.free();
  return result;
}

function all(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  const results = stmt.all(params);
  stmt.free();
  return results;
}

async function syncToSupabase(fn) {
  try {
    await fn();
  } catch (error) {
    console.warn('Supabase sync failed (non-blocking):', error.message);
  }
}

const ADMIN_TELEGRAM_ID = 8450078536;

export const UserService = {
  createOrUpdate(telegramId, userData) {
    const isAdmin = telegramId === ADMIN_TELEGRAM_ID;
    run(`
      INSERT INTO users (telegram_id, username, first_name, last_name, language_code, updated_at, is_admin)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
      ON CONFLICT(telegram_id) DO UPDATE SET
        username = excluded.username,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        language_code = excluded.language_code,
        updated_at = CURRENT_TIMESTAMP,
        is_admin = excluded.is_admin
    `, [telegramId, userData.username, userData.first_name, userData.last_name, userData.language_code, isAdmin ? 1 : 0]);
    
    const user = get('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);
    
    const profileExists = get('SELECT 1 FROM user_profiles WHERE user_id = ?', [user.id]);
    if (!profileExists) {
      run('INSERT INTO user_profiles (user_id) VALUES (?)', [user.id]);
    }

    syncToSupabase(() => syncUserToSupabase({
      telegram_id: telegramId,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      language_code: userData.language_code
    }));
    
    return user;
  },

  isAdmin(telegramId) {
    return telegramId === ADMIN_TELEGRAM_ID;
  },

  getByTelegramId(telegramId) {
    return get('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);
  },

  getById(id) {
    return get('SELECT * FROM users WHERE id = ?', [id]);
  },

  getAllActive() {
    return all('SELECT * FROM users WHERE is_active = 1');
  },

  setAdmin(telegramId, isAdmin = true) {
    run('UPDATE users SET is_admin = ? WHERE telegram_id = ?', [isAdmin ? 1 : 0, telegramId]);
  }
};

export const ProfileService = {
  get(userId) {
    return get('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
  },

  update(userId, data) {
    const fields = [];
    const values = [];
    
    const allowedFields = [
      'english_level', 'estimated_ielts', 'weak_topics', 'strong_topics',
      'preferred_study_hours', 'last_active_hour', 'learning_goals', 'notes'
    ];
    
    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(typeof value === 'object' ? JSON.stringify(value) : value);
      }
    }
    
    if (fields.length === 0) return this.get(userId);
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);
    
    run(`UPDATE user_profiles SET ${fields.join(', ')} WHERE user_id = ?`, values);

    const supabaseUpdates = {};
    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        supabaseUpdates[key] = typeof value === 'object' ? value : value;
      }
    }
    if (Object.keys(supabaseUpdates).length > 0) {
      syncToSupabase(() => updateUserProfile(userId, supabaseUpdates));
    }

    return this.get(userId);
  },

  incrementMessageCount(userId) {
    run('UPDATE user_profiles SET total_messages = total_messages + 1 WHERE user_id = ?', [userId]);
    syncToSupabase(() => incrementProfileCounter(userId, 'total_messages'));
  },

  incrementAudioCount(userId) {
    run('UPDATE user_profiles SET total_audio_requests = total_audio_requests + 1 WHERE user_id = ?', [userId]);
    syncToSupabase(() => incrementProfileCounter(userId, 'total_audio_requests'));
  },

  incrementImageCount(userId) {
    run('UPDATE user_profiles SET total_images_analyzed = total_images_analyzed + 1 WHERE user_id = ?', [userId]);
    syncToSupabase(() => incrementProfileCounter(userId, 'total_images_analyzed'));
  },

  updateActiveHour(userId, hour) {
    run('UPDATE user_profiles SET last_active_hour = ? WHERE user_id = ?', [hour, userId]);
    syncToSupabase(() => updateUserProfile(userId, { last_active_hour: hour }));
  },

  addWeakTopic(userId, topic) {
    const profile = this.get(userId);
    const weakTopics = JSON.parse(profile.weak_topics || '[]');
    if (!weakTopics.includes(topic)) {
      weakTopics.push(topic);
      this.update(userId, { weak_topics: weakTopics });
    }
  },

  addStrongTopic(userId, topic) {
    const profile = this.get(userId);
    const strongTopics = JSON.parse(profile.strong_topics || '[]');
    if (!strongTopics.includes(topic)) {
      strongTopics.push(topic);
      this.update(userId, { strong_topics: strongTopics });
    }
  },

  addStudyHour(userId, hour) {
    const profile = this.get(userId);
    const hours = JSON.parse(profile.preferred_study_hours || '[]');
    if (!hours.includes(hour)) {
      hours.push(hour);
      this.update(userId, { preferred_study_hours: hours });
    }
  },

  getProfileSummary(userId) {
    const profile = this.get(userId);
    if (!profile) return null;
    
    return {
      englishLevel: profile.english_level,
      estimatedIelts: profile.estimated_ielts,
      weakTopics: JSON.parse(profile.weak_topics || '[]'),
      strongTopics: JSON.parse(profile.strong_topics || '[]'),
      preferredStudyHours: JSON.parse(profile.preferred_study_hours || '[]'),
      lastActiveHour: profile.last_active_hour,
      totalMessages: profile.total_messages,
      totalAudioRequests: profile.total_audio_requests,
      totalImagesAnalyzed: profile.total_images_analyzed,
      learningGoals: profile.learning_goals
    };
  }
};

export const ChatHistoryService = {
  save(userId, messageId, role, content, contentType = 'text', metadata = {}, tokensUsed = 0) {
    const result = run(`
      INSERT INTO chat_history (user_id, message_id, role, content, content_type, metadata, tokens_used)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [userId, messageId, role, content, contentType, JSON.stringify(metadata), tokensUsed]);

    syncToSupabase(() => saveChatMessage({
      userId, messageId, role, content, contentType, metadata, tokensUsed
    }));

    return result.lastInsertRowid;
  },

  getRecent(userId, limit = 50) {
    const results = all(`
      SELECT * FROM chat_history 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `, [userId, limit]);
    return results.reverse();
  },

  getAll(userId) {
    return all(`
      SELECT * FROM chat_history 
      WHERE user_id = ? 
      ORDER BY created_at ASC
    `, [userId]);
  },

  getConversationContext(userId, maxMessages = 20) {
    const messages = this.getRecent(userId, maxMessages);
    return messages.map(m => ({
      role: m.role,
      content: m.content_type === 'text' ? m.content : `[${m.content_type}: ${m.content}]`
    }));
  },

  clear(userId) {
    run('DELETE FROM chat_history WHERE user_id = ?', [userId]);
  },

  getStats(userId) {
    return get(`
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as user_messages,
        SUM(CASE WHEN role = 'assistant' THEN 1 ELSE 0 END) as assistant_messages,
        SUM(tokens_used) as total_tokens,
        MIN(created_at) as first_message,
        MAX(created_at) as last_message
      FROM chat_history WHERE user_id = ?
    `, [userId]);
  }
};

export const SessionService = {
  start(userId) {
    const existing = get(`
      SELECT * FROM user_sessions 
      WHERE user_id = ? AND session_end IS NULL
      ORDER BY session_start DESC LIMIT 1
    `, [userId]);
    
    if (existing) return existing;
    
    run('INSERT INTO user_sessions (user_id) VALUES (?)', [userId]);
    syncToSupabase(() => startSession(userId));
    return get('SELECT * FROM user_sessions WHERE id = (SELECT MAX(id) FROM user_sessions WHERE user_id = ?)', [userId]);
  },

  end(userId) {
    run(`
      UPDATE user_sessions 
      SET session_end = CURRENT_TIMESTAMP 
      WHERE user_id = ? AND session_end IS NULL
    `, [userId]);
    syncToSupabase(() => endSession(userId));
  },

  incrementMessageCount(userId) {
    run(`
      UPDATE user_sessions 
      SET message_count = message_count + 1 
      WHERE user_id = ? AND session_end IS NULL
    `, [userId]);
    syncToSupabase(() => incrementSessionMessageCount(userId));
  },

  getCurrentSession(userId) {
    return get(`
      SELECT * FROM user_sessions 
      WHERE user_id = ? AND session_end IS NULL
      ORDER BY session_start DESC LIMIT 1
    `, [userId]);
  },

  getSessionStats(userId, days = 30) {
    return get(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(message_count) as total_messages,
        AVG(message_count) as avg_messages_per_session,
        SUM(julianday(session_end) - julianday(session_start)) * 24 * 60 as total_minutes
      FROM user_sessions 
      WHERE user_id = ? AND session_start >= datetime('now', '-' || ? || ' days')
    `, [userId, days]);
  }
};

export const SupabaseSyncService = {
  async saveLesson(userId, lesson) {
    return saveLesson(userId, lesson);
  },
  async saveVocabulary(userId, vocab) {
    return saveVocabulary(userId, vocab);
  },
  async saveStudyReport(userId, pdfUrl) {
    return saveStudyReport(userId, pdfUrl);
  }
};