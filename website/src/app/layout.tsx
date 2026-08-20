import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI English Teacher - Learn English with AI',
  description: 'Your personal AI English tutor. Practice speaking, get pronunciation audio, analyze images, generate PDF lessons, and track your progress.',
  keywords: ['English learning', 'AI tutor', 'IELTS preparation', 'English practice', 'language learning'],
  authors: [{ name: 'AI English Teacher' }],
  openGraph: {
    title: 'AI English Teacher - Learn English with AI',
    description: 'Your personal AI English tutor. Practice speaking, get pronunciation audio, analyze images, generate PDF lessons.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AI English Teacher',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI English Teacher',
    description: 'Your personal AI English tutor.',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}