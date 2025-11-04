import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const productSchema = z.object({
  category: z.enum(['iPhone', 'iPad', 'Watch', 'Mac']),
  name: z.string().min(1, 'Informe o nome do produto'),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')

    if (!shopId) {
      return NextResponse.json(
        { error: 'shopId é obrigatório' },
        { status: 400 }
      )
    }

    const products = await prisma.product.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const shop = await prisma.shop.findFirst({
      where: { ownerId: user.id },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Você precisa criar uma loja primeiro' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const data = productSchema.parse(body)

    // Convert empty strings to null
    const cleanData = {
      ...data,
      model: data.model || data.name, // Use name as model if not provided
      paymentLink: data.paymentLink || null,
      imageUrl: data.imageUrl || null,
      priceCash: data.priceCash || null,
      priceCard: data.priceCard || null,
    }

    const product = await prisma.product.create({
      data: {
        ...cleanData,
        shopId: shop.id,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
