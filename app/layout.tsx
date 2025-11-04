import '@/styles/globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import ThemeClient from '@/components/ThemeClient';

export const metadata: Metadata = {
	title: 'Realtime Chat',
	description: 'Mock realtime chat with Firebase Auth + RTDB'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen">
				<ThemeClient />
				{children}
			</body>
		</html>
	);
}
