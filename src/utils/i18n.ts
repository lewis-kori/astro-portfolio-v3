/**
 * i18n (Internationalization) using Astro's built-in system
 *
 * Astro handles routing automatically with the i18n config.
 * This file just provides translations for your content.
 */

export const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
};

export const defaultLang = 'en';

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'hero.title': "Hi, I'm Lewis Kori",
    'hero.subtitle': 'Full-stack Developer & Tech Enthusiast',
    'hero.cta': 'View My Work',
    'about.title': 'About Me',
    'projects.title': 'My Projects',
    'contact.title': 'Get In Touch',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Sobre Mí',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    'hero.title': 'Hola, soy Lewis Kori',
    'hero.subtitle': 'Desarrollador Full-stack y Entusiasta de la Tecnología',
    'hero.cta': 'Ver Mi Trabajo',
    'about.title': 'Sobre Mí',
    'projects.title': 'Mis Proyectos',
    'contact.title': 'Contactar',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    'hero.title': 'Bonjour, je suis Lewis Kori',
    'hero.subtitle': 'Développeur Full-stack et Passionné de Technologie',
    'hero.cta': 'Voir Mon Travail',
    'about.title': 'À Propos',
    'projects.title': 'Mes Projets',
    'contact.title': 'Me Contacter',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.about': 'Über Mich',
    'nav.projects': 'Projekte',
    'nav.contact': 'Kontakt',
    'hero.title': 'Hallo, ich bin Lewis Kori',
    'hero.subtitle': 'Full-stack Entwickler und Technik-Enthusiast',
    'hero.cta': 'Meine Arbeit Ansehen',
    'about.title': 'Über Mich',
    'projects.title': 'Meine Projekte',
    'contact.title': 'Kontaktieren',
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
