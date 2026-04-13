# 🚀 Professional Frontend Engineer Portfolio

Welcome to my interactive portfolio! This repository contains the source code for my personal portfolio website, designed with a focus on **high performance**, **premium fluid animations**, and **clean architectural practices**. 

Built leveraging modern technologies to demonstrate advanced frontend engineering capabilities.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Performance:** Hardware-accelerated CSS Filters, Layout Engine Offloading, Intersect Observer Patterns.
- **State Management:** React Hooks & Context API

## ✨ Key Features

- 🎭 **Fully Interactive "Physics-Based" Micro-animations:** Ambient background elements react dynamically to your mouse utilizing custom layout animations with math-driven physics calculations.
- 🎨 **Theme & Internationalization:** Instant Dark/Light mode toggles alongside English/Spanish support, persisting seamlessly without hydration mismatch.
- 🧩 **Modular Architecture:** Extracted atomic UI components (`ProjectModal`, `DocumentViewer`, `Lightbox`, `MiniCarousel`) for maximum maintainability.
- 🚀 **100% Optimized Rendering:** Complex graphical elements like the glowing orbs use `requestAnimationFrame` hooks and scaled CSS blurs for rock-solid 60FPS on any mobile or desktop hardware.
- 📱 **Mobile-First Responsiveness:** Flawless layout adapting precisely from ultra-wide screens to mobile screens.
- ♿ **Accessibility:** Semantic HTML boundaries, correct ARIA labels, and keyboard navigation support out of the box.

## 📂 Project Structure

```
.
├── src/
│   ├── app/                 # Next.js App Router (Layouts & Pages)
│   ├── components/          # Sharable UI Components (Modals, Icons, Glows)
│   ├── context/             # Global State (LanguageContext)
│   ├── data/                # Content models (portfolio data & translations)
│   └── types/               # TypeScript Definitions
├── public/                  # Static assets and optimizations
├── package.json
└── README.md
```

## 🚀 Getting Started

To run this project locally, simply clone the repository and install the dependencies:

```bash
# Install packages
npm install
# or yarn install

# Start Local Dev Server
npm run dev
# or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 🤝 Best Practices Highlight
- Linting configured aggressively with `eslint` & `Prettier`.
- Modular separation of concerns.
- Avoided `any` typings; strict typings implemented.
- Optimized bundle sizes natively managed by Next.js `next/image`.

---

*“Performance is not an afterthought — it is the essence of design.”*
