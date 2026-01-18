# Lewis Kori's Portfolio ✨

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro)](https://astro.build)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify)](https://www.netlify.com)

A modern, multilingual personal portfolio built with Astro, showcasing my projects, blog posts, work experience, and more. This site is designed to be fast, accessible, and SEO-friendly.

## 🌟 Features

- **⚡️ Lightning Fast**: Built with Astro for optimal performance and SEO
- **🌍 Multilingual Support**: Available in English can expand to Spanish, French, and German etc
- **📱 Fully Responsive**: Beautiful on all devices
- **🎨 Modern UI**: Styled with Tailwind CSS v4 and custom components
- **📝 Blog**: Write and share technical articles with markdown
- **💼 Portfolio**: Showcase projects with detailed descriptions
- **🎯 About & Experience**: Professional background and work history
- **🔗 Social Integration**: Connect via various social platforms
- **🌙 Theme Support**: Light/sepia/dark mode switching
- **♿️ Accessible**: Built with accessibility best practices

## 🚀 Tech Stack

- **Framework**: [Astro](https://astro.build) v5
- **Styling**: [Tailwind CSS](https://tailwindcss.com) v4
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev)
- **Package Manager**: pnpm
- **Deployment**: Netlify
- **Version Control**: Git & GitHub

## 📁 Project Structure

```text
/
├── .github/              # GitHub configuration and workflows
├── public/               # Static assets
│   └── projects/        # Project images and media
├── src/
│   ├── assets/          # Image assets
│   ├── components/      # Astro components
│   │   ├── hero/       # Hero section components
│   │   ├── navs/       # Navigation components
│   │   ├── shared/     # Shared utility components
│   │   └── ui/         # UI components library
│   ├── content/         # Content collections
│   │   ├── about/      # About page content
│   │   ├── blog/       # Blog posts (markdown)
│   │   ├── projects/   # Project descriptions
│   │   └── sponsors/   # Sponsors information
│   ├── data/            # JSON data files
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility functions
│   ├── pages/           # Astro pages (routes)
│   ├── styles/          # Global styles
│   └── utils/           # Helper utilities (i18n, etc.)
├── astro.config.mjs     # Astro configuration
├── components.json      # UI components configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Installs dependencies                            |
| `pnpm dev`                | Starts local dev server at `localhost:4321`      |
| `pnpm build`              | Build your production site to `./dist/`          |
| `pnpm preview`            | Preview your build locally, before deploying     |
| `pnpm astro ...`          | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help`    | Get help using the Astro CLI                     |

## 🚢 Deployment

This site is automatically deployed to Netlify:

- **Production**: Deploys automatically when changes are merged to `main`
- **Preview**: Every pull request gets a preview deployment for testing

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read the [branching strategy](.github/branching-strategy.md) before contributing.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lewis Kori**

Feel free to reach out or follow my work!

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)
- Deployed on [Netlify](https://www.netlify.com)

---

⭐ If you find this project useful or interesting, please consider giving it a star!
