# ☁️ TechStackScale

**TechStackScale** is a platform designed to help developers, CTOs, and entrepreneurs make data-driven decisions about cloud infrastructure. We compare real-time pricing from top providers and offer intelligent tools to find the best plan for your needs.

## 🌟 Why use TechStackScale?

- **Save Time & Money:** Stop overpaying for cloud resources. Our tools find the absolute best performance-to-cost ratio.
- **Data-Driven Decisions:** Compare providers side-by-side using real, constantly updated hardware metrics and pricing.
- **Intelligent Scoring & Ranking:** Plans are evaluated dynamically using a custom algorithm that weighs (RAM, CPU, Storage, Transfer) against Price.
- **Global Audience Ready:** Fully internationalized (EN, ES, FR) to help teams worldwide.

## ✨ Features

### 📊 Provider Comparison Table
Side-by-side feature matrix for cloud providers (Hostinger, DigitalOcean, Hetzner). Interactive plan selector with dropdown to compare any plan from each provider.

### 🧮 Smart Calculator
Advanced filtering engine to find your ideal server plan:
- Filter by **price, RAM (MB/GB), CPU, storage, transfer, app nodes, and provider**
- Results ranked by a **custom score algorithm** weighing specs vs. cost
- Real-time results with provider toggle buttons

### 🐳 Docker Stack Generator
Generate production-ready `docker-compose.yml` files optimized for any plan:
- Supports **Node.js, WordPress, Python, Laravel, and Go** stacks
- Resource limits (CPU/RAM) auto-configured based on plan specs
- **Copy to clipboard** and **download as `.yml`** functionality
- Includes logging configuration and environment variable placeholders

### 📖 Guides
- **Install Docker on your VPS in 1 minute** — Step-by-step guide with SSH connection, official install script, and verification commands.

### 🏠 Homepage
- **Provider highlight cards** with best plans, live pricing, and affiliate links
- **Value Proposition section** showcasing platform benefits
- **Docker Stack generation** directly from provider cards

### 🌐 Internationalization (i18n)
Full multi-language support (English, Spanish, French) across all pages, including the calculator, Docker modal, guides, and legal pages.

### 📄 Legal & SEO
- Privacy Policy, Terms of Service, and Cookie Policy pages
- Dynamic sitemap generation per locale and provider
- Open Graph, Twitter Cards, JSON-LD structured data, and Google Search Console verification

## 🛠️ Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Internationalization:** `next-intl` v4
- **Data:** Automated Python scrapers (Hostinger, DigitalOcean, Hetzner)
- **Analytics:** Vercel Analytics + Google Analytics
- **Deployment:** Vercel

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/niusvel/techstackscale.git
cd techstackscale

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
├── app/
│   ├── sitemap.ts
│   └── [locale]/
│       ├── page.tsx                     # Homepage
│       ├── compare/                     # Provider comparison table
│       ├── calculator/                  # Smart plan calculator
│       ├── cloud/[provider]/            # Individual provider pages
│       ├── guides/install-docker/       # Docker install guide
│       ├── privacy/ | terms/ | cookies/ # Legal pages
│       └── components/                  # Shared UI components
├── i18n/                                # Routing & request config
├── messages/                            # Translation files (en, es, fr)
├── data/                                # Provider JSON data
├── utils/                               # Helpers (currency, docker-generator)
└── scrapers/                            # Python price scrapers
```

## 📈 Roadmap
- [x] Real-time cloud cost comparison
- [x] Side-by-side provider comparison table
- [x] Smart calculator with scoring algorithm
- [x] Docker Stack Generator (Node.js, WordPress, Python, Laravel, Go)
- [x] Install Docker guide
- [x] Multi-language support (EN, ES, FR)
- [x] SEO optimization (sitemap, structured data, meta tags)
- [ ] Weekly Tech Deals Newsletter
- [ ] More providers (AWS, Linode, Vultr)
- [ ] Database TCO comparison (Supabase vs PlanetScale)

---
*Developed by a Fullstack Developer with experience in high-scale retail environments.*
