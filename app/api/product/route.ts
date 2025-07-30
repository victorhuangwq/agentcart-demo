import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/app/lib/products'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sku = searchParams.get('sku')
    
    if (!sku) {
      return NextResponse.json({ 
        success: false, 
        error: 'SKU parameter is required' 
      }, { status: 400 })
    }
    
    const product = PRODUCTS.find(p => p.sku === sku.toUpperCase())
    
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      success: true,
      product 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 })
  }
}