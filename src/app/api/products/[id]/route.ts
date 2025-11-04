import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  category: z.enum(['iPhone', 'iPad', 'Watch', 'Mac']).optional(),
  name: z.string().min(1, 'Informe o nome do produto').optional(),
  model: z.string().optional(),
  storage: z.string().optional(),
  color: z.string().optional(),
  condition: z.enum(['Lacrado', 'Seminovo', 'Vitrine']).optional(),
  priceCash: z.number().int().positive('Preço à vista deve ser maior que zero').optional(),
  priceCard: z.number().int().positive().optional(),
  deliveryTime: z.string().optional(),
  notes: z.string().max(500, 'Observações muito longas').optional(),
  paymentLink: z.string().url('Link de pagamento inválido').optional().or(z.literal('')),
  imageUrl: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
})

export async function PATCH(
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
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        shopId: shop.id,
      },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const data = productSchema.parse(body)

    // Convert empty strings to null
    const cleanData: any = {}
    Object.entries(data).forEach(([key, value]) => {
      if (value === '') {
        cleanData[key] = null
      } else if (value !== undefined) {
        cleanData[key] = value
      }
    })

    const product = await prisma.product.update({
      where: { id },
      data: cleanData,
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    const existingProduct = await prisma.product.findFirst({
      where: {
        id,
        shopId: shop.id,
      },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    )
  }
}
