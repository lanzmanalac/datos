export type RegistrationStatus = 'opening-soon' | 'open' | 'closed';

export const registration = {
	status: 'opening-soon' as RegistrationStatus,
	meetupUrl: 'https://www.meetup.com/data-engineering-pilipinas/',
	howTo: [
		'Watch this page for the registration status update.',
		'When registration opens, join through the Meetup event link.',
		'Arrive ready to learn, ask questions, and meet the DEP community.',
	],
	statusCopy: {
		'opening-soon': {
			banner: 'Registration not open yet',
			ctaLabel: 'Registration not open',
			ctaEnabled: false,
		},
		open: {
			banner: 'Registration Open',
			ctaLabel: 'Register on Meetup',
			ctaEnabled: true,
		},
		closed: {
			banner: 'Registration Closed',
			ctaLabel: 'Registration closed',
			ctaEnabled: false,
		},
	},
} as const;
