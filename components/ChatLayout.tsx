"use client";

import { ReactNode } from 'react';

export default function ChatLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[calc(100vh-56px)]">
			<aside className="border-r bg-gray-50">{sidebar}</aside>
			<main className="min-h-0">{children}</main>
		</div>
	);
}
