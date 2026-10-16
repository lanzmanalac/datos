export type SocialLink = {
	id: 'website' | 'meetup' | 'facebook' | 'linkedin';
	label: string;
	href: string;
};

export const socials: SocialLink[] = [
	{ id: 'website', label: 'Website', href: 'https://dataengineering.ph' },
	{ id: 'meetup', label: 'Meetup', href: 'https://www.meetup.com/data-engineering-pilipinas/' },
	{ id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/groups/dataengineeringpilipinas' },
	{ id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/data-engineering-pilipinas' },
];
