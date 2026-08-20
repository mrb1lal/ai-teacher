import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  language_code: string;
  created_at: string;
  is_active: boolean;
};

export type UserProfile = {
  id: number;
  user_id: number;
  english_level: string;
  estimated_ielts: number;
  weak_topics: string[];
  strong_topics: string[];
  preferred_study_hours: number[];
  last_active_hour: number | null;
  total_messages: number;
  total_audio_requests: number;
  total_images_analyzed: number;
  learning_goals: string;
  notes: string;
};

export type ChatMessage = {
  id: number;
  user_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  content_type: string;
  metadata: Record<string, unknown>;
  tokens_used: number;
  created_at: string;
};

export type Lesson = {
  id: number;
  user_id: number;
  topic: string;
  content: string;
  exercises: unknown[];
  pdf_url: string | null;
  created_at: string;
};

export type Vocabulary = {
  id: number;
  user_id: number;
  topic: string;
  words: VocabularyWord[];
  pdf_url: string | null;
  created_at: string;
};

export type VocabularyWord = {
  word: string;
  definition: string;
  example: string;
  ipa?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
};

export type StudyReport = {
  id: number;
  user_id: number;
  pdf_url: string | null;
  generated_at: string;
};