import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Loja não encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          A loja que você está procurando não existe.
        </p>
        <Link href="/" className="btn-primary">
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
