import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import Footer from '@/components/Footer';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'English Pronunciation App',
  description: 'Boost your English pronunciation',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script src="/WebAudioRecorder/WebAudioRecorder.min.js" />
      </head>
      <body className="min-h-screen flex flex-col">
        <section>
          <Suspense fallback={<div className="flex w-full px-4 lg:px-40 py-4 items-center border-b text-center gap-8 justify-between h-[69px]" />}>
            <Navbar />
          </Suspense>
        </section>
        <Suspense fallback={<div className="flex w-full px-4 lg:px-40 py-4 items-center border-b text-center gap-8 justify-between h-[69px]" />}>
          <main className="flex flex-1 flex-col items-center py-16">
            {children}
          </main>
        </Suspense>
        <Footer/>
        <Toaster />
      </body>
    </html>
  )
}
