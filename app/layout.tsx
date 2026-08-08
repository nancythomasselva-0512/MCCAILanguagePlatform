import type { Metadata } from 'next';
import '../src/index.css';
import '../src/fonts.css';
import '../src/App.css';
import '../src/components/common/EchoidAuth.css';
import 'quill/dist/quill.snow.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Fluentia - Language Platform',
  description: 'Enterprise AI Language, Voice, Translation and Audio Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
