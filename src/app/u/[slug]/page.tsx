import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Storefront from '@/components/Storefront'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const shop = await prisma.shop.findUnique({
    where: { slug },
  })

  if (!shop) {
    return {
      title: 'Loja não encontrada',
    }
  }

  return {
    title: `${shop.name} - Vitrine Apple`,
    description: `Confira os produtos Apple disponíveis na ${shop.name}`,
    openGraph: {
      title: shop.name,
      description: `Produtos Apple - ${shop.name}`,
      images: shop.logoUrl ? [shop.logoUrl] : [],
    },
  }
}

export default async function StorefrontPage({ params }: Props) {
  const { slug } = await params

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!shop) {
    notFound()
  }

  return <Storefront shop={shop} products={shop.products} />
}
