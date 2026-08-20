import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️ Supabase not configured - using local database only');
}

export const supabase = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false }
    })
    : null;

export async function syncUserToSupabase(userData) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('users')
            .upsert({
                telegram_id: userData.telegram_id,
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                language_code: userData.language_code || 'en',
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'telegram_id',
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) throw error;

        await ensureProfileExists(data.id);
        return data;
    } catch (error) {
        console.error('Supabase sync user error:', error);
        return null;
    }
}

export async function ensureProfileExists(userId) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .upsert({ user_id: userId }, { onConflict: 'user_id', ignoreDuplicates: true })
            .select()
            .single();

        if (error && error.code !== '23505') throw error;
        return data;
    } catch (error) {
        console.error('Ensure profile error:', error);
        return null;
    }
}

export async function saveChatMessage(message) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('chat_history')
            .insert({
                user_id: message.userId,
                message_id: message.messageId,
                role: message.role,
                content: message.content,
                content_type: message.contentType || 'text',
                metadata: message.metadata || {},
                tokens_used: message.tokensUsed || 0
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Save chat message error:', error);
        return null;
    }
}

export async function getChatHistory(userId, limit = 50) {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('chat_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data.reverse() || [];
    } catch (error) {
        console.error('Get chat history error:', error);
        return [];
    }
}

export async function updateUserProfile(userId, updates) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Update profile error:', error);
        return null;
    }
}

export async function incrementProfileCounter(userId, field, amount = 1) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase.rpc('increment_counter', {
            p_user_id: userId,
            p_field: field,
            p_amount: amount
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Increment counter error:', error);
        return null;
    }
}

export async function startSession(userId) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('user_sessions')
            .insert({ user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Start session error:', error);
        return null;
    }
}

export async function endSession(userId) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('user_sessions')
            .update({ session_end: new Date().toISOString() })
            .eq('user_id', userId)
            .is('session_end', null)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('End session error:', error);
        return null;
    }
}

export async function incrementSessionMessageCount(userId) {
    if (!supabase) return null;

    try {
        const { error } = await supabase
            .from('user_sessions')
            .update({ message_count: supabase.raw('message_count + 1') })
            .eq('user_id', userId)
            .is('session_end', null);

        if (error) throw error;
    } catch (error) {
        console.error('Increment session message error:', error);
    }
}

export async function saveLesson(userId, lesson) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('lessons')
            .insert({
                user_id: userId,
                topic: lesson.topic,
                content: lesson.content,
                exercises: lesson.exercises || [],
                pdf_url: lesson.pdfUrl
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Save lesson error:', error);
        return null;
    }
}

export async function saveVocabulary(userId, vocab) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('vocabularies')
            .insert({
                user_id: userId,
                topic: vocab.topic,
                words: vocab.words,
                pdf_url: vocab.pdfUrl
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Save vocabulary error:', error);
        return null;
    }
}

export async function saveStudyReport(userId, pdfUrl) {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase
            .from('study_reports')
            .insert({ user_id: userId, pdf_url: pdfUrl })
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Save study report error:', error);
        return null;
    }
}

export async function getUserStats(userId) {
    if (!supabase) return null;

    try {
        const [
            { data: profile },
            { data: chatStats },
            { data: lessons },
            { data: vocabularies },
            { data: reports }
        ] = await Promise.all([
            supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
            supabase.from('chat_history').select('role, created_at, tokens_used').eq('user_id', userId),
            supabase.from('lessons').select('topic, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
            supabase.from('vocabularies').select('topic, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
            supabase.from('study_reports').select('generated_at').eq('user_id', userId).order('generated_at', { ascending: false }).limit(5)
        ]);

        const userMessages = chatStats?.filter(m => m.role === 'user').length || 0;
        const botMessages = chatStats?.filter(m => m.role === 'assistant').length || 0;
        const totalTokens = chatStats?.reduce((sum, m) => sum + (m.tokens_used || 0), 0) || 0;

        return {
            profile,
            chatStats: {
                user_messages: userMessages,
                bot_messages: botMessages,
                total_tokens: totalTokens,
                first_chat: chatStats?.[chatStats.length - 1]?.created_at,
                last_chat: chatStats?.[0]?.created_at
            },
            lessons: lessons || [],
            vocabularies: vocabularies || [],
            reports: reports || []
        };
    } catch (error) {
        console.error('Get user stats error:', error);
        return null;
    }
}

export async function getAllUsers(limit = 100) {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, telegram_id, username, first_name, last_name, created_at, is_active')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Get all users error:', error);
        return [];
    }
}

export async function getDashboardStats() {
    if (!supabase) return null;

    try {
        const [
            { count: totalUsers },
            { count: totalMessages },
            { count: totalLessons },
            { count: totalVocabularies },
            { data: recentUsers }
        ] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('chat_history').select('*', { count: 'exact', head: true }),
            supabase.from('lessons').select('*', { count: 'exact', head: true }),
            supabase.from('vocabularies').select('*', { count: 'exact', head: true }),
            supabase.from('users').select('telegram_id, username, first_name, created_at').eq('is_active', true).order('created_at', { ascending: false }).limit(5)
        ]);

        return {
            totalUsers: totalUsers || 0,
            totalMessages: totalMessages || 0,
            totalLessons: totalLessons || 0,
            totalVocabularies: totalVocabularies || 0,
            recentUsers: recentUsers || []
        };
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        return null;
    }
}

export function isSupabaseConfigured() {
    return !!supabase;
}

export default supabase;