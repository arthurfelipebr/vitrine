import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vitrine Apple - Painel para Lojistas',
  description: 'Sistema de vitrine para lojistas Apple',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
