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
  title: 'Lewis Kori — Software Engineer, Product Builder & Operator',
  url: 'https://lewiskori.com',
  description:
    'Software engineer, product builder and business operator in Nairobi, Kenya, building scalable platforms and advising teams on product, technology and business strategy.',
  tagline: 'Building Products, Systems and Companies That Endure',
  authorDescription:
    'I’m a software engineer, product builder and business operator. I build scalable digital products and platforms, lead teams through complex technical decisions, and advise founders on product, technology and business strategy.',
  avatar: aboutImage,
  location: 'Nairobi, Kenya',
  email: 'n8tocd0jy@mozmail.com',
  phone: '+254 712 345678',
  profileImage: profileImage,
};
