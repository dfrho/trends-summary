import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { Metadata } from 'next';
import { PostHogProvider } from '../components/PostHogProvider';
import { CookieBanner } from '../components/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Search by State Trends',
  description:
    'Explore real-time Google search trends for different states in the US',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://state-search-trends-summary.vercel.app',
    siteName: 'Search by State Trends',
    title: 'Search by State Trends',
    description:
      'Explore real-time Google search trends for different states in the US',
    images: [
      {
        url: 'https://state-search-trends-summary.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Search by State Trends',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search by State Trends',
    description:
      'Explore real-time Google search trends for different states in the US',
    images: ['https://state-search-trends-summary.vercel.app/og-image.png'],
    creator: '@bubbasdad',
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
                <h1 className="text-xl sm:text-2xl font-bold">
                  Search by State Trends
                </h1>
                <DarkModeToggle />
              </nav>
              <main className="container mx-auto px-4 py-8">{children}</main>
              <footer className="text-center py-4 text-sm text-slate-600 dark:text-slate-400">
                Powered by{' '}
                <Link
                  href="https://trends.google.com/trends/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-900 dark:hover:text-slate-100"
                >
                  Google Trends
                </Link>
              </footer>
              <CookieBanner />
            </div>
          </ThemeProvider>
        </body>
      </PostHogProvider>
    </html>
  );
}
