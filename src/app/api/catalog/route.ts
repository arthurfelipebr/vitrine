import { NextResponse } from 'next/server'
import appleCatalog from '@/data/apple_catalog.json'

export async function GET() {
  return NextResponse.json(appleCatalog)
}
