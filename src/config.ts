export interface SocialData {
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
}

export const siteConfig: SiteConfig = {
  name: 'Lewis Kori – Entrepreneur, Product Builder, Operator',
  title: 'Lewis Kori – Building Products, Systems, and Leverage',
  description:
    'Entrepreneur and product builder working at the intersection of technology, capital, and trust. Building platforms, advising institutions, and exploring how systems scale.',
  avatar: '/src/assets/about-image.webp',
  location: '  Kenya',
  email: 'hello@lewiskori.com',
  phone: '+254 712 345678',
};

export const authorBio = {
  name: 'Lewis Kori',
  tagline: 'Turning ideas into scalable web solutions',
  description:
    "I'm a software engineer specializing in SaaS applications and MVP development for non-technical founders, indiehackers and startups.",
};
