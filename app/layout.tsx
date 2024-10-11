import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Search by State Trends',
  description:
    'Explore real-time Google search trends for different states in the US',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://search-state-trends-summary.vercel.app',
    siteName: 'Search by State Trends',
    title: 'Search by State Trends',
    description:
      'Explore real-time Google search trends for different states in the US',
    images: [
      {
        url: 'https://search-by-state-trends.vercel.app/og-image.png',
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
    creator: '@yourtwitterhandle',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <div className="min-h-screen bg-primary text-primary">
            <nav className="p-1 flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
                Search by State Trends
              </h1>
              <DarkModeToggle />
            </nav>
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
