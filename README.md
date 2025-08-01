# 🛒 AgentCart Demo Store

> **The future of e-commerce is here.** This isn't just another online store—it's what happens when you make a YouTube creator's merch store completely agent-ready. 🤖

## What You're Looking At

This demo site is the **actual output** of the AgentCart platform. We transformed a creator merchandise store (hoodies, hats, limited edition sneakers) into something AI agents can actually shop from. No more abandoned carts. No more "I can browse but can't buy" frustration.

**The magic?** Any AI agent can now:
1. 🔍 **Discover** your products instantly
2. 🎯 **Search** with natural language 
3. 💳 **Purchase** in a single API call

## 🎪 Try It Live

**For Humans:** [Visit the demo store](https://agentcart-demo-site.vercel.app) and browse like normal

**For Agents:** Tell ChatGPT, Claude, or any AI agent:
> *"Visit https://agentcart-demo-site.vercel.app and find me a black hoodie in size L"*

Watch them actually complete the purchase. Mind = blown. 🤯

## 🧠 How AgentCart Works

```
Your Shopify Store → AgentCart Platform → Agent-Ready Website
     🏪                    ⚡                     🤖
```

**Before AgentCart:**
- Agent: "I found your store but can't checkout" 😵
- You: Lost sales from the AI economy

**After AgentCart:**
- Agent: Discovers → Searches → Buys in seconds ⚡
- You: +8% revenue from agent traffic (pilot store data)

## 🚀 Quick Start (If You Want to Run This Demo)

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 🤖 Agent API Reference

Want to build an agent that shops here? Here's everything you need:

### Discovery
```bash
GET /.well-known/agent-store.json
# Returns: store info, 9 products (hoodies, hats, shoes), API endpoints
```

### Search Products
```bash
GET /api/search?category=hoodie&color=black
# Filter by category, color, price, or search query
```

### Get Product Details
```bash
GET /api/product?sku=HOODIE-BLACK-001
# Returns: full product details including sizes and inventory
```

### Complete Purchase
```bash
POST /api/buy
{
  "sku": "HOODIE-BLACK-001",
  "qty": 1,
  "size": "L",
  "pay_token": "demo"
}
# Returns: { "success": true, "order_id": "ord_abc123", "delivery_date": "..." }
```

## 🏗️ What Makes This Agent-Ready

- ✅ **Agent Discovery** via `/.well-known/agent-store.json`
- ✅ **Semantic Search** with natural language
- ✅ **One-Click Purchase** API (no cart complexity)
- ✅ **Structured Data** (JSON-LD) for discoverability
- ✅ **Universal Standards** (OpenAPI, MCP compatible)
- ✅ **Zero Integration** hassle for agents

## 🎯 The AgentCart Vision

**Today:** Agents can browse your store but can't buy anything  
**Tomorrow:** Every purchase decision becomes as simple as asking an AI

This demo proves it works. Now imagine your entire Shopify catalog being this accessible to the growing army of AI shopping agents.

## 🔥 Tech Stack (Because You Asked)

- **Framework**: Next.js 15 with Turbopack
- **Styling**: Tailwind CSS 
- **Testing**: Jest (86 tests, 100% API coverage)
- **Deploy**: Vercel Edge Functions
- **Standards**: MCP, OpenAPI, JSON-LD

## 🧪 Test Coverage

We're serious about reliability:

```bash
npm test              # Run all tests
npm run test:coverage # See the 100% API coverage
```

**86 tests covering:**
- Unit tests for every endpoint
- Integration tests for complete agent workflows  
- Performance tests for concurrent purchases
- Error handling for edge cases

## 🚀 Want This for Your Store?

This demo proves AgentCart works. Ready to transform your Shopify or WooCommerce into an agent paradise?

**[Get AgentCart →](https://agentcart.dev)**

*"Stripe for Agentic Commerce" — turning every store into an AI-friendly checkout paradise.*

---

**Built by the AgentCart team** | [GitHub](https://github.com/victorhuangwq/agentcart-demo-site) | [Live Demo](https://agentcart-demo-site.vercel.app)
