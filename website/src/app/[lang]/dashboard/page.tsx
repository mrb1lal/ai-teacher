'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/components/I18nProvider';

interface DashboardStats {
  totalUsers: number;
  totalMessages: number;
  totalLessons: number;
  totalVocabularies: number;
  recentUsers: Array<{
    telegram_id: number;
    username: string | null;
    first_name: string | null;
    created_at: string;
  }>;
}

interface UserProfile {
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
}

interface ChatMessage {
  id: number;
  user_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  content_type: string;
  metadata: Record<string, unknown>;
  tokens_used: number;
  created_at: string;
}

interface Lesson {
  id: number;
  user_id: number;
  topic: string;
  content: string;
  exercises: unknown[];
  pdf_url: string | null;
  created_at: string;
}

interface Vocabulary {
  id: number;
  user_id: number;
  topic: string;
  words: Array<{
    word: string;
    definition: string;
    example: string;
    ipa?: string;
    difficulty: string;
  }>;
  pdf_url: string | null;
  created_at: string;
}

interface StudyReport {
  id: number;
  user_id: number;
  pdf_url: string | null;
  generated_at: string;
}

export default function DashboardPage() {
  const { t, language } = useI18n();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [reports, setReports] = useState<StudyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'vocab' | 'history' | 'reports'>('overview');
  const [telegramId, setTelegramId] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('telegram_id');
    if (saved) {
      setTelegramId(saved);
      fetchDashboardData(saved);
    }
  }, []);

  const fetchDashboardData = async (id: string) => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const [statsRes, profileRes, chatRes, lessonsRes, vocabRes, reportsRes] = await Promise.all([
        fetch(`${baseUrl}/api/dashboard/stats?telegram_id=${id}`),
        fetch(`${baseUrl}/api/dashboard/profile?telegram_id=${id}`),
        fetch(`${baseUrl}/api/dashboard/chat?telegram_id=${id}&limit=20`),
        fetch(`${baseUrl}/api/dashboard/lessons?telegram_id=${id}`),
        fetch(`${baseUrl}/api/dashboard/vocab?telegram_id=${id}`),
        fetch(`${baseUrl}/api/dashboard/reports?telegram_id=${id}`),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (profileRes.ok) setProfile(await profileRes.json());
      if (chatRes.ok) setChatHistory(await chatRes.json());
      if (lessonsRes.ok) setLessons(await lessonsRes.json());
      if (vocabRes.ok) setVocabularies(await vocabRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (telegramId.trim()) {
      localStorage.setItem('telegram_id', telegramId.trim());
      fetchDashboardData(telegramId.trim());
    }
  };

  if (!telegramId) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-slate-50 dark:bg-slate-900">
        <div className="card w-full max-w-md mx-4">
          <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">
            {t('dashboard.title')}
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            Enter your Telegram ID to access your learning dashboard
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="telegram_id" className="form-label">Telegram ID</label>
              <input
                type="number"
                id="telegram_id"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="form-input"
                placeholder="e.g., 123456789"
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3">
              {t('nav.login')}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Find your ID by messaging <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">@userinfobot</a> on Telegram
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('dashboard.stats'), icon: '📊' },
    { id: 'lessons', label: t('dashboard.lessons'), icon: '📚' },
    { id: 'vocab', label: t('dashboard.vocab'), icon: '📖' },
    { id: 'history', label: t('dashboard.history'), icon: '💬' },
    { id: 'reports', label: t('dashboard.reports'), icon: '📄' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {t('dashboard.welcome')}{profile && `, ${profile.english_level.toUpperCase()}`}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Telegram ID: {telegramId}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="btn btn-secondary">{t('nav.home')}</Link>
            <button onClick={() => { localStorage.removeItem('telegram_id'); window.location.reload(); }} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">{t('common.loading')}</div>
        ) : (
          <>
            {activeTab === 'overview' && profile && stats && (
              <div className="space-y-8">
                <div className="grid grid-4 gap-4">
                  <div className="stat-card card">
                    <div className="stat-value">{profile.english_level.toUpperCase()}</div>
                    <div className="stat-label">{t('dashboard.level')}</div>
                  </div>
                  <div className="stat-card card">
                    <div className="stat-value">{profile.estimated_ielts.toFixed(1)}</div>
                    <div className="stat-label">{t('dashboard.ielts')}</div>
                  </div>
                  <div className="stat-card card">
                    <div className="stat-value">{profile.total_messages}</div>
                    <div className="stat-label">{t('dashboard.messages')}</div>
                  </div>
                  <div className="stat-card card">
                    <div className="stat-value">{profile.total_audio_requests}</div>
                    <div className="stat-label">{t('dashboard.audio')}</div>
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="card">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('dashboard.lessons')}</h3>
                    <div className="space-y-2">
                      {lessons.slice(0, 5).map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="font-medium">{lesson.topic}</span>
                          <span className="text-sm text-slate-500">{new Date(lesson.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                      {lessons.length === 0 && <p className="text-slate-500 text-center py-4">{t('common.noData')}</p>}
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('dashboard.vocab')}</h3>
                    <div className="space-y-2">
                      {vocabularies.slice(0, 5).map((vocab) => (
                        <div key={vocab.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="font-medium">{vocab.topic}</span>
                          <span className="text-sm text-slate-500">{vocab.words.length} words</span>
                        </div>
                      ))}
                      {vocabularies.length === 0 && <p className="text-slate-500 text-center py-4">{t('common.noData')}</p>}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('dashboard.reports')}</h3>
                    <button className="btn btn-primary text-sm">{t('dashboard.generateReport')}</button>
                  </div>
                  <div className="space-y-2">
                    {reports.slice(0, 5).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span>Study Report</span>
                        <span className="text-sm text-slate-500">{new Date(report.generated_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                    {reports.length === 0 && <p className="text-slate-500 text-center py-4">{t('common.noData')}</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="card">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('dashboard.lessons')}</h3>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold">{lesson.topic}</h4>
                          <p className="text-sm text-slate-500 mt-1">{new Date(lesson.created_at).toLocaleString()}</p>
                        </div>
                        {lesson.pdf_url && (
                          <a href={lesson.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm">
                            {t('common.download')} PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {lessons.length === 0 && <p className="text-center text-slate-500 py-8">{t('common.noData')}</p>}
                </div>
              </div>
            )}

            {activeTab === 'vocab' && (
              <div className="card">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('dashboard.vocab')}</h3>
                <div className="space-y-3">
                  {vocabularies.map((vocab) => (
                    <div key={vocab.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold">{vocab.topic}</h4>
                          <p className="text-sm text-slate-500 mt-1">{vocab.words.length} words • {new Date(vocab.created_at).toLocaleDateString()}</p>
                        </div>
                        {vocab.pdf_url && (
                          <a href={vocab.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm">
                            {t('common.download')} PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {vocabularies.length === 0 && <p className="text-center text-slate-500 py-8">{t('common.noData')}</p>}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="card">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('dashboard.history')}</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {chatHistory.map((msg) => (
                    <div key={msg.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${msg.role === 'user' ? 'badge-primary' : 'badge-success'}`}>
                          {msg.role === 'user' ? '👤 You' : '🤖 AI'}
                        </span>
                        <span className="text-xs text-slate-500">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm line-clamp-2">{msg.content}</p>
                    </div>
                  ))}
                  {chatHistory.length === 0 && <p className="text-center text-slate-500 py-8">{t('common.noData')}</p>}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="card">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">{t('dashboard.reports')}</h3>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="font-bold">Study Report</h4>
                        <p className="text-sm text-slate-500">{new Date(report.generated_at).toLocaleString()}</p>
                      </div>
                      {report.pdf_url && (
                        <a href={report.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm">
                          {t('common.download')} PDF
                        </a>
                      )}
                    </div>
                  ))}
                  {reports.length === 0 && <p className="text-center text-slate-500 py-8">{t('common.noData')}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}