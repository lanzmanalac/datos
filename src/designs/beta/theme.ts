export const THEMES = {
	dark: {
		name: 'dark',
		themeColor: '#03040a',
	},
	light: {
		name: 'light',
		themeColor: '#eef0f4',
	},
} as const;

export type ThemeName = keyof typeof THEMES;
export type Theme = (typeof THEMES)[ThemeName];

export type ThemeListener = (theme: Theme) => void;
export type Unsubscribe = () => void;

export type ThemeResolutionInput = {
	readonly stored: unknown;
	readonly system: ThemeName | null;
};

export const STORAGE_KEY = 'datos-beta-theme';
const THEME_CHANGE = 'beta-theme-change';

const TOGGLE: Record<ThemeName, ThemeName> = {
	dark: 'light',
	light: 'dark',
};

export function parseThemeName(raw: unknown): ThemeName | null {
	if (typeof raw !== 'string') return null;
	return raw in THEMES ? (raw as ThemeName) : null;
}

export function themeFromName(name: ThemeName): Theme {
	return THEMES[name];
}

export function resolveTheme(input: ThemeResolutionInput): Theme {
	const fromStored = parseThemeName(input.stored);
	if (fromStored) return THEMES[fromStored];
	if (input.system) return THEMES[input.system];
	return THEMES.dark;
}

export function readTheme(): Theme {
	const fromDom = parseThemeName(document.documentElement.dataset.theme);
	if (fromDom) return themeFromName(fromDom);
	return resolveTheme({ stored: readStoredRaw(), system: readSystemTheme() });
}

export function toggleTheme(): Theme {
	const next = THEMES[TOGGLE[readTheme().name]];
	applyTheme(next, { persist: true });
	return next;
}

export function subscribeTheme(listener: ThemeListener): Unsubscribe {
	const onChange = (event: Event) => {
		const detail = (event as CustomEvent<Theme>).detail;
		if (detail && detail.name in THEMES) listener(detail);
	};

	const onStorage = (event: StorageEvent) => {
		if (event.key !== STORAGE_KEY) return;
		const name = parseThemeName(event.newValue);
		if (!name) return;
		applyTheme(themeFromName(name), { persist: false });
	};

	document.addEventListener(THEME_CHANGE, onChange);
	window.addEventListener('storage', onStorage);

	return () => {
		document.removeEventListener(THEME_CHANGE, onChange);
		window.removeEventListener('storage', onStorage);
	};
}

type ApplyOptions = { persist: boolean };

function applyTheme(theme: Theme, options: ApplyOptions): void {
	const html = document.documentElement;
	const meta = document.querySelector('meta[name="theme-color"]');
	const already =
		html.dataset.theme === theme.name &&
		html.style.colorScheme === theme.name &&
		(!meta || meta.getAttribute('content') === theme.themeColor);

	html.dataset.theme = theme.name;
	html.style.colorScheme = theme.name;
	if (meta) meta.setAttribute('content', theme.themeColor);

	if (options.persist) {
		try {
			localStorage.setItem(STORAGE_KEY, theme.name);
		} catch {}
	}

	if (already) return;

	document.dispatchEvent(new CustomEvent(THEME_CHANGE, { detail: theme }));
}

function readSystemTheme(): ThemeName | null {
	if (typeof window.matchMedia !== 'function') return null;
	if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
	if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
	return null;
}

function readStoredRaw(): unknown {
	try {
		return localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}
