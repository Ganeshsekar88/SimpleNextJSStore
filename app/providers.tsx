'use client';

import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';

function ClerkThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: resolvedTheme === 'dark' ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      // defaultTheme='light'
      // enableSystem={true}
      disableTransitionOnChange
    >
      <ClerkThemeProvider>
        <Toaster />
        {children}
      </ClerkThemeProvider>
    </ThemeProvider>
  );
}

export default Providers;