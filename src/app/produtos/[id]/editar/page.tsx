import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import ProductForm from '@/components/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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

  const { id } = await params

  const product = await prisma.product.findFirst({
    where: {
      id,
      shopId: shop.id,
    },
  })

  if (!product) {
    redirect('/produtos')
  }

  return (
    <DashboardLayout shop={shop}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar produto</h1>
        <ProductForm product={product} />
      </div>
    </DashboardLayout>
  )
}
