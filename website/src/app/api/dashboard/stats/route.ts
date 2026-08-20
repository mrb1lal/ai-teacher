import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function GET(request: NextRequest) {
  try {
    const telegramId = request.nextUrl.searchParams.get('telegram_id');
    if (!telegramId) {
      return NextResponse.json({ error: 'telegram_id required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', telegramId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalMessages: totalMessages || 0,
      totalLessons: totalLessons || 0,
      totalVocabularies: totalVocabularies || 0,
      recentUsers: recentUsers || []
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}