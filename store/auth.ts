"use client";

import { create } from 'zustand';
import { onAuthStateChanged, signInWithGoogle, signOutUser, type User } from '@/lib/firebase';

export type AuthState = {
	user: User | null;
	loading: boolean;
	ready: boolean;
	signIn: () => Promise<void>;
	signOut: () => Promise<void>;
	init: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	loading: false,
	ready: false,
	signIn: async () => {
		set({ loading: true });
		try {
			await signInWithGoogle();
		} finally {
			set({ loading: false });
		}
	},
	signOut: async () => {
		set({ loading: true });
		try {
			await signOutUser();
		} finally {
			set({ loading: false });
		}
	},
	init: () => {
		onAuthStateChanged(
			// auth is fetched within onAuthStateChanged from lib/firebase
			// we import the function re-export which already binds to app instance
			// @ts-ignore — lib re-export signature matches Firebase
			undefined,
			(user) => set({ user, ready: true })
		);
	}
}));
