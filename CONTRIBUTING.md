# Contributing to Studio Admin

Thanks for showing interest in improving **Studio Admin** (repo: `backoffice-sastreria`).  
This guide will help you set up your environment and understand how to contribute.

---

## Overview

This project is built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Shadcn UI**.  
The goal is to keep the codebase modular, scalable, and easy to extend.

---

## Project Layout

We use a **colocation-based file system**. Each feature keeps its own pages, components, and logic.

```
src
├── app               # Next.js routes (App Router)
│   ├── (auth)        # Auth layouts & screens
│   ├── (main)        # Main dashboard routes
│   │   └── (dashboard)
│   │       ├── crm
│   │       ├── finance
│   │       ├── default
│   │       └── ...
│   └── layout.tsx
├── components        # Shared UI components
├── hooks             # Reusable hooks
├── lib               # Config & utilities
├── styles            # Tailwind / theme setup
└── types             # TypeScript definitions
```

If you’d like a more detailed example of this setup, check out the [Next Colocation Template](https://github.com/juandeto/next-colocation-template), where the full structure is explained with examples.

---

## Getting Started

### Fork and Clone the Repository

1. Fork the Repository
   
   Click [here](https://github.com/juandeto/backoffice-sastreria/fork) to fork the repository.

2. Clone the Repository  
   ```bash
   git clone https://github.com/YOUR_USERNAME/backoffice-sastreria.git
   ```
   
3. Navigate into the Project  
   ```bash
   cd backoffice-sastreria
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000).

---

## Guidelines

- Prefer **TypeScript types** over `any`
- Husky pre-commit hooks are enabled - linting and formatting run automatically when you commit, and if there are errors the commit will be blocked until they are fixed. 
- Follow **Shadcn UI** style & Tailwind v4 conventions
- Keep accessibility in mind (ARIA, keyboard nav)
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, etc.)
- Avoid unnecessary dependencies — prefer existing utilities where possible

---

**Happy Vibe Coding!**
