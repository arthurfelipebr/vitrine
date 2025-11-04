'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

interface Product {
  id: string
  category: string
  name: string
  storage: string | null
  color: string | null
  condition: string | null
  priceCash: number | null
  priceCard: number | null
  deliveryTime: string | null
  notes: string | null
  paymentLink: string | null
  imageUrl: string | null
}

interface Shop {
  id: string
  name: string
  slug: string
  whatsapp: string | null
  logoUrl: string | null
}

interface StorefrontProps {
  shop: Shop
  products: Product[]
}

export default function Storefront({ shop, products }: StorefrontProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStorage, setFilterStorage] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [filterCondition, setFilterCondition] = useState('')
  const [filterDelivery, setFilterDelivery] = useState('')

  // Get unique values for filters
  const categories = Array.from(new Set(products.map(p => p.category)))
  const storages = Array.from(new Set(products.map(p => p.storage).filter(Boolean))) as string[]
  const colors = Array.from(new Set(products.map(p => p.color).filter(Boolean))) as string[]
  const conditions = Array.from(new Set(products.map(p => p.condition).filter(Boolean))) as string[]

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.storage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.color?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !filterCategory || product.category === filterCategory
      const matchesStorage = !filterStorage || product.storage === filterStorage
      const matchesColor = !filterColor || product.color === filterColor
      const matchesCondition = !filterCondition || product.condition === filterCondition
      const matchesDelivery = !filterDelivery ||
        (filterDelivery === 'pronta' && product.deliveryTime?.toLowerCase().includes('pronta')) ||
        (filterDelivery === 'encomenda' && !product.deliveryTime?.toLowerCase().includes('pronta'))

      return matchesSearch && matchesCategory && matchesStorage && matchesColor && matchesCondition && matchesDelivery
    })
  }, [products, searchQuery, filterCategory, filterStorage, filterColor, filterCondition, filterDelivery])

  function formatPrice(cents: number | null) {
    if (!cents) return null
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100)
  }

  function getWhatsAppLink(product: Product) {
    if (!shop.whatsapp) return '#'

    const message = `Olá! Tenho interesse no ${product.name}${product.storage ? ` ${product.storage}` : ''}${product.color ? ` ${product.color}` : ''} que vi na sua vitrine. Está disponível?`

    return `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`
  }

  async function handleProductClick(productId: string) {
    // Increment click counter
    try {
      await fetch(`/api/products/${productId}/click`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('Erro ao registrar clique:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {shop.logoUrl && (
                <img
                  src={shop.logoUrl}
                  alt={shop.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
                <p className="text-sm text-gray-500">Produtos Apple</p>
              </div>
            </div>
            {shop.whatsapp && (
              <a
                href={`https://wa.me/${shop.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Falar no WhatsApp
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Buscar por modelo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 card">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filtros</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Categoria</label>
              <select
                className="input-field text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Todas</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Capacidade</label>
              <select
                className="input-field text-sm"
                value={filterStorage}
                onChange={(e) => setFilterStorage(e.target.value)}
              >
                <option value="">Todas</option>
                {storages.map(storage => (
                  <option key={storage} value={storage}>{storage}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Cor</label>
              <select
                className="input-field text-sm"
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
              >
                <option value="">Todas</option>
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Condição</label>
              <select
                className="input-field text-sm"
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
              >
                <option value="">Todas</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Disponibilidade</label>
              <select
                className="input-field text-sm"
                value={filterDelivery}
                onChange={(e) => setFilterDelivery(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="pronta">Pronta entrega</option>
                <option value="encomenda">Encomenda</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500">
              {searchQuery || filterCategory || filterStorage || filterColor || filterCondition || filterDelivery
                ? 'Nenhum produto encontrado com os filtros selecionados.'
                : 'Nenhum produto disponível no momento.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card hover:shadow-lg transition-shadow">
                {product.imageUrl && (
                  <div className="mb-4 -mx-6 -mt-6">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                      {product.storage && ` — ${product.storage}`}
                      {product.color && ` — ${product.color}`}
                    </h3>
                    {product.condition && (
                      <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        product.condition === 'Lacrado' ? 'bg-green-100 text-green-800' :
                        product.condition === 'Seminovo' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {product.condition}
                      </span>
                    )}
                  </div>

                  {product.priceCash && (
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.priceCash)}
                      </div>
                      <div className="text-sm text-gray-600">à vista</div>
                      {product.priceCard && (
                        <div className="text-sm text-gray-500 mt-1">
                          ou {formatPrice(product.priceCard)} no cartão
                        </div>
                      )}
                    </div>
                  )}

                  {product.deliveryTime && (
                    <div className="text-sm text-gray-600">
                      📦 {product.deliveryTime}
                    </div>
                  )}

                  {product.notes && (
                    <div className="text-xs text-gray-500 border-t pt-2">
                      {product.notes}
                    </div>
                  )}

                  <div className="pt-2">
                    {product.paymentLink ? (
                      <a
                        href={product.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleProductClick(product.id)}
                        className="btn-primary w-full text-center block"
                      >
                        Pagar agora
                      </a>
                    ) : (
                      <a
                        href={getWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleProductClick(product.id)}
                        className="btn-primary w-full text-center block"
                      >
                        Falar no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          Vitrine criada com <span className="font-semibold">Vitrine Apple</span>
        </div>
      </footer>
    </div>
  )
}
