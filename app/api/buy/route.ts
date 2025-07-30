import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/app/lib/products'

export async function POST(req: NextRequest) {
  try {
    const { sku, qty, pay_token, size, email } = await req.json()

    if (!sku) {
      return NextResponse.json({ 
        success: false, 
        error: 'SKU is required' 
      }, { status: 400 })
    }

    const product = PRODUCTS.find(p => p.sku === sku.toUpperCase())
    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 400 })
    }

    if (!qty || qty < 1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid quantity' 
      }, { status: 400 })
    }

    if (!pay_token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment token required' 
      }, { status: 400 })
    }

    // Check if size is required and valid
    if (product.sizes.length > 1 && !size) {
      return NextResponse.json({ 
        success: false, 
        error: 'Size is required for this product',
        available_sizes: product.sizes
      }, { status: 400 })
    }

    const selectedSize = size || product.sizes[0]
    if (!product.sizes.includes(selectedSize)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid size',
        available_sizes: product.sizes
      }, { status: 400 })
    }

    // Check inventory
    if (product.inventory[selectedSize] < qty) {
      return NextResponse.json({ 
        success: false, 
        error: 'Insufficient inventory',
        available_quantity: product.inventory[selectedSize]
      }, { status: 400 })
    }

    // Calculate delivery date (3-5 business days)
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 5)
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })

    // Generate order ID
    const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
    
    return NextResponse.json({ 
      success: true,
      order_id: orderId,
      sku: product.sku,
      product_name: product.name,
      qty,
      size: selectedSize,
      unit_price: product.price,
      total_price: product.price * qty,
      delivery_date: formattedDeliveryDate,
      email_confirmation: email ? `Confirmation sent to ${email}` : 'No email provided',
      message: 'Order placed successfully! Your order will arrive by ' + formattedDeliveryDate
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process order' 
    }, { status: 500 })
  }
}