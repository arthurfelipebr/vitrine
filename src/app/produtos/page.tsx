import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import ProductsTable from '@/components/ProductsTable'
import Link from 'next/link'

export default async function ProductsPage() {
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

  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <DashboardLayout shop={shop}>
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <div className="flex gap-3">
            <Link href="/produtos/catalogo" className="btn-secondary">
              Selecionar do Catálogo Apple
            </Link>
            <Link href="/produtos/novo" className="btn-primary">
              + Novo produto
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 card">
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
        ) : (
          <ProductsTable products={products} shopSlug={shop.slug} />
        )}
      </div>
    </DashboardLayout>
  )
}
