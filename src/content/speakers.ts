export type Speaker = {
	id: string;
	name: string;
	title: string;
	org: string;
	bio: string;
	session: string;
	photoSrc?: string;
	status: 'confirmed' | 'tba';
};

export const speakers: Speaker[] = [
	{
		id: 'founder',
		name: 'Speaker TBA',
		title: 'Founder',
		org: 'Data Engineering Pilipinas',
		bio: 'Founder talk details coming soon.',
		session: "Founder's talk",
		status: 'tba',
	},
	{
		id: 'renzi-bigquery',
		name: 'Renzi Vidal',
		title: 'Speaker',
		org: 'TBA',
		bio: 'See how conversational analytics sits on BigQuery, and what you would need to try it at work.',
		session: 'BigQuery + Conversational Analytics',
		status: 'confirmed',
	},
	{
		id: 'beyond-gcp',
		name: 'Geoff Newell',
		title: 'Speaker',
		org: 'Beyond',
		bio: 'Walk through one GCP pipeline that uses AI, and ask where it would break on a real team.',
		session: 'End-to-end data engineering on GCP, with AI',
		status: 'confirmed',
	},
	{
		id: 'panel',
		name: 'Career panel',
		title: 'Hosted by Anam & Kata',
		org: 'DEP Community',
		bio: '!-!-! Waiting for confirmation about more info about the career panel',
		session: 'Data Engineering Career in the Age of AI',
		status: 'confirmed',
	},
];

export const speakersPreview = speakers.filter((s) => s.id !== 'founder');
