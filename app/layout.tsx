import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { DarkModeToggle } from '../components/DarkModeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Search by State Trends',
  description:
    'Explore real-time Google search trends for different states in the US',
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
