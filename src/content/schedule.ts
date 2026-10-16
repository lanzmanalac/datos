export type ScheduleItem = {
	id: string;
	timeLabel: string;
	title: string;
	detail?: string;
	kind: 'session' | 'break' | 'logistics' | 'community';
};

export const schedule: ScheduleItem[] = [
	{
		id: 'registration',
		timeLabel: '4:00 PM',
		title: 'Registration',
		detail: 'Meet the room before talks.',
		kind: 'logistics',
	},
	{
		id: 'opening',
		timeLabel: '4:30 PM',
		title: 'Opening',
		detail: 'What the day is for.',
		kind: 'logistics',
	},
	{
		id: 'founder',
		timeLabel: '4:45 PM',
		title: "Founder's talk",
		detail: 'Why DEP started, and where it is going.',
		kind: 'session',
	},
	{
		id: 'renzi-bigquery',
		timeLabel: '5:15 PM',
		title: 'BigQuery + Conversational Analytics',
		detail: 'Renzi Vidal on what you need before trying this at work.',
		kind: 'session',
	},
	{
		id: 'beyond-gcp',
		timeLabel: '6:00 PM',
		title: 'End-to-End Data Engineering on GCP (with AI)',
		detail: 'Geoff Newell on one GCP pipeline, and where AI would fail on a team.',
		kind: 'session',
	},
	{
		id: 'break',
		timeLabel: '6:45 PM',
		title: 'Break',
		kind: 'break',
	},
	{
		id: 'panel',
		timeLabel: '7:00 PM',
		title: 'Career panel',
		detail: 'Data Engineering Career in the Age of AI',
		kind: 'session',
	},
	{
		id: 'dep-projects',
		timeLabel: '8:00 PM',
		title: 'DEP Projects',
		detail: 'See member projects and ask how to join.',
		kind: 'community',
	},
	{
		id: 'closing',
		timeLabel: '8:30 PM',
		title: 'Closing and picture-taking',
		detail: 'Questions, then a group photo.',
		kind: 'logistics',
	},
];

export const schedulePreview = schedule.filter((item) => item.kind !== 'break').slice(0, 5);
