import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
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
  const posthogKey = process.env.POSTHOG_API_KEY || '';
  return (
    <html lang="en" suppressHydrationWarning>
      <PostHogProvider posthogKey={posthogKey}>
        <body className={inter.className}>
          <ThemeProvider attribute="class">
            <div className="min-h-screen bg-primary text-primary">
              <nav className="p-4">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                  <div className="w-full sm:w-auto flex justify-center mb-2 sm:mb-0">
                    <h1 className="text-xl sm:text-2xl font-bold">
                      Search by State Trends
                    </h1>
                  </div>
                  <DarkModeToggle />
                </div>
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
