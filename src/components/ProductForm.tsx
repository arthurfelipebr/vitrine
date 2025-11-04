'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id?: string
  category: string
  name: string
  model?: string | null
  storage?: string | null
  color?: string | null
  condition?: string | null
  priceCash?: number | null
  priceCard?: number | null
  deliveryTime?: string | null
  notes?: string | null
  paymentLink?: string | null
  imageUrl?: string | null
}

interface ProductFormProps {
  product?: Product
}

const categories = ['iPhone', 'iPad', 'Watch', 'Mac']
const conditions = ['Lacrado', 'Seminovo', 'Vitrine']

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    category: product?.category || 'iPhone',
    name: product?.name || '',
    storage: product?.storage || '',
    color: product?.color || '',
    condition: product?.condition || 'Lacrado',
    priceCash: product?.priceCash ? (product.priceCash / 100).toFixed(2) : '',
    priceCard: product?.priceCard ? (product.priceCard / 100).toFixed(2) : '',
    deliveryTime: product?.deliveryTime || '',
    notes: product?.notes || '',
    paymentLink: product?.paymentLink || '',
    imageUrl: product?.imageUrl || '',
  })

  function handleChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convert prices to cents
      const priceCash = formData.priceCash ? Math.round(parseFloat(formData.priceCash) * 100) : null
      const priceCard = formData.priceCard ? Math.round(parseFloat(formData.priceCard) * 100) : null

      const data = {
        category: formData.category,
        name: formData.name,
        storage: formData.storage || null,
        color: formData.color || null,
        condition: formData.condition || null,
        priceCash,
        priceCard,
        deliveryTime: formData.deliveryTime || null,
        notes: formData.notes || null,
        paymentLink: formData.paymentLink || '',
        imageUrl: formData.imageUrl || '',
      }

      const url = product?.id ? `/api/products/${product.id}` : '/api/products'
      const method = product?.id ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Erro ao salvar produto')
        return
      }

      router.push('/produtos')
      router.refresh()
    } catch (err) {
      setError('Erro ao salvar produto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl">
      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            id="category"
            required
            className="input-field"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do produto *
          </label>
          <input
            id="name"
            type="text"
            required
            className="input-field"
            placeholder="Ex.: iPhone 15 Pro"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-1">
              Capacidade
            </label>
            <input
              id="storage"
              type="text"
              className="input-field"
              placeholder="Ex.: 256GB"
              value={formData.storage}
              onChange={(e) => handleChange('storage', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
              Cor
            </label>
            <input
              id="color"
              type="text"
              className="input-field"
              placeholder="Ex.: Titânio Natural"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
            Condição
          </label>
          <select
            id="condition"
            className="input-field"
            value={formData.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
          >
            <option value="">Selecione uma condição</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priceCash" className="block text-sm font-medium text-gray-700 mb-1">
              Preço à vista (R$)
            </label>
            <input
              id="priceCash"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="0.00"
              value={formData.priceCash}
              onChange={(e) => handleChange('priceCash', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="priceCard" className="block text-sm font-medium text-gray-700 mb-1">
              Preço no cartão (R$) <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <input
              id="priceCard"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              placeholder="0.00"
              value={formData.priceCard}
              onChange={(e) => handleChange('priceCard', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700 mb-1">
            Prazo de entrega
          </label>
          <input
            id="deliveryTime"
            type="text"
            className="input-field"
            placeholder='Ex.: "Pronta entrega" ou "Até 10 dias"'
            value={formData.deliveryTime}
            onChange={(e) => handleChange('deliveryTime', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="paymentLink" className="block text-sm font-medium text-gray-700 mb-1">
            Link de pagamento <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <input
            id="paymentLink"
            type="url"
            className="input-field"
            placeholder="https://..."
            value={formData.paymentLink}
            onChange={(e) => handleChange('paymentLink', e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Se não preencher, a vitrine exibe &quot;Falar no WhatsApp&quot;
          </p>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL da imagem <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <input
            id="imageUrl"
            type="url"
            className="input-field"
            placeholder="https://..."
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Observações <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            maxLength={500}
            className="input-field"
            placeholder="Ex.: Produto importado, nota de serviço, garantia com a loja..."
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Máximo 500 caracteres
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Use &quot;Duplicar&quot; na lista para criar variações de cor/armazenamento.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/produtos')}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  )
}
