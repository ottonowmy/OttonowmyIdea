import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Ottonowmy Idea - Partagez vos idées',
  description: 'Une plateforme pour explorer et créer des idées d\'applications',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <body>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
