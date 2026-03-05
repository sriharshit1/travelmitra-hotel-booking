import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'TravelMitra - Premium Hotel Reservations',
    description: 'Book your perfect stay with TravelMitra.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
