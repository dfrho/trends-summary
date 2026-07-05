import './globals.css';
import { Overpass, Ultra } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { Metadata } from 'next';
import { Github, Compass } from 'lucide-react';

const overpass = Overpass({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});
const ultra = Ultra({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${overpass.variable} ${ultra.variable} font-sans bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen">
            <nav className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background">
                  <Compass className="h-[18px] w-[18px]" />
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Search Trends by State
                </span>
                <Link
                  href="https://github.com/dfrho/trends-summary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <span className="sr-only">GitHub repository</span>
                </Link>
              </div>
              <DarkModeToggle />
            </nav>

            <header className="relative overflow-hidden border-b border-border text-center px-4 sm:px-6 py-12 sm:py-16 bg-[radial-gradient(circle_at_50%_15%,hsl(var(--accent)/0.08),transparent_60%)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent mb-3.5">
                Est. Nationwide &middot; Field Edition
              </p>
              <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] text-primary text-balance">
                What&rsquo;s Trending
                <br />
                in Every State
              </h1>
            </header>

            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
