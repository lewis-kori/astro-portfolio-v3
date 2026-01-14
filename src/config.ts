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
  name: 'Lewis Astro Portfolio',
  title: 'Lewis Astro Portfolio',
  description: 'A personal portfolio website built with Astro.',
  avatar: '/src/assets/about-image.webp',
  location: '  Kenya',
  email: 'hello@lewiskori.com',
  phone: '+254 712 345678',
};
