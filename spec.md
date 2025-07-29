# AgentCart Demo Store – **Stupid‑Simple** Quickstart

> Three hoodies, three endpoints, zero headaches. If a ChatGPT agent can't buy here, it's the agent's fault.

---

## 1 · What You Get

* **URL** that you can say in ChatGPT: "Visit `demo.agentcart.dev` and find me a hoodie."
* Agent auto‑discovers products via `/search` and checks out via a **single `POST /buy` call**.
* No database, no payments API, no fancy manifests, just enough JSON for bots to party.

---

## 2 · Tech Stack (Keepin' It Tiny)

| Layer     | Choice                      | Rationale                     |
| --------- | --------------------------- | ----------------------------- |
| Framework | **Next.js 15**              | Latest with Turbopack         |
| Runtime   | **App Router + RSC**        | Modern React patterns         |
| Data      | In‑memory JS array          | Just three hoodies to demo    |
| Styling   | **Tailwind CSS v4**         | Latest JIT compiler           |
| Payments  | Mock – always returns `200` | We're demoing flow, not PCI   |
| Deploy    | **Vercel**                  | Zero‑config, edge functions   |

---

## 3 · File Tree

```text
next-stupid-store/
├─ app/
│  ├─ page.tsx          # Human storefront (3 hoodies, Buy buttons)
│  └─ api/
│     ├─ buy/route.ts   # POST /buy handler
│     └─ search/route.ts # GET /search handler
├─ public/
│  └─ .well-known/
│     └─ agent.json     # Bot‑readable catalog + endpoints
└─ README.md
```

---

## 4 · Bot‑Facing Contract

### 4.1 `GET /.well-known/agent.json`

```jsonc
{
  "store": "Hoodie Hut",
  "currency": "USD",
  "products": [
    {
      "sku": "HOODIE-BLACK",
      "name": "Classic Black Hoodie",
      "price": 25,
      "description": "Comfortable cotton blend, perfect for coding"
    },
    {
      "sku": "HOODIE-GRAY",
      "name": "Tech Gray Hoodie",
      "price": 30,
      "description": "Premium fabric with tech pocket"
    },
    {
      "sku": "HOODIE-NAVY",
      "name": "Navy Developer Hoodie",
      "price": 35,
      "description": "Extra cozy with embroidered logo"
    }
  ],
  "endpoints": {
    "search": "/search",
    "buy": "/buy"
  }
}
```

### 4.2 `GET /search`

**Query Parameters**
- `q` (optional): Search query to filter products
- `max_price` (optional): Maximum price filter
- `min_price` (optional): Minimum price filter

**Response**

```jsonc
{
  "results": [
    {
      "sku": "HOODIE-BLACK",
      "name": "Classic Black Hoodie",
      "price": 25,
      "description": "Comfortable cotton blend, perfect for coding"
    }
    // ... more products
  ],
  "count": 1
}
```

### 4.3 `POST /buy`

**Request**

```jsonc
{ "sku": "HOODIE-BLACK", "qty": 1, "pay_token": "demo" }
```

**Response**

```jsonc
{ "status": "success", "order_id": "ord_abc123" }
```

---

## 5 · Code Snippets

### 5.1 `app/api/search/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'

const PRODUCTS = [
  { sku: 'HOODIE-BLACK', name: 'Classic Black Hoodie', price: 25, description: 'Comfortable cotton blend, perfect for coding' },
  { sku: 'HOODIE-GRAY', name: 'Tech Gray Hoodie', price: 30, description: 'Premium fabric with tech pocket' },
  { sku: 'HOODIE-NAVY', name: 'Navy Developer Hoodie', price: 35, description: 'Extra cozy with embroidered logo' }
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')?.toLowerCase()
  const maxPrice = searchParams.get('max_price')
  const minPrice = searchParams.get('min_price')
  
  let results = [...PRODUCTS]
  
  if (query) {
    results = results.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query)
    )
  }
  
  if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice))
  if (minPrice) results = results.filter(p => p.price >= Number(minPrice))
  
  return NextResponse.json({ results, count: results.length })
}
```

### 5.2 `app/api/buy/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { sku, qty, pay_token } = await req.json()

  const validSkus = ['HOODIE-BLACK', 'HOODIE-GRAY', 'HOODIE-NAVY']
  if (!validSkus.includes(sku))
    return NextResponse.json({ error: 'sku not found' }, { status: 400 })

  // Pretend we charged the card 😉
  return NextResponse.json({ status: 'success', order_id: 'ord_abc123' })
}
```

### 5.3 `public/.well-known/agent.json`

*(Copy the JSON block above as‑is.)*

### 5.4 `app/page.tsx`

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-3xl font-bold">Hoodie Hut</h1>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="space-y-4">
            <img src="/hoodie-black.png" alt="Black hoodie" className="w-48 mx-auto" />
            <p className="font-medium">Classic Black Hoodie</p>
            <p>$25</p>
            <button className="bg-black text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
          <div className="space-y-4">
            <img src="/hoodie-gray.png" alt="Gray hoodie" className="w-48 mx-auto" />
            <p className="font-medium">Tech Gray Hoodie</p>
            <p>$30</p>
            <button className="bg-black text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
          <div className="space-y-4">
            <img src="/hoodie-navy.png" alt="Navy hoodie" className="w-48 mx-auto" />
            <p className="font-medium">Navy Developer Hoodie</p>
            <p>$35</p>
            <button className="bg-black text-white px-4 py-2 rounded">
              Add to Cart
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-500">Agents: see <code>/.well-known/agent.json</code></p>
      </div>
    </main>
  )
}
```

---

## 6 · 5‑Minute Build Steps

```bash
npx create-next-app@latest next-stupid-store --typescript --tailwind --app --turbopack
cd next-stupid-store
# Add the files above (overwrite defaults)
vercel --prod
```

Done. Open ChatGPT (Actions / Agent Mode) and ask:

> *Visit [https://YOUR-DEPLOY.vercel.app](https://YOUR-DEPLOY.vercel.app) and find me a navy hoodie under $40.*

The agent should:

1. Fetch `/.well-known/agent.json`.
2. Call `/search?q=navy&max_price=40` to find products.
3. Pick `HOODIE-NAVY`.
4. `POST /buy` → receives `{ status: "success" }`.

---

### Next (If You Ever Need More)

* Swap hard‑coded product array for SQLite or Supabase.
* Replace mock pay with Stripe Agent Pay (`pay_token`).
* Add more products to the catalog.
* Implement inventory tracking.

But for YC demo day? **This is plenty.**