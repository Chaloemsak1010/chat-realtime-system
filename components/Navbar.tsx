"use client";

import Link from 'next/link';
import { useUserStore } from '@/store/user';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/store/theme';
import { ThemeId } from '@/store/theme';

export default function Navbar() {
	const { user, setName, reset } = useUserStore();
	const [editing, setEditing] = useState(false);
	const [temp, setTemp] = useState(user.name);
	const { current, setTheme, apply } = useThemeStore();
	useEffect(() => { apply(); }, [apply]);

	return (
		<nav className="border-b bg-white">
			<div className="container h-14 flex items-center justify-between">
				<Link href="/" className="font-semibold bg-gradient-to-r from-[var(--accent-start)] to-[var(--accent-end)] bg-clip-text text-transparent">Realtime Chat</Link>
				<div className="flex items-center gap-3">
					<select
						className="rounded-md border px-2 py-1 text-sm"
						value={current}
						onChange={(e) => setTheme(e.target.value as ThemeId | 'default')}
					>
						<option value="default">Default</option>
						<option value="blue">Blue</option>
						<option value="purple">Purple</option>
						<option value="green">Green</option>
						<option value="orange">Orange</option>
						<option value="red">Red</option>
						<option value="yellow">Yellow</option>
						<option value="pink">Pink</option>
					</select>
					{editing ? (
						<div className="flex items-center gap-2">
							<input
								className="rounded-md border px-2 py-1 text-sm"
								value={temp}
								onChange={(e) => setTemp(e.target.value)}
							/>
							<button className="rounded-md border px-2 py-1 text-sm" onClick={() => { setName(temp || user.name); setEditing(false); }}>
								Save
							</button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<span className="hidden sm:inline text-sm text-gray-600"> {user.name}</span>
							<button className="rounded-md border px-2 py-1 text-sm" onClick={() => setEditing(true)}>
								Change name
							</button>
						</div>
					)}
				</div>
				<button
            type="submit"
            className="bg-red-600 text-white p-2  rounded-lg hover:bg-indigo-700 transition"
          >
            Logout
          </button>
			</div>
			
		</nav>
	);
}
