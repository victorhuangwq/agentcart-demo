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
  
  if (maxPrice && !isNaN(Number(maxPrice))) results = results.filter(p => p.price <= Number(maxPrice))
  if (minPrice && !isNaN(Number(minPrice))) results = results.filter(p => p.price >= Number(minPrice))
  
  return NextResponse.json({ results, count: results.length })
}