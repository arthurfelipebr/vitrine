import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'

export default async function Home() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Vitrine Apple</h1>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Sua vitrine de produtos Apple
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Crie e gerencie sua loja online de produtos Apple de forma simples e profissional.
            Compartilhe seus produtos com seus clientes através de um link personalizado.
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <Link
              href="/registro"
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-lg"
            >
              Começar agora
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-900 text-lg rounded-lg hover:bg-gray-50 font-semibold transition-colors shadow-lg border border-gray-300"
            >
              Já tenho conta
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Loja Personalizada
              </h3>
              <p className="text-gray-600">
                Crie sua vitrine com URL personalizada e compartilhe com seus clientes
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Produtos Apple
              </h3>
              <p className="text-gray-600">
                Adicione iPhones, MacBooks, iPads e outros produtos Apple ao seu catálogo
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gerenciamento Simples
              </h3>
              <p className="text-gray-600">
                Dashboard intuitivo para gerenciar seus produtos e visualizar estatísticas
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2024 Vitrine Apple. Plataforma para lojistas de produtos Apple.
          </p>
        </div>
      </footer>
    </div>
  )
}
