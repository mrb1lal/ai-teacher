import initSqlJs from 'sql.js';
import { resolve, dirname } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DATABASE_PATH || resolve(__dirname, '../../data/bot.db');
const dbDir = dirname(dbPath);

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

let db = null;
let isInitialized = false;

export async function initDatabase() {
  if (isInitialized) return db;

  const SQL = await initSqlJs();

  let dbInstance;
  
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
    createTables(dbInstance);
    saveDatabase(dbInstance);
  }

  db = dbInstance;
  isInitialized = true;
  
  console.log('Database initialized successfully (sql.js)');
  return db;
}

function createTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id INTEGER UNIQUE NOT NULL,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      language_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT 1,
      is_admin BOOLEAN DEFAULT 0
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      english_level TEXT DEFAULT 'unknown',
      estimated_ielts REAL DEFAULT 0.0,
      weak_topics TEXT DEFAULT '[]',
      strong_topics TEXT DEFAULT '[]',
      preferred_study_hours TEXT DEFAULT '[]',
      last_active_hour INTEGER,
      total_messages INTEGER DEFAULT 0,
      total_audio_requests INTEGER DEFAULT 0,
      total_images_analyzed INTEGER DEFAULT 0,
      learning_goals TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message_id INTEGER,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
      content TEXT NOT NULL,
      content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'audio', 'document')),
      metadata TEXT DEFAULT '{}',
      tokens_used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at);
    CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
    CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
      session_end DATETIME,
      message_count INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

function saveDatabase(dbInstance) {
  try {
    const data = dbInstance.export();
    writeFileSync(dbPath, Buffer.from(data));
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    saveDatabase(db);
    db.close();
    db = null;
    isInitialized = false;
  }
}

setInterval(() => {
  if (db) {
    saveDatabase(db);
  }
}, 30000);

process.on('SIGINT', () => {
  closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeDatabase();
  process.exit(0);
});

export default {
  initDatabase,
  getDb,
  closeDatabase
};