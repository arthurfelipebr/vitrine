import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const shop = await prisma.shop.findFirst({
    where: { ownerId: user.id },
  })

  if (!shop) {
    redirect('/onboarding')
  }

  // Get products stats
  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
  })

  const activeProducts = products.filter(p => p.isActive).length
  const totalClicks = products.reduce((sum, p) => sum + p.clicks, 0)

  // Calculate clicks from last 7 days (simplified - in production, track click timestamps)
  const clicksLast7Days = totalClicks

  // Products without price
  const productsWithoutPrice = products.filter(p => !p.priceCash).length

  // Products without image
  const productsWithoutImage = products.filter(p => !p.imageUrl).length

  // Products not updated in 7+ days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const productsNotReviewed = products.filter(p => p.updatedAt < sevenDaysAgo).length

  return (
    <DashboardLayout shop={shop}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Alerts */}
        <div className="mb-6 space-y-3">
          {productsWithoutPrice > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Você tem {productsWithoutPrice} {productsWithoutPrice === 1 ? 'produto' : 'produtos'} sem preço.{' '}
                <Link href="/produtos" className="font-medium underline">
                  Revisar agora
                </Link>
              </p>
            </div>
          )}

          {productsWithoutImage > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Você tem {productsWithoutImage} {productsWithoutImage === 1 ? 'produto' : 'produtos'} sem imagem.{' '}
                <Link href="/produtos" className="font-medium underline">
                  Revisar agora
                </Link>
              </p>
            </div>
          )}

          {productsNotReviewed > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                ⚠️ Você tem {productsNotReviewed} {productsNotReviewed === 1 ? 'produto' : 'produtos'} sem revisão há mais de 7 dias.{' '}
                <Link href="/produtos" className="font-medium underline">
                  Revisar agora
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card">
            <div className="text-sm font-medium text-gray-500">Produtos ativos</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{activeProducts}</div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">Cliques nos últimos 7 dias</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{clicksLast7Days}</div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">Itens sem preço</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{productsWithoutPrice}</div>
          </div>

          <div className="card">
            <div className="text-sm font-medium text-gray-500">Itens sem imagem</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{productsWithoutImage}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações rápidas</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/produtos/novo"
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="font-medium text-gray-900">+ Novo produto</h3>
              <p className="mt-1 text-sm text-gray-500">Adicione um produto manualmente</p>
            </Link>

            <Link
              href="/produtos/catalogo"
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="font-medium text-gray-900">Catálogo Apple</h3>
              <p className="mt-1 text-sm text-gray-500">Selecione produtos do catálogo</p>
            </Link>

            <a
              href={`/u/${shop.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h3 className="font-medium text-gray-900">Ver vitrine →</h3>
              <p className="mt-1 text-sm text-gray-500">Acesse sua vitrine pública</p>
            </a>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="mt-8 text-center py-12 card">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Você ainda não tem produtos
            </h3>
            <p className="text-gray-500 mb-6">
              Comece adicionando manualmente ou selecione pelo Catálogo Apple.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/produtos/novo" className="btn-primary">
                + Novo produto
              </Link>
              <Link href="/produtos/catalogo" className="btn-secondary">
                Selecionar do Catálogo Apple
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
