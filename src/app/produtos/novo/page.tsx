import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import ProductForm from '@/components/ProductForm'

export default async function NewProductPage() {
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

  return (
    <DashboardLayout shop={shop}>
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo produto</h1>
        <ProductForm />
      </div>
    </DashboardLayout>
  )
}
