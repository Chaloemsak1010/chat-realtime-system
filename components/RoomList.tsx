"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRoomsStore } from '@/store/rooms';
import { useUserStore } from '@/store/user';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RoomList() {
	const { rooms, subscribeRooms, createRoom, joinRoom } = useRoomsStore();
	const { user } = useUserStore();
	const [showCreate, setShowCreate] = useState(false);
	const [roomName, setRoomName] = useState('');
	const [roomPassword, setRoomPassword] = useState('');
	const [joinName, setJoinName] = useState('');
	const [joinPassword, setJoinPassword] = useState('');
	const router = useRouter();

	useEffect(() => {
		subscribeRooms();
	}, [subscribeRooms]);

	const roomsArray = useMemo(
		() => Object.values(rooms).sort((a, b) => a.name.localeCompare(b.name)),
		[rooms]
	);

	async function handleCreate() {
		if (!roomName.trim() || !roomPassword) return;
		const id = await createRoom(roomName.trim(), user.id, roomPassword);
		setRoomName('');
		setRoomPassword('');
		setShowCreate(false);
		router.push(`/rooms/${id}`);
	}

	async function handleJoinByName() {
		const target = joinName.trim().toLowerCase();
		if (!target || !joinPassword) return;
		const match = Object.values(rooms).find((r) => r.name.toLowerCase() === target);
		if (match) {
			const ok = await joinRoom(match.id, user.id, joinPassword);
			if (ok) {
				router.push(`/rooms/${match.id}`);
				setJoinName('');
				setJoinPassword('');
			}
		}
	}

	return (
		<div className="h-full flex flex-col">
			<div className="p-4 border-b space-y-3">
				<div className="font-semibold">Rooms</div>
				{showCreate ? (
					<div className="space-y-2">
						<input
							className="w-full rounded-md border px-3 py-2 text-sm"
							placeholder="Room name"
							value={roomName}
							onChange={(e) => setRoomName(e.target.value)}
						/>
						<input
							className="w-full rounded-md border px-3 py-2 text-sm"
							placeholder="Password"
							type="password"
							value={roomPassword}
							onChange={(e) => setRoomPassword(e.target.value)}
						/>
						<div className="flex gap-2">
							<button className="btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
							<button className="btn-primary" onClick={handleCreate}>Create Room</button>
						</div>
					</div>
				) : (
					<button className="btn-primary" onClick={() => setShowCreate(true)}>Create Room</button>
				)}
				<div className="flex gap-2">
					<input
						className="w-full rounded-md border px-3 py-2 text-sm"
						placeholder="Join by room name"
						value={joinName}
						onChange={(e) => setJoinName(e.target.value)}
					/>
					<input
						className="w-full rounded-md border px-3 py-2 text-sm"
						placeholder="Password"
						type="password"
						value={joinPassword}
						onChange={(e) => setJoinPassword(e.target.value)}
					/>
					<button className="btn-outline" onClick={handleJoinByName}>Join</button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto">
				{roomsArray.length === 0 ? (
					<p className="p-4 text-sm text-gray-500">No rooms yet. Create one!</p>
				) : (
					<ul className="p-2">
						{roomsArray.map((room) => (
							<li key={room.id} className="">
								<Link
									href={`/rooms/${room.id}`}
									className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
								>
									<div className="font-medium">{room.name}</div>
									<div className="text-xs text-gray-500">
										Owner: {room.ownerId.slice(0, 6)} • Participants: {Object.keys(room.participants || {}).length}
									</div>
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
