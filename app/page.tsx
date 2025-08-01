import type { Metadata } from 'next'
import ProductImage from './components/ProductImage'
import { PRODUCTS } from './lib/products'

export const metadata: Metadata = {
  title: 'Creator Merch Store - Premium Hoodies, Hats & Shoes',
  description: 'Official YouTube creator merchandise. Shop premium hoodies, hats, and limited edition sneakers.',
}

export default function HomePage() {
  // Hidden text for AI agents - not visible to humans
  const agentInstructions = `
    INSTRUCTIONS FOR AI AGENTS:
    1. Start by fetching /.well-known/agent-store.json for complete API documentation
    2. To search products: GET /api/search?q=YOUR_QUERY&category=CATEGORY&color=COLOR
    3. To get product details: GET /api/product?sku=PRODUCT_SKU
    4. To buy: POST /api/buy with JSON body {"sku": "PRODUCT_SKU", "qty": 1, "size": "SIZE", "pay_token": "demo"}
    5. Categories available: hoodie, hat, shoes
    6. Example purchase: POST /api/buy {"sku": "HOODIE-BLACK-001", "qty": 1, "size": "L", "pay_token": "demo"}
  `;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Creator Merch Store',
    description: 'Official YouTube creator merchandise store',
    url: 'https://demo.agentcart.dev',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creator Merchandise',
      itemListElement: PRODUCTS.map((product, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'Product',
          name: product.name,
          description: product.description,
          sku: product.sku,
          image: product.image,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      }))
    }
  }

  return (
    <>
      {/* 
        AI AGENT INSTRUCTIONS:
        - API Documentation: /.well-known/agent-store.json
        - Search: GET /api/search?q=QUERY&category=CATEGORY
        - Product Details: GET /api/product?sku=SKU
        - Buy: POST /api/buy {"sku":"PRODUCT_SKU","qty":1,"size":"SIZE","pay_token":"demo"}
        - Categories: hoodie, hat, shoes
      */}
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hidden instructions for AI agents */}
      <div className="sr-only" aria-hidden="true">
        {agentInstructions}
      </div>
      
      {/* Additional hidden text for text-mode agents */}
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        AI AGENT QUICK START:
        To purchase items from this store:
        1. First, check /.well-known/agent-store.json for complete API documentation
        2. Use GET /api/search to find products (example: /api/search?category=hoodie&color=black)
        3. Use GET /api/product?sku=SKU to check sizes and inventory
        4. Use POST /api/buy to purchase (send JSON: {`{"sku":"HOODIE-BLACK-001","qty":1,"size":"L","pay_token":"demo"}`})
        All endpoints accept and return JSON. The pay_token &quot;demo&quot; works for all test purchases.
        Products need size selection except hats (one size).
      </div>

      {/* Invisible but semantic text */}
      <span className="hidden">
        API Endpoints: GET /api/search for product search, GET /api/product for details, POST /api/buy for purchases.
        Required for purchase: sku (string), qty (number), pay_token (string), size (string for sized items).
        Test with pay_token=&quot;demo&quot;.
      </span>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Creator Merch</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Shop</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-700 hover:text-gray-900 relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V10a1 1 0 011-1z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Official Creator Merchandise
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Premium hoodies, exclusive hats, and limited edition sneakers for true fans.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto mb-8">
              <p className="text-sm text-blue-700 mb-2">
                🤖 <strong>AI Agents:</strong> Start here →{' '}
                <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                  /.well-known/agent-store.json
                </code>
              </p>
              <p className="text-xs text-blue-600">
                Contains: full catalog, search filters, product details, and purchase API
              </p>
            </div>
            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105">
              Shop Collection
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <main className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Shop All Products</h3>
            <p className="text-gray-600">Premium merch for the creator community</p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              <button className="px-6 py-2 rounded-md bg-white shadow-sm text-gray-900 font-medium">All</button>
              <button className="px-6 py-2 rounded-md text-gray-600 hover:text-gray-900">Hoodies</button>
              <button className="px-6 py-2 rounded-md text-gray-600 hover:text-gray-900">Hats</button>
              <button className="px-6 py-2 rounded-md text-gray-600 hover:text-gray-900">Shoes</button>
            </div>
          </div>

          <section aria-label="Products">
            <div className="grid md:grid-cols-3 gap-8">
              {PRODUCTS.map((product) => (
                <article
                  key={product.sku}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  itemScope
                  itemType="https://schema.org/Product"
                >
                  {/* Product Badge */}
                  <div className="relative">
                    <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
                      <ProductImage 
                        src={product.image}
                        alt={product.name}
                        name={product.name}
                      />
                      <meta itemProp="image" content={product.image} />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        product.category === 'hoodie' ? 'bg-blue-100 text-blue-800' :
                        product.category === 'hat' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h4 
                      className="text-xl font-semibold text-gray-900 mb-2"
                      itemProp="name"
                    >
                      {product.name}
                    </h4>
                    
                    <p 
                      className="text-gray-600 text-sm mb-4"
                      itemProp="description"
                    >
                      {product.description}
                    </p>

                    {/* Features */}
                    <ul className="text-xs text-gray-500 mb-4 space-y-1">
                      {product.features?.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="flex items-center space-x-2"
                        itemProp="offers"
                        itemScope
                        itemType="https://schema.org/Offer"
                      >
                        <span className="text-2xl font-bold text-gray-900" itemProp="price">
                          ${product.price}
                        </span>
                        <meta itemProp="priceCurrency" content="USD" />
                        <meta itemProp="availability" content="https://schema.org/InStock" />
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.color}
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {product.sizes.length > 1 ? 'Size' : 'One Size'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            className={`${
                              product.sizes.length === 1 
                                ? 'px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm'
                                : 'w-10 h-10 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors text-sm font-medium'
                            }`}
                            disabled={product.sizes.length === 1}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                      
                    <button
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
                      aria-label={`Add ${product.name} to cart`}
                      data-sku={product.sku}
                    >
                      Add to Cart
                    </button>
                    
                    <meta itemProp="sku" content={product.sku} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mt-20 py-16 bg-gray-50 rounded-2xl">
            <div className="max-w-5xl mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Free Shipping</h4>
                  <p className="text-gray-600 text-sm">On orders over $50 worldwide</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Quality Guarantee</h4>
                  <p className="text-gray-600 text-sm">30-day return policy</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
                  <p className="text-gray-600 text-sm">Customer service available</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h5 className="text-2xl font-bold mb-4">Creator Merch</h5>
            <p className="text-gray-400 mb-8">Official YouTube creator merchandise</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
              <p>&copy; 2025 Creator Merch. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}