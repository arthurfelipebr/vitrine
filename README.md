# 🍏 Vitrine Apple - Painel para Lojistas

Sistema completo de vitrine online para lojistas de produtos Apple. Transforme seu catálogo de JPG em uma vitrine profissional com busca, filtros e integração com WhatsApp/pagamento.

## 🚀 Funcionalidades

### Para o Lojista (Painel Admin)
- ✅ Autenticação local (e-mail + senha)
- ✅ Criar e gerenciar loja (nome, slug, WhatsApp, logo)
- ✅ Adicionar produtos do **Catálogo Apple 2020+** ou manualmente
- ✅ Definir preços (à vista/cartão), condição, prazo, link de pagamento
- ✅ Ativar/desativar produtos com 1 clique
- ✅ Duplicar produtos para criar variações
- ✅ Dashboard com métricas e alertas:
  - Produtos sem preço
  - Produtos sem imagem
  - Produtos sem revisão há 7+ dias
  - Total de cliques

### Para o Cliente Final (Vitrine Pública)
- ✅ Vitrine limpa e responsiva em `/u/[slug]`
- ✅ Busca por modelo
- ✅ Filtros por categoria, capacidade, cor, condição e disponibilidade
- ✅ Cards de produtos com todas as informações
- ✅ Botão "Pagar agora" (se tiver link) ou "Falar no WhatsApp"
- ✅ Mensagem pré-formatada no WhatsApp com dados do produto
- ✅ Contador de cliques por produto

## 🛠️ Stack Tecnológica

- **Runtime**: Bun
- **Framework**: Next.js 14 (App Router)
- **Database**: Prisma + SQLite
- **Linguagem**: TypeScript
- **Estilo**: Tailwind CSS
- **Validação**: Zod
- **Autenticação**: Cookies + bcryptjs

## 📦 Instalação

### Pré-requisitos
- [Bun](https://bun.sh) instalado

### Passos

1. **Clone o repositório**
```bash
git clone <url-do-repo>
cd vitrine
```

2. **Instale as dependências**
```bash
bun install
```

3. **Configure o banco de dados**
```bash
# Gera o Prisma Client e cria o banco SQLite
bun run db:push
```

4. **Inicie o servidor de desenvolvimento**
```bash
bun run dev
```

5. **Acesse a aplicação**
- Painel: http://localhost:3000
- Crie sua conta e comece a adicionar produtos!

## 📖 Como Usar

### 1. Criar Conta e Loja
1. Acesse `/registro` e crie sua conta
2. Você será redirecionado para o onboarding
3. Preencha os dados da sua loja (nome, slug, WhatsApp)

### 2. Adicionar Produtos

#### Opção A: Do Catálogo Apple
1. Vá em "Produtos" > "Selecionar do Catálogo Apple"
2. Escolha categoria → ano → modelo → capacidade → cor
3. Clique em "Adicionar produto"
4. Edite o produto para adicionar preço e outras informações

#### Opção B: Manual
1. Vá em "Produtos" > "+ Novo produto"
2. Preencha todos os campos
3. Clique em "Salvar"

### 3. Gerenciar Produtos
- **Editar**: Altere preço, condição, prazo, etc.
- **Duplicar**: Crie variações rapidamente (ex: mesma modelo, cores diferentes)
- **Ativar/Desativar**: Controle o que aparece na vitrine
- **Copiar link**: Compartilhe produto específico

### 4. Compartilhar Vitrine
Sua vitrine estará disponível em: `https://seusite.com/u/[seu-slug]`

## 🗂️ Estrutura do Projeto

```
vitrine/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── dev.db                 # Banco SQLite (gerado)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # APIs REST
│   │   ├── dashboard/        # Painel admin
│   │   ├── produtos/         # CRUD de produtos
│   │   ├── login/            # Autenticação
│   │   ├── registro/         # Registro
│   │   ├── onboarding/       # Criar loja
│   │   └── u/[slug]/         # Vitrine pública
│   ├── components/           # Componentes React
│   ├── data/                 # Catálogo Apple (JSON)
│   └── lib/                  # Utilitários (Prisma, Auth)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Catálogo Apple Incluído

O sistema vem com um catálogo pré-carregado de produtos Apple 2020+:

- **iPhone**: 12, 13, 14, 15, 16 (incluindo Pro/Max)
- **iPad**: Air (4ª e 5ª gen), Pro (M1/M2/M4)
- **Apple Watch**: Series 6 a 10, Ultra 1 e 2, SE
- **Mac**: MacBook Air/Pro (M1-M4), iMac 24"

Cada produto inclui todas as variações de armazenamento e cores oficiais.

## 💾 Banco de Dados

### Modelos

- **User**: Usuários do sistema
- **Shop**: Lojas (1 por usuário)
- **Product**: Produtos da loja

### Comandos úteis

```bash
# Visualizar banco de dados
bun run db:studio

# Resetar banco (cuidado!)
rm prisma/dev.db
bun run db:push
```

## 🔒 Segurança

- Senhas hasheadas com bcryptjs
- Validação de entrada com Zod
- Proteção de rotas com middleware
- Sanitização de URLs
- Sessões HTTP-only cookies

## 📱 Responsividade

Todo o sistema é totalmente responsivo:
- Desktop: Grid de 3 colunas
- Tablet: Grid de 2 colunas
- Mobile: Grid de 1 coluna

## 🌐 Deploy

### Vercel (Recomendado para Next.js)

1. Faça push do código para GitHub
2. Conecte ao Vercel
3. Configure variáveis de ambiente
4. Deploy!

**Nota**: Para produção, considere usar PostgreSQL ao invés de SQLite.

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou PR.

## 📄 Licença

MIT

## 🙏 Créditos

Sistema desenvolvido para facilitar a vida de lojistas Apple que querem sair do "catálogo em JPG" e ter uma vitrine profissional.

---

**Dúvidas?** Abra uma issue no GitHub.