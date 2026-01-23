Contributing to Lewis Kori's Portfolio
========================================

Thank you for considering contributing to this project! This document provides guidelines and instructions for contributing.

.. contents:: Table of Contents
   :depth: 2
   :local:

Code of Conduct
---------------

This project is intended to showcase professional work. Please be respectful and constructive in all interactions.

Ways to Contribute
------------------

Bug Reports
~~~~~~~~~~~

If you find a bug, please open an issue with:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots if applicable
- Your environment (browser, OS, etc.)

Feature Suggestions
~~~~~~~~~~~~~~~~~~~

Feature suggestions are welcome, but please note this is a personal portfolio. Open an issue describing:

- The feature and its use case
- Why it would be valuable
- Any implementation ideas

Code Contributions
~~~~~~~~~~~~~~~~~~

Pull requests for bug fixes, performance improvements, and accessibility enhancements are appreciated.

Development Setup
-----------------

Prerequisites
~~~~~~~~~~~~~

- **Node.js**: 18.x or higher
- **pnpm**: 8.x or higher (``npm install -g pnpm``)
- **Git**: Latest version

Getting Started
~~~~~~~~~~~~~~~

1. Fork the repository on GitHub

2. Clone your fork::

    git clone https://github.com/YOUR_USERNAME/astro-portfolio-v3.git
    cd astro-portfolio-v3

3. Add upstream remote::

    git remote add upstream https://github.com/lewis-kori/astro-portfolio-v3.git

4. Install dependencies::

    pnpm install

5. Start the development server::

    pnpm dev

The site will be available at ``http://localhost:4321``

Project Structure
~~~~~~~~~~~~~~~~~

::

    src/
    ├── components/      # Astro components
    │   ├── home/       # Homepage sections
    │   ├── navs/       # Navigation components
    │   ├── shared/     # Reusable components
    │   └── ui/         # UI primitives
    ├── content/        # Markdown content
    │   ├── blog/       # Blog posts
    │   ├── projects/   # Project pages
    │   ├── experience/ # Work experience
    │   └── ...         # Other content
    ├── layouts/        # Layout components
    ├── pages/          # Route pages
    ├── data/           # Static data files
    ├── lib/            # Utilities
    └── styles/         # Global styles

Development Guidelines
----------------------

Code Style
~~~~~~~~~~

- **TypeScript**: Use TypeScript for type safety
- **Formatting**: Follow the existing code style (indentation, spacing, etc.)
- **Components**: Keep components focused and reusable
- **File naming**: Use PascalCase for components (``MyComponent.astro``), kebab-case for utilities

Astro Best Practices
~~~~~~~~~~~~~~~~~~~~

- Minimize client-side JavaScript (use ``client:*`` directives sparingly)
- Optimize images using Astro's ``<Image>`` component
- Use Astro Content Collections for content management
- Prefer static generation (SSG) over server-side rendering

Styling
~~~~~~~

- Use Tailwind CSS v4 utility classes
- Follow mobile-first responsive design
- Maintain consistency with existing color scheme and spacing
- Support all three themes (light, dark, sepia)

Accessibility
~~~~~~~~~~~~~

- Ensure keyboard navigation works
- Include proper ARIA labels
- Maintain sufficient color contrast
- Test with screen readers when possible

Content Guidelines
~~~~~~~~~~~~~~~~~~

When adding or modifying content:

- Use proper markdown formatting
- Include appropriate frontmatter metadata
- Optimize images before adding them
- Write clear, concise descriptions

Pull Request Process
---------------------

1. **Create a branch**::

    git checkout -b feature/your-feature-name

2. **Make your changes** following the guidelines above

3. **Test thoroughly**:

   - Run the dev server and verify your changes
   - Build the project (``pnpm build``)
   - Preview the production build (``pnpm preview``)
   - Test on multiple browsers if making UI changes

4. **Commit your changes**::

    git add .
    git commit -m "feat: Add feature description"

   Use conventional commit messages:
   
   - ``feat:``: New feature
   - ``fix:``: Bug fix
   - ``docs:``: Documentation changes
   - ``style:``: Code style changes (formatting, etc.)
   - ``refactor:``: Code refactoring
   - ``perf:``: Performance improvements
   - ``test:``: Adding or updating tests
   - ``chore:``: Maintenance tasks

5. **Push to your fork**::

    git push origin feature/your-feature-name

6. **Open a Pull Request**:

   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of your changes
   - Reference any related issues

Pull Request Requirements
~~~~~~~~~~~~~~~~~~~~~~~~~~

- Clear description of changes
- No merge conflicts with main branch
- Project builds successfully
- Follows coding standards
- Maintains or improves performance
- Does not break existing functionality

Review Process
~~~~~~~~~~~~~~

- The maintainer will review your PR
- Address any feedback or requested changes
- Once approved, your PR will be merged
- Your contribution will be acknowledged

Building and Testing
--------------------

Available Scripts
~~~~~~~~~~~~~~~~~

- ``pnpm dev`` - Start development server
- ``pnpm build`` - Build for production
- ``pnpm preview`` - Preview production build

Production Build
~~~~~~~~~~~~~~~~

Always test your changes with a production build::

    pnpm build
    pnpm preview

This ensures your changes work correctly in the optimized, production environment.

Content Updates
---------------

Blog Posts
~~~~~~~~~~

To add a blog post, create a markdown file in ``src/content/blog/`` with frontmatter::

    ---
    title: "Your Post Title"
    description: "Brief description"
    date: "2026-01-23"
    tags: ["tag1", "tag2"]
    draft: false
    ---

    Your content here...

Projects
~~~~~~~~

Add projects in ``src/content/projects/`` with appropriate metadata including:

- Project name and description
- Technologies used
- Links (GitHub, live demo, app stores)
- Screenshots

Questions?
----------

If you have questions about contributing:

1. Check existing issues and discussions
2. Review the README.md for project documentation
3. Open an issue with your question

License
-------

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

Thank you for contributing! 🎉
