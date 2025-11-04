import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.update({
      where: { id },
      data: {
        clicks: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao incrementar cliques:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar clique' },
      { status: 500 }
    )
  }
}
