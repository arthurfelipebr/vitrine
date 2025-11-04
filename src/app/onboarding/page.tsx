'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user already has a shop
  useEffect(() => {
    async function checkShop() {
      const res = await fetch('/api/shops/me')
      const shop = await res.json()
      if (shop && shop.id) {
        router.push('/dashboard')
      }
    }
    checkShop()
  }, [router])

  // Auto-generate slug from name
  function handleNameChange(value: string) {
    setName(value)
    const autoSlug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setSlug(autoSlug)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          whatsapp: whatsapp || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar loja')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Erro ao criar loja. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bem-vindo à sua vitrine
          </h2>
          <p className="mt-2 text-center text-gray-600 max-w-xl mx-auto">
            Aqui você organiza seus iPhones, iPads, Macs e Watches e compartilha tudo por um link único.
          </p>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-6">Criar minha loja</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da loja *
              </label>
              <input
                id="name"
                type="text"
                required
                className="input-field"
                placeholder="Ex.: Blu Imports"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL da vitrine) *
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">vitrine.app/u/</span>
                <input
                  id="slug"
                  type="text"
                  required
                  className="input-field flex-1"
                  placeholder="bluimports"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Apenas letras minúsculas, números e hífens
              </p>
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp (opcional)
              </label>
              <input
                id="whatsapp"
                type="tel"
                className="input-field"
                placeholder="5511999999999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
              />
              <p className="mt-1 text-xs text-gray-500">
                Apenas números, incluindo código do país (Ex.: 5511999999999)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 Você pode mudar isso depois em Configurações da Loja.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar minha loja'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
