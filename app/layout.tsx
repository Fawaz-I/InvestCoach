import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import type { Route } from 'next';
import './globals.css';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InvestCoach - Smart Investment Portfolio Management',
  description:
    'A comprehensive investment coaching platform with portfolio tracking, position analysis, and systematic decision-making tools.',
  keywords: [
    'investment',
    'portfolio',
    'coaching',
    'stocks',
    'analysis',
    'finance',
  ],
  authors: [{ name: 'InvestCoach Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className='min-h-screen bg-background'>
            <header className='border-b border-border'>
              <div className='container mx-auto px-4 py-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <h1 className='text-xl font-bold text-foreground'>
                      📈 InvestCoach
                    </h1>
                    <nav className='hidden md:flex space-x-6'>
                      <Link
                        href='/'
                        className='text-muted-foreground hover:text-foreground transition-colors'
                      >
                        Dashboard
                      </Link>
                      <Link
                        href={'/portfolios' as Route}
                        className='text-muted-foreground hover:text-foreground transition-colors'
                      >
                        Portfolios
                      </Link>
                      <Link
                        href={'/checklists' as Route}
                        className='text-muted-foreground hover:text-foreground transition-colors'
                      >
                        Checklists
                      </Link>
                      <Link
                        href={'/reports' as Route}
                        className='text-muted-foreground hover:text-foreground transition-colors'
                      >
                        Reports
                      </Link>
                    </nav>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <span className='text-sm text-muted-foreground'>
                      Welcome to InvestCoach
                    </span>
                  </div>
                </div>
              </div>
            </header>
            <main className='container mx-auto px-4 py-8'>{children}</main>
            <footer className='border-t border-border mt-auto'>
              <div className='container mx-auto px-4 py-6'>
                <div className='text-center text-sm text-muted-foreground'>
                  <p>
                    &copy; 2024 InvestCoach. Built with Next.js, TypeScript, and
                    Supabase.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
