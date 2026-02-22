# Bventy Web

The premium, high-performance frontend for the [Bventy](https://bventy.in) marketplace. Built with Next.js 15, React 19, and Tailwind CSS 4.

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-06B6D4?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

## ✨ Overview

Bventy Web is a sophisticated marketplace frontend designed to provide a seamless, premium experience for both event organizers and service vendors. It features a modern, typography-driven UI, smooth interactive flows, and real-time data synchronization with the Bventy API.

### Key Features
- **Two-Sided Marketplace**: Dedicated dashboards for Organizers (demand) and Vendors (supply).
- **Quote Lifecycle**: Interactive system for requesting, responding to, and managing quotes.
- **Dynamic Vendor Profiles**: Rich gallery and portfolio management for vendors.
- **Admin Analytics**: Powerful data visualization layer for platform growth and marketplace metrics.
- **Modern Tech Architecture**: Leverages React 19's latest features and Next.js App Router for optimal performance.

## 🚀 Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4 (Vanilla CSS philosophy)
- **UI Components**: Radix UI / Heroicons / Lucide
- **Animations**: Framer Motion
- **State Management**: React Context (Auth)
- **Tracking**: PostHog & Umami

## 📁 Project Structure
```text
.
├── src/
│   ├── app/            # Next.js App Router (Pages & Layouts)
│   ├── components/     # Reusable UI & Domain Components
│   │   ├── ui/         # Base design system components
│   │   ├── auth/       # Authentication forms
│   │   ├── events/     # Event-specific components
│   │   └── vendor/     # Vendor dashboard components
│   ├── context/        # React Context (AuthContext)
│   ├── services/       # API abstraction layer (Axios)
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript interfaces
├── public/             # Static assets
└── docs/               # Detailed technical documentation
```

## 🚥 Getting Started

### Prerequisites
- Node.js 18.x or higher
- NPM / PNPM / Bun
- Access to a running [Bventy API](https://github.com/bventy/backend)

### Quick Start
1. **Clone the repository**:
   ```bash
   git clone https://github.com/bventy/web.git
   cd bventy-web
   ```
2. **Setup environment variables**:
   Create a `.env.local` file. See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for details.
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📖 Documentation
- [Architecture](docs/ARCHITECTURE.md) - Deep dive into patterns and state.
- [Contributing](docs/CONTRIBUTING.md) - Component guidelines and setup.
- [Environment Variables](docs/ENVIRONMENT.md) - Configuration reference.

## 🎨 Design Philosophy
Bventy follows a **minimalst, high-end aesthetic**:
- Focus on typography and whitespace.
- Subtle micro-animations via Framer Motion.
- Pure black/white/slate palette with vibrant accents for status indicators.
- Responsive by default using Tailwind's adaptive container system.

---
© 2026 Bventy. All rights reserved.
