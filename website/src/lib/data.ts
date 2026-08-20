import { supabase, User, UserProfile, ChatMessage, Lesson, Vocabulary, StudyReport } from './supabase';

export async function getDashboardStats() {
  const [
    { count: totalUsers, error: usersError },
    { count: totalMessages, error: messagesError },
    { count: totalLessons, error: lessonsError },
    { count: totalVocabularies, error: vocabError },
    { data: recentUsers, error: recentError }
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('chat_history').select('*', { count: 'exact', head: true }),
    supabase.from('lessons').select('*', { count: 'exact', head: true }),
    supabase.from('vocabularies').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('telegram_id, username, first_name, created_at').eq('is_active', true).order('created_at', { ascending: false }).limit(5)
  ]);

  if (usersError || messagesError || lessonsError || vocabError || recentError) {
    console.error('Dashboard stats error:', usersError || messagesError || lessonsError || vocabError || recentError);
    return null;
  }

  return {
    totalUsers: totalUsers || 0,
    totalMessages: totalMessages || 0,
    totalLessons: totalLessons || 0,
    totalVocabularies: totalVocabularies || 0,
    recentUsers: recentUsers || []
  };
}

export async function getUserByTelegramId(telegramId: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();

  if (error) return null;
  return data;
}

export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function getUserChatHistory(userId: number, limit = 20): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data.reverse();
}

export async function getUserLessons(userId: number): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getUserVocabularies(userId: number): Promise<Vocabulary[]> {
  const { data, error } = await supabase
    .from('vocabularies')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getUserReports(userId: number): Promise<StudyReport[]> {
  const { data, error } = await supabase
    .from('study_reports')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, telegram_id, username, first_name, last_name, created_at, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}