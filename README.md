# Lewis Kori's Portfolio ✨

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro)](https://astro.build)
[![Deployed on Cloudflare](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?logo=cloudflare)](https://pages.cloudflare.com)

A modern, content-rich personal portfolio built with Astro, showcasing projects, blog posts, work experience, advisory services, and operating notes. Designed for entrepreneurs, technologists, and product builders who want a professional, performant web presence.

## 🌟 Features

### Core Functionality

- **⚡️ Lightning Fast**: Built with Astro v5 for optimal performance and SEO
- **📱 Fully Responsive**: Beautiful on all devices with mobile-first design
- **🎨 Modern UI**: Styled with Tailwind CSS v4 and custom components
- **♿️ Accessible**: Built with accessibility best practices
- **🌙 Multi-Theme Support**: Light, dark, and sepia mode switching

### Content & Pages

- **🏠 Home**: Hero section with about, work experience, featured projects, and latest blog posts
- **📝 Blog**: Technical articles with markdown, tags, series support, and sponsor integration
- **💼 Projects**: Portfolio showcase with GitHub links, live demos, and app store integrations
- **👨‍💼 Advisory**: Information about selective advisory work with venture capital firms
- **📓 Operating Notes**: Practical reflections on building companies and operating with leverage
- **📚 Resources**: Curated lists of books, tech stack, desktop setup, and tools
- **📧 Contact**: Professional contact form with budget ranges and service options
- **ℹ️ About**: Detailed professional background and bio

### Technical Features

- **🌍 i18n Support**: Multi-language infrastructure (English, Spanish, French, German)
- **📰 Newsletter Integration**: Email capture with API endpoint
- **🔗 Social Integration**: Share buttons, sticky social links, and author sidebars
- **📊 Content Collections**: Organized content with Astro's Content Collections API
- **🏷️ Dynamic Routing**: SEO-friendly URLs for blog posts and projects
- **🤖 Sitemap & Robots**: Automatic sitemap generation and robots.txt

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build) v5.16+ (SSG with partial hydration)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4.1+
- **UI Components**: Custom components inspired by [shadcn/ui](https://ui.shadcn.com) with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev)
- **Content**: Astro Content Collections with markdown support
- **TypeScript**: Full type safety across the project
- **Package Manager**: pnpm
- **Deployment**: Cloudflare Pages with automatic deployments
- **Version Control**: Git & GitHub

## 📁 Project Structure

```text
/
├── .github/                    # GitHub configuration and workflows
├── public/                     # Static assets
│   └── projects/              # Project images and media
├── src/
│   ├── assets/                # Image assets (profile, covers, etc.)
│   ├── components/            # Astro & React components
│   │   ├── home/             # Homepage sections (About, Blogs, Projects, etc.)
│   │   ├── navs/             # Navigation (Navbar, MobileNav, SideNav)
│   │   ├── shared/           # Reusable components
│   │   │   ├── NewsletterForm.astro
│   │   │   ├── ShareModal.astro
│   │   │   ├── ThemeSwitcher.astro
│   │   │   └── ...
│   │   └── ui/               # UI component library
│   ├── content/              # Content Collections (markdown + frontmatter)
│   │   ├── about/           # About page content
│   │   ├── advisory/        # Advisory services content
│   │   ├── blog/            # Blog posts (30+ articles)
│   │   ├── operatingNotes/  # Operating notes
│   │   ├── projects/        # Project case studies
│   │   └── sponsors/        # Sponsor information
│   ├── data/                 # JSON data collections
│   │   ├── books.json       # Reading list
│   │   ├── desktop-setup.json
│   │   ├── experience.json  # Work experience
│   │   ├── socials.json     # Social media links
│   │   └── tech-stack.json  # Tools and technologies
│   ├── layouts/              # Page layouts
│   │   ├── BlogLayout.astro # Blog post layout
│   │   └── Layout.astro     # Base layout
│   ├── pages/                # Routes (file-based routing)
│   │   ├── index.astro      # Homepage
│   │   ├── about.astro      # About page
│   │   ├── projects.astro   # Projects page
│   │   ├── advisory.astro   # Advisory page
│   │   ├── operating-notes.astro
│   │   ├── resources.astro  # Resources page
│   │   ├── contact.astro    # Contact form
│   │   ├── blog/            # Blog routes
│   │   │   ├── index.astro  # Blog listing
│   │   │   └── [slug]/      # Dynamic blog posts
│   │   └── api/
│   │       └── newsletter.ts # Newsletter API endpoint
│   ├── lib/                  # Utility functions
│   ├── styles/               # Global CSS
│   └── utils/                # Helper utilities (i18n, etc.)
├── astro.config.mjs          # Astro configuration
├── components.json           # shadcn/ui components config
└── tsconfig.json             # TypeScript configuration
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## ⚙️ Environment Setup

This project uses environment variables for API keys and configuration. To get started:

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:
   - `BEEHIIV_PUBLICATION_ID` - Your Beehiiv publication ID for newsletter integration
   - `BEEHIIV_API_KEY` - Your Beehiiv API key
   - `GTM_ID` - Your Google Tag Manager ID for analytics

See [.env.example](.env.example) for the complete template.

## 🚢 Deployment

This site is automatically deployed to Cloudflare Pages:

- **Production**: Deploys automatically when changes are merged to `main`
- **Preview Deployments**: Automatic preview deployments for all pull requests

📄 Pages Overview

### Public Pages

- **/** - Homepage with hero, about, experience, projects, and blog sections
- **/about** - Detailed professional background and bio
- **/projects** - Portfolio of projects with tech stack and links
- **/blog** - Blog listing with all articles
- **/blog/[slug]** - Individual blog posts with author sidebar and sponsors
- **/advisory** - Advisory services and collaboration opportunities
- **/operating-notes** - Personal operating principles and reflections
- **/resources** - Books, tech stack, desktop setup, and tools
- **/contact** - Professional contact form
- **/404** - Custom 404 error page

### API Routes

- **/api/newsletter** - Newsletter subscription endpoint

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.rst](CONTRIBUTING.rst) for detailed guidelines and [branching strategy](.github/branching-strategy.md) for workflow information.

## 🎨 Customization

This portfolio is designed to be easily customizable:

1. **Site Configuration**: Update [src/config.ts](src/config.ts) with your personal information
2. **Content**: Add/edit markdown files in `src/content/` directories
3. **Data**: Update JSON files in `src/data/` for experience, socials, books, etc.
4. **Styling**: Customize Tailwind configuration or global styles
5. **Components**: Modify or create new components as needed

For contribution guidelines, see [CONTRIBUTING.rst](CONTRIBUTING.rst).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lewis Kori**

Feel free to reach out or follow my work!

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)

---

⭐ If you find this project useful or interesting, please consider giving it a star!
