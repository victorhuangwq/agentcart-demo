import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/app/lib/products'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')?.toLowerCase()
    const maxPrice = searchParams.get('max_price')
    const minPrice = searchParams.get('min_price')
    const category = searchParams.get('category')?.toLowerCase()
    const color = searchParams.get('color')?.toLowerCase()
    
    let results = [...PRODUCTS]
    
    if (query) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.color.toLowerCase().includes(query)
      )
    }
    
    if (category) {
      results = results.filter(p => p.category === category)
    }
    
    if (color) {
      results = results.filter(p => p.color.toLowerCase() === color)
    }
    
    if (maxPrice && !isNaN(Number(maxPrice))) {
      results = results.filter(p => p.price <= Number(maxPrice))
    }
    
    if (minPrice && !isNaN(Number(minPrice))) {
      results = results.filter(p => p.price >= Number(minPrice))
    }
    
    return NextResponse.json({ 
      success: true,
      results, 
      count: results.length 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to search products' 
    }, { status: 500 })
  }
}