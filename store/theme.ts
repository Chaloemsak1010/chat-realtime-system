"use client";

import { create } from 'zustand';

export type ThemeId =
	| 'default'
	| 'blue'
	| 'purple'
	| 'green'
	| 'orange'
	| 'red'
	| 'yellow'
	| 'pink';

export type ThemeState = {
	current: ThemeId;
	setTheme: (t: ThemeId) => void;
	apply: () => void;
};

function getInitialTheme(): ThemeId {
	if (typeof window === 'undefined') return 'default';
	return (localStorage.getItem('theme') as ThemeId) || 'default';
}

export const useThemeStore = create<ThemeState>((set, get) => ({
	current: getInitialTheme(),
	setTheme: (t) => {
		set({ current: t });
		if (typeof window !== 'undefined') {
			localStorage.setItem('theme', t);
			document.documentElement.setAttribute('data-theme', t);
		}
	},
	apply: () => {
		if (typeof window !== 'undefined') {
			document.documentElement.setAttribute('data-theme', get().current);
		}
	}
}));
