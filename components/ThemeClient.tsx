"use client";

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';

export default function ThemeClient() {
	const { current, apply } = useThemeStore();
	useEffect(() => {
		apply();
	}, [current, apply]);
	return null;
}
