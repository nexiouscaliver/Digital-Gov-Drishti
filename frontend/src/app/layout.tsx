import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/user/Navbar'; // Adjust path if needed

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Digital Gov Drishti',
  description: 'Citizen Grievance Redressal System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}