'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  category: string
  name: string
  storage: string | null
  color: string | null
  condition: string | null
  priceCash: number | null
  priceCard: number | null
  isActive: boolean
  clicks: number
}

interface ProductsTableProps {
  products: Product[]
  shopSlug: string
}

export default function ProductsTable({ products, shopSlug }: ProductsTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  function formatPrice(cents: number | null) {
    if (!cents) return '—'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100)
  }

  function getVariation(product: Product) {
    const parts = []
    if (product.storage) parts.push(product.storage)
    if (product.color) parts.push(product.color)
    return parts.join(' • ') || '—'
  }

  async function handleToggle(productId: string) {
    setLoading(productId)
    try {
      await fetch(`/api/products/${productId}/toggle`, {
        method: 'POST',
      })
      router.refresh()
    } catch (error) {
      alert('Erro ao alterar status do produto')
    } finally {
      setLoading(null)
    }
  }

  async function handleDuplicate(product: Product) {
    setLoading(product.id)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: product.category,
          name: product.name,
          storage: product.storage,
          color: product.color,
          condition: product.condition,
          priceCash: product.priceCash,
          priceCard: product.priceCard,
        }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Erro ao duplicar produto')
      }
    } catch (error) {
      alert('Erro ao duplicar produto')
    } finally {
      setLoading(null)
    }
  }

  function copyLink(productId: string) {
    const link = `${window.location.origin}/u/${shopSlug}?produto=${productId}`
    navigator.clipboard.writeText(link)
    alert('Link copiado!')
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                À vista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cartão
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliques
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className={!product.isActive ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-xs text-gray-500">{product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getVariation(product)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.condition === 'Lacrado' ? 'bg-green-100 text-green-800' :
                    product.condition === 'Seminovo' ? 'bg-yellow-100 text-yellow-800' :
                    product.condition === 'Vitrine' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {product.condition || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(product.priceCash)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(product.priceCard)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.clicks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link
                    href={`/produtos/${product.id}/editar`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDuplicate(product)}
                    disabled={loading === product.id}
                    className="text-green-600 hover:text-green-900 disabled:opacity-50"
                  >
                    Duplicar
                  </button>
                  <button
                    onClick={() => handleToggle(product.id)}
                    disabled={loading === product.id}
                    className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                  >
                    {product.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => copyLink(product.id)}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    Copiar link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
