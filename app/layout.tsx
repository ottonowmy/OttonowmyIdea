import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ottonowmy Idea',
  description: 'Partage tes idées d\'apps brillantes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
