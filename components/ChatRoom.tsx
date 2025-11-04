"use client";

import { useParams, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';
import { useRoomsStore } from '@/store/rooms';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function ChatRoom() {
	const params = useParams();
	const router = useRouter();
	const { user } = useUserStore();
	const { rooms, joinRoom, leaveRoom, deleteRoom } = useRoomsStore();
	const roomId = String(params?.roomId || '');
	const room = rooms[roomId];

	const [messages, setMessages] = useState<{ id: string; text: string; uid: string }[]>([]);
	const [text, setText] = useState('');
	const listRef = useRef<HTMLDivElement>(null);

	// joining requires password; do not auto-join

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [messages.length]);

	if (!room) {
		return <div className="p-4">Room not found.</div>;
	}

	const isOwner = user.id === room.ownerId;
	const isMember = !!room.participants[user.id];
	const [joinPassword, setJoinPassword] = useState('');

	async function handleJoinWithPassword() {
		const ok = await joinRoom(roomId, user.id, joinPassword);
		if (!ok) return;
		setJoinPassword('');
	}

	function sendMessage() {
		if (!text.trim()) return;
		setMessages((prev) => [...prev, { id: Math.random().toString(36).slice(2), text: text.trim(), uid: user.id }]);
		setText('');
	}

	async function handleDelete() {
		if (!isOwner) return;
		await deleteRoom(roomId, user.id);
		router.push('/');
	}

	async function handleLeave() {
		if (isOwner) return;
		await leaveRoom(roomId, user.id);
		router.push('/');
	}

	return (
		<div className="h-full flex flex-col">
			<div className="border-b p-3 flex items-center justify-between">
				<div>
					<div className="font-medium">{room.name}</div>
					<div className="text-xs text-gray-500">Participants: {Object.keys(room.participants || {}).length}</div>
				</div>
				<div className="flex items-center gap-2">
					{isOwner ? (
						<button className="rounded-md border px-3 py-1.5 text-sm text-red-600" onClick={handleDelete}>
							Delete Room
						</button>
					) : (
						isMember ? (
							<button className="rounded-md border px-3 py-1.5 text-sm" onClick={handleLeave}>
								Leave Room
							</button>
						) : null
					)}
				</div>
			</div>
			{!isMember ? (
				<div className="p-4 space-y-2">
					<p className="text-sm text-gray-600">Enter password to join this room.</p>
					<div className="flex gap-2">
						<input
							className="w-full rounded-md border px-3 py-2 text-sm"
							placeholder="Password"
							type="password"
							value={joinPassword}
							onChange={(e) => setJoinPassword(e.target.value)}
						/>
						<button className="btn-primary" onClick={handleJoinWithPassword}>Join Room</button>
					</div>
				</div>
			) : (
				<>
					<div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
						{messages.length === 0 ? (
							<p className="text-sm text-gray-500">No messages yet. Say hi 👋</p>
						) : (
							messages.map((m) => (
								<div
									key={m.id}
									className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.uid === user.id ? 'ml-auto' : ''}`}
									style={{
										background: m.uid === user.id ? 'var(--bubble-self-bg)' : 'var(--bubble-other-bg)',
										color: m.uid === user.id ? 'var(--bubble-self-fg)' : 'var(--bubble-other-fg)'
									}}
								>
									{m.text}
								</div>
							))
						)}
					</div>
					<div className="border-t p-3 flex gap-2">
						<input
							className="flex-1 rounded-md border px-3 py-2 text-sm"
							placeholder="Type a message"
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') sendMessage();
							}}
						/>
						<button className="btn-primary" onClick={sendMessage}>
							Send
						</button>
					</div>
				</>
			)}
		</div>
	);
}
