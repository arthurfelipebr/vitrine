import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const shopSchema = z.object({
  name: z.string().min(1, 'Informe o nome da loja'),
  slug: z.string().min(1, 'Informe o slug').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  whatsapp: z.string().optional(),
  logoUrl: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = shopSchema.parse(body)

    // Check if user already has a shop
    const existingShop = await prisma.shop.findFirst({
      where: { ownerId: user.id },
    })

    if (existingShop) {
      // Update existing shop
      const shop = await prisma.shop.update({
        where: { id: existingShop.id },
        data,
      })

      return NextResponse.json(shop)
    }

    // Check if slug is taken
    const slugExists = await prisma.shop.findUnique({
      where: { slug: data.slug },
    })

    if (slugExists) {
      return NextResponse.json(
        { error: 'Este slug já está em uso' },
        { status: 400 }
      )
    }

    // Create new shop
    const shop = await prisma.shop.create({
      data: {
        ...data,
        ownerId: user.id,
      },
    })

    return NextResponse.json(shop)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Erro ao criar/atualizar loja:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar loja' },
      { status: 500 }
    )
  }
}
