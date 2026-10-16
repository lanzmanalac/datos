/** Build in-page anchor hrefs for the main site (`/`) or a design prefix (`/v4/`). */
export function sectionHref(home: string, section: string): string {
	if (home === '/') return `/#${section}`;
	const base = home.endsWith('/') ? home : `${home}/`;
	return `${base}#${section}`;
}

export function normalizePath(pathname: string): string {
	return pathname.replace(/\/$/, '') || '/';
}

export function isSiteHome(pathname: string, home: string): boolean {
	return normalizePath(pathname) === normalizePath(home);
}
