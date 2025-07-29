# Agent-Ready Demo Store

A stupidly simple e-commerce demo optimized for AI agents. Three hoodies, three endpoints, zero headaches.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 🤖 For AI Agents

- **Discovery**: `GET /.well-known/agent.json`
- **Search**: `GET /api/search?q=navy&max_price=40`
- **Purchase**: `POST /api/buy` with `{"sku": "HOODIE-BLACK", "qty": 1, "pay_token": "demo"}`

## 📋 Features

- ✅ **Agent Discovery** via `/.well-known/agent.json`
- ✅ **Search API** with query and price filters
- ✅ **Purchase API** with mock payments
- ✅ **Structured Data** (JSON-LD) for SEO
- ✅ **Semantic HTML** with ARIA labels
- ✅ **Mobile Responsive** design
- ✅ **Next.js 15** with Turbopack
- ✅ **Tailwind CSS v4**

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **TypeScript**: Full type safety
- **Deploy**: Vercel-ready

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── search/route.ts    # Product search endpoint
│   │   └── buy/route.ts       # Purchase endpoint
│   ├── page.tsx               # Main store page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── public/
│   ├── .well-known/
│   │   └── agent.json         # Agent discovery file
│   ├── robots.txt             # SEO crawler rules
│   └── sitemap.xml            # Site structure
└── package.json
```

## 🔧 Deploy to Vercel

```bash
vercel --prod
```

Then test with ChatGPT:
> "Visit https://your-deploy.vercel.app and find me a navy hoodie under $40"