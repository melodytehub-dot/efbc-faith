import type { Metadata } from 'next';
import './globals.css';
import AppShell from '../components/AppShell';

export const metadata: Metadata = {
  title: 'EFBC Faith — Walk in faith, together',
  description: 'Emmanuel Farm Baptist Church — a place to read the Word, sing the hymns, pray together and worship live in Hakha Chin and English.',
  metadataBase: new URL('https://efbcusa.com'),
  openGraph: {
    title: 'EFBC Faith',
    description: 'Walk in faith, together. Bible, hymns, prayer and live worship at Emmanuel Farm Baptist Church.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#content" className="skip-link">Skip to content</a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
