# GitHub Branching Strategy & Rules

This document outlines the branching strategy and rules for this Astro personal portfolio project. This is an open source project deployed to Netlify. Adhering to this strategy will ensure a clean commit history, prevent integration issues, and streamline the development and deployment process.

We adopt a **Trunk-Based Development** model, where `main` is the single source of truth. Deployments to Netlify are triggered automatically when changes are merged to `main`.

---

## 1. The Core Branch: `main`

The repository will have one primary long-lived branch: `main`

- **Purpose**: This branch is the single source of truth for the project. It contains the latest stable, reviewed, and merged code. All new development starts from `main`.
- **Rule**: No one can push directly to `main`. All code must be added via pull requests from feature branches.

---

## 2. Feature Branches

All new work—including features, bug fixes, and chores—must be done on a dedicated feature branch.

**Creation:**

```bash
# Make sure your local main branch is up-to-date
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b <branch-name>
```

**Naming Convention:**

- `feature/<short-description>` (e.g., `feature/new-blog-section`)
- `fix/<short-description>` (e.g., `fix/navbar-mobile-styling`)
- `chore/<short-description>` (e.g., `chore/update-dependencies`)

---

## 3. The Development Workflow

1. **Create a Branch**: From `main`.
2. **Develop**: Make your code changes and commit them.
3. **Open a Pull Request**: Push your feature branch and open a PR to merge into `main`.
4. **Code Review & CI**: All checks must pass before merging.
5. **Merge**: Squash and merge the PR into `main`.
6. **Deploy**: Netlify automatically deploys the updated `main` branch to production.
7. **Delete Branch**: Remove the feature branch after merging. (Automated)

---

## 4. Deployment Workflow

This project is deployed to Netlify with automatic deployments configured.

### **Preview Deployments**

- Every pull request automatically gets a preview deployment on Netlify
- Preview URL is posted as a comment on the PR
- Allows testing changes before merging to production

### **Production Deployment**

- Merging to `main` triggers an automatic production deployment to Netlify
- Production site is updated within minutes
- Netlify handles build optimization and CDN distribution

### **Optional: Version Tagging**

While not required for deployment, you may optionally create GitHub Releases for significant updates:

- Use semantic versioning (e.g., `v1.0.0`, `v1.1.0`)
- Target the `main` branch
- Document notable changes in release notes

---

## 5. Branch Protection Rules (GitHub Settings)

To enforce this strategy, the follwing rules applies on `main` branch:
owing rules apply to the `main` branch:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require conversation resolution before merging

_Note: For personal projects, approval reviews are optional but can be enabled if collaborating with others._