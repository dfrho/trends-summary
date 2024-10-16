import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { Metadata } from 'next';
import { PostHogProvider } from '../components/PostHogProvider';
import { CookieBanner } from '../components/CookieBanner';
import { Github } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Search Trends by State',
  description: 'Explore real-time search trends for different states in the US',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://state-search-trends-summary.vercel.app',
    siteName: 'Search Trends by State ',
    title: 'Search Trends by State',
    description:
      'Explore real-time search trends for different states in the US',
    images: [
      {
        url: 'https://state-search-trends-summary.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Search Trends by State',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Trends by State',
    description: 'Explore real-time search trends by state in the US',
    images: ['https://state-search-trends-summary.vercel.app/og-image.png'],
    creator: '@brhodesdav',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posthogKey = process.env.POSTHOG_KEY || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <PostHogProvider posthogKey={posthogKey}>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-background text-foreground">
              <nav className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl sm:text-2xl font-bold">
                    Search Trends by State
                  </h1>
                  <Link
                    href="https://github.com/dfrho/trends-summary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    <Github className="w-6 h-6" />
                    <span className="sr-only">GitHub repository</span>
                  </Link>
                </div>
                <DarkModeToggle />
              </nav>
              <main className="container mx-auto px-4 py-8">{children}</main>
              <CookieBanner />
            </div>
          </ThemeProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
