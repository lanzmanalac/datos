export type Sponsor = {
	id: string;
	name: string;
	tier: 'partner';
	status: 'tba' | 'confirmed';
	href?: string;
	logoSrc?: string;
};

export const sponsors: Sponsor[] = [
	{ id: 'partner-1', name: 'Partner TBA', tier: 'partner', status: 'tba' },
	{ id: 'partner-2', name: 'Partner TBA', tier: 'partner', status: 'tba' },
	{ id: 'partner-3', name: 'Partner TBA', tier: 'partner', status: 'tba' },
];
