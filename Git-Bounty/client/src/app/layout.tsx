import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThirdWebProvider } from '@/layout/thirdweb-provder';
import ReactQueryProvider from '@/layout/react-query-provider';
import { Suspense } from 'react';
import DataBlockLoader from '@/element/loader';
import ThemeProvider from '@/layout/theme-provider';
export const metadata: Metadata = {
    title: 'Git Bounty',
    description: 'Get paid for your contributions to open source projects',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <ThirdWebProvider>
                <Suspense fallback={<DataBlockLoader />}>
                    <body>
                        <ThemeProvider>
                            <ReactQueryProvider>{children}</ReactQueryProvider>
                        </ThemeProvider>
                        <Toaster />
                    </body>
                </Suspense>
            </ThirdWebProvider>
        </html>
    );
}
