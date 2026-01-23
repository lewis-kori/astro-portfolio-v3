import aboutImage from '@/assets/about-image.webp';
import profileImage from '@/assets/lewis-profile-no-bg.webp';

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
  tagline: string;
  authorDescription: string;
  avatar: ImageMetadata;
  profileImage: ImageMetadata;
  url: string;
  location: string;
  email: string;
  phone: string;
}

export const siteConfig: SiteConfig = {
  name: 'Lewis Kori',
  title: 'Lewis Kori – Building Products, Systems, and Leverage',
  url: 'https://lewiskori.com',
  description:
    'Entrepreneur and product builder working at the intersection of technology, capital, and trust. Building platforms, advising institutions, and exploring how systems scale.',
  tagline: 'Building Products, Systems and Companies That Endure',
  authorDescription:
    'I am an entrepreneur and technologist focused on building scalable digital products, trusted platforms and businesses designed for long-term impact. My work spans product development, venture building and advisory across technology-driven markets.',
  avatar: aboutImage,
  location: '  Kenya',
  email: 'n8tocd0jy@mozmail.com',
  phone: '+254 712 345678',
  profileImage: profileImage,
};
