"use client";

import { create } from 'zustand';

export type Room = {
	id: string;
	name: string;
	ownerId: string;
	participants: Record<string, boolean>;
	password: string; // demo only; stored in plain text
};

export type RoomsState = {
	rooms: Record<string, Room>;
	currentRoomId: string | null;
	loading: boolean;
	subscribeRooms: () => void;
	createRoom: (name: string, ownerId: string, password: string) => Promise<string>;
	joinRoom: (roomId: string, userId: string, password: string) => Promise<boolean>;
	leaveRoom: (roomId: string, userId: string) => Promise<void>;
	deleteRoom: (roomId: string, userId: string) => Promise<void>;
	setCurrentRoom: (roomId: string | null) => void;
};

let channel: BroadcastChannel | null = null;

function loadRooms(): Record<string, Room> {
	if (typeof window === 'undefined') return {} as any;
	try {
		return JSON.parse(localStorage.getItem('rooms') || '{}');
	} catch {
		return {} as any;
	}
}

function saveRooms(rooms: Record<string, Room>) {
	if (typeof window === 'undefined') return;
	localStorage.setItem('rooms', JSON.stringify(rooms));
	channel?.postMessage({ type: 'rooms:update', payload: rooms });
}

function generateId(): string {
	return Math.random().toString(36).slice(2, 10);
}

export const useRoomsStore = create<RoomsState>((set, get) => ({
	rooms: {},
	currentRoomId: null,
	loading: true,
	subscribeRooms: () => {
		if (typeof window === 'undefined') return;
		set({ rooms: loadRooms(), loading: false });
		if (!channel) channel = new BroadcastChannel('rooms');
		channel.onmessage = (ev) => {
			if (ev.data?.type === 'rooms:update') {
				set({ rooms: ev.data.payload });
			}
		};
	},
	createRoom: async (name, ownerId, password) => {
		const id = generateId();
		const next = { ...get().rooms } as Record<string, Room>;
		next[id] = { id, name, ownerId, password, participants: { [ownerId]: true } } as Room;
		saveRooms(next);
		set({ rooms: next });
		return id;
	},
	joinRoom: async (roomId, userId, password) => {
		const next = { ...get().rooms } as Record<string, Room>;
		const room = next[roomId];
		if (!room) return false;
		if (room.password !== password) return false;
		next[roomId].participants[userId] = true;
		saveRooms(next);
		set({ rooms: next });
		return true;
	},
	leaveRoom: async (roomId, userId) => {
		const next = { ...get().rooms } as Record<string, Room>;
		if (!next[roomId]) return;
		delete next[roomId].participants[userId];
		saveRooms(next);
		set({ rooms: next });
	},
	deleteRoom: async (roomId, userId) => {
		const next = { ...get().rooms } as Record<string, Room>;
		const room = next[roomId];
		if (!room) return;
		if (room.ownerId !== userId) return; // enforce ownership in UI
		delete next[roomId];
		saveRooms(next);
		set({ rooms: next, currentRoomId: get().currentRoomId === roomId ? null : get().currentRoomId });
	},
	setCurrentRoom: (roomId) => set({ currentRoomId: roomId })
}));
