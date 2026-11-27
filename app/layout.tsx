import './globals.css';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { Metadata } from 'next';

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});
// Variable font with the width axis, so headings can be set at 125% width.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Search Trends by State: local conversation topics for sales calls',
  description:
    'See what each US state is searching for on Google right now, summarized by Claude in three sentences. For sales reps who want a local opener before a call.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://state-search-trends-summary.vercel.app',
    siteName: 'Search Trends by State ',
    title: 'Search Trends by State: local conversation topics for sales calls',
    description:
      'See what each US state is searching for on Google right now, summarized by Claude in three sentences. For sales reps who want a local opener before a call.',
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
    title: 'Search Trends by State: local conversation topics for sales calls',
    description:
      'See what each US state is searching for on Google right now, summarized by Claude in three sentences. For sales reps who want a local opener before a call.',
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
        className={`${plexSans.variable} ${plexMono.variable} ${archivo.variable} font-sans bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="min-h-screen">
            <header className="border-b border-border">
              <nav className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full bg-signal-1"
                  />
                  <span className="font-display text-sm font-extrabold uppercase tracking-[0.06em] sm:text-base">
                    Search Trends by State
                  </span>
                  <span className="font-mono text-[13px] text-muted-foreground">
                    Live feed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* The page portals its Download PDF button in here */}
                  <div id="nav-actions" className="contents" />
                  <Link
                    href="https://github.com/dfrho/trends-summary"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-3 text-sm font-medium text-link underline underline-offset-4 hover:text-foreground"
                  >
                    GitHub
                  </Link>
                  <DarkModeToggle />
                </div>
              </nav>
            </header>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
