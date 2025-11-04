import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { id } = await params

    const shop = await prisma.shop.findFirst({
      where: { ownerId: user.id },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Loja não encontrada' },
        { status: 404 }
      )
    }

    // Verify product belongs to user's shop
    const product = await prisma.product.findFirst({
      where: {
        id,
        shopId: shop.id,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Erro ao alternar status do produto:', error)
    return NextResponse.json(
      { error: 'Erro ao alternar status do produto' },
      { status: 500 }
    )
  }
}
