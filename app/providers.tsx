'use client';

import React from 'react';
import { AppProvider } from '../src/context/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '692829825984-89f38mt3ojt7ff9gf0hkef5kh2h14rep.apps.googleusercontent.com';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppProvider>
        {children}
      </AppProvider>
    </GoogleOAuthProvider>
  );
}
