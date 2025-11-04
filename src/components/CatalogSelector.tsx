'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface CatalogItem {
  name: string
  storages: string[]
  colors: string[]
}

interface CatalogCategory {
  category: string
  year: number
  items: CatalogItem[]
}

export default function CatalogSelector() {
  const router = useRouter()
  const [catalog, setCatalog] = useState<CatalogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedYear, setSelectedYear] = useState(0)
  const [selectedItem, setSelectedItem] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableYears, setAvailableYears] = useState<number[]>([])
  const [availableItems, setAvailableItems] = useState<CatalogItem[]>([])
  const [currentItem, setCurrentItem] = useState<CatalogItem | null>(null)

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/catalog')
        const data = await res.json()
        setCatalog(data)

        // Get unique categories
        const cats = Array.from(new Set(data.map((c: CatalogCategory) => c.category))) as string[]
        setAvailableCategories(cats)
      } catch (error) {
        console.error('Erro ao carregar catálogo:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCatalog()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      const years = catalog
        .filter(c => c.category === selectedCategory)
        .map(c => c.year)
        .sort((a, b) => b - a)
      setAvailableYears(years)
      setSelectedYear(0)
      setSelectedItem('')
    }
  }, [selectedCategory, catalog])

  useEffect(() => {
    if (selectedCategory && selectedYear) {
      const categoryData = catalog.find(
        c => c.category === selectedCategory && c.year === selectedYear
      )
      setAvailableItems(categoryData?.items || [])
      setSelectedItem('')
    }
  }, [selectedYear, selectedCategory, catalog])

  useEffect(() => {
    if (selectedItem) {
      const item = availableItems.find(i => i.name === selectedItem)
      setCurrentItem(item || null)
      setSelectedStorage('')
      setSelectedColor('')
    }
  }, [selectedItem, availableItems])

  async function handleAddProduct() {
    if (!selectedItem || !currentItem) return

    setSaving(true)

    try {
      const productData = {
        category: selectedCategory,
        name: currentItem.name,
        storage: selectedStorage || null,
        color: selectedColor || null,
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (res.ok) {
        router.push('/produtos')
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao adicionar produto')
      }
    } catch (error) {
      alert('Erro ao adicionar produto')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p className="text-center text-gray-500">Carregando catálogo...</p>
      </div>
    )
  }

  return (
    <div className="card max-w-2xl">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1. Selecione a categoria *
          </label>
          <select
            className="input-field"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Selecione...</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2. Selecione o ano *
            </label>
            <select
              className="input-field"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              <option value={0}>Selecione...</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedYear > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3. Selecione o modelo *
            </label>
            <select
              className="input-field"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">Selecione...</option>
              {availableItems.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {currentItem && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                4. Selecione a capacidade
              </label>
              <select
                className="input-field"
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
              >
                <option value="">Selecione...</option>
                {currentItem.storages.map((storage) => (
                  <option key={storage} value={storage}>
                    {storage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                5. Selecione a cor
              </label>
              <select
                className="input-field"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">Selecione...</option>
                {currentItem.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ Depois de adicionar, você poderá definir preço, condição e prazo.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddProduct}
                disabled={!selectedItem || saving}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Adicionando...' : 'Adicionar produto'}
              </button>
              <button
                onClick={() => router.push('/produtos')}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
