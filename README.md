# Hotel Booking — Infotera Frontend Challenge

Sistema completo de busca e reserva de hotéis, desenvolvido como solução do desafio técnico frontend da Infotera. A aplicação cobre todos os requisitos básicos e vai além com diversas features avançadas implementadas com foco em qualidade de código, performance e experiência de usuário.

---

## Sumário

- [Stack](#stack)
- [Como rodar](#como-rodar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Páginas e funcionalidades](#páginas-e-funcionalidades)
- [Features avançadas implementadas](#features-avançadas-implementadas)
- [Arquitetura e decisões técnicas](#arquitetura-e-decisões-técnicas)
- [API](#api)
- [Scripts disponíveis](#scripts-disponíveis)

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 15 | App Router, Server Components, API Routes |
| React | 19 | UI com Concurrent Features |
| TypeScript | 5 | Strict mode, zero `any` |
| Tailwind CSS | 4 | Estilização utility-first |
| TanStack Query | 5 | Data fetching, cache e sincronização |
| Zustand | 5 | Estado global (reserva, histórico, perfil) |
| React Hook Form | 7 | Formulários com performance |
| Zod | 4 | Validação de schemas e tipagem |

> Nenhuma biblioteca extra foi instalada além das exigidas pelo desafio. Tudo que poderia ser resolvido com CSS nativo, HTML semântico ou APIs do browser foi resolvido assim.

---

## Como rodar

### Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun

### Instalação

```bash
git clone <repo-url>
cd hotel-booking
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
npm run build
npm run start
```

### Análise de bundle

```bash
ANALYZE=true npm run build
```

Abre o webpack bundle analyzer automaticamente após o build.

### Lint

```bash
npm run lint
```

---

## Estrutura do projeto

```
app/
  page.tsx                          # Home — busca inicial
  layout.tsx                        # Root layout com providers
  providers.tsx                     # QueryClient + i18n + StoreHydrator
  search/page.tsx                   # Listagem de hotéis com filtros
  hotel/[hotelId]/page.tsx          # Detalhe do hotel
  checkout/page.tsx                 # Checkout multi-step
  confirmation/[bookingId]/page.tsx # Confirmação de reserva
  reservas/page.tsx                 # Histórico de reservas
  perfil/page.tsx                   # Perfil do usuário
  api/                              # API Routes (mock backend)
    hotels/route.ts
    hotels/[id]/route.ts
    reviews/route.ts
    suggestions/route.ts

components/
  layout/         # Navbar, LocaleSwitcher
  search/         # SearchForm, Autocomplete, DatePicker, Filters, Sorter
  hotels/         # HotelCard, HotelList, FeaturedHotels, Skeletons
  hotel/          # Gallery, Info, Rooms, Reviews, Breadcrumb, SectionNav
  room/           # RoomCard, RoomDetailModal
  checkout/       # Steps, Summary, PersonalData, Payment, Review
  ui/             # Button, Input, Modal, Carousel, Lightbox, Pagination

hooks/
  use-search-filters.ts             # URL como fonte de verdade para filtros
  queries/                          # TanStack Query hooks (hotels, hotel, reviews, suggestions)

lib/
  api.ts                            # Funções fetch tipadas para os endpoints /api/*
  utils.ts                          # Helpers puros (formatação, cálculos, normalização)
  labels.ts                         # Mapas enum → label
  i18n/                             # Sistema i18n customizado (PT-BR + EN)
  validations/                      # Schemas Zod (busca, checkout)

stores/
  booking-store.ts                  # Reserva em andamento (hotel, quartos, datas, hóspedes)
  history-store.ts                  # Últimas buscas e hotéis visitados (localStorage)
  reservations-store.ts             # Histórico de reservas concluídas (localStorage)
  user-store.ts                     # Perfil do usuário (localStorage)

types/
  mock-db.ts                        # Tipos compartilhados (Hotel, Room, Review, etc.)

mocks/
  db.json                           # Banco de dados mock

scripts/
  lighthouse-audit.mjs              # Script de auditoria de performance
```

---

## Páginas e funcionalidades

### `/` — Home

- Hero com gradiente e SearchForm centralizado
- **Autocomplete** de destinos consumindo `/api/suggestions` com debounce de 300ms, navegação por teclado (↑↓ Enter Esc) e histórico de buscas no foco vazio
- **Seleção de datas** com validações: check-in ≥ hoje, check-out ≥ check-in +1 dia, máximo 30 dias de estadia
- **Seleção de hóspedes** (adultos 1–10, crianças 0–6) e quartos (1–5) via popover
- Formulário com validação por Zod + React Hook Form, erros por campo em tempo real
- **Hotéis em destaque** pré-carregados via Server Component (sem waterfall client-side)
- **Últimas 5 buscas** exibidas abaixo do formulário, persistidas no localStorage

---

### `/search` — Listagem

- Lista de hotéis via `/api/hotels` com grid responsivo (2 ou 3 colunas)
- **Skeleton screens** customizados durante o carregamento
- Estado vazio com mensagem clara e hotéis em destaque como fallback
- **Paginação** com ellipsis e botões prev/next
- `keepPreviousData` — sem flash ao trocar de página
- **URL como fonte de verdade** para todos os filtros — link compartilhável, funciona com back/forward do browser
- Filtros avançados:
  - Faixa de preço (slider duplo customizado em CSS puro)
  - Avaliação mínima (3+ / 4+ / 4.5+)
  - Tipo de propriedade (hotel, pousada, resort)
  - Comodidades (10 opções)
  - Ordenação: relevância, menor preço, maior preço, melhor avaliação, mais popular
- Badge contando filtros ativos
- **Badge de escassez** nos cards ("Apenas N disponíveis!") quando `availableRooms ≤ 3`

---

### `/hotel/[hotelId]` — Detalhe do hotel

- Skeleton de página inteira durante o carregamento
- **Breadcrumb** semântico: Home → Destino → Hotel
- **SectionNav** sticky com links âncora: Sobre, Quartos, Avaliações
- **Galeria de fotos**: grid 1 principal + 4 secundárias (desktop), imagem única (mobile)
- **Lightbox** com navegação por teclado (←→ Esc), swipe touch (threshold 50px), bloqueio de scroll do body e contador de imagens
- Informações completas: endereço com link Google Maps, rating, política de cancelamento com cores semânticas
- **Seleção de múltiplos quartos**: seleção sincronizada com a URL via `roomIds` (debounce 300ms), isola seleção por hotel
- **RoomCard**: capacidade máxima, camas, amenidades, preço por noite, toggle selecionado/disponível com proteção por capacidade de hóspedes
- **Modal de detalhe do quarto** com galeria completa e todas as informações
- **Reviews paginadas** (5/página) em carrossel, sorted por data desc, com avatares e badges "Verificado"
- **Sidebar de resumo**: cálculo de subtotal + taxa, botão "Ir para checkout"
- **ShareButton**: copia URL para clipboard com feedback visual
- Prompt automático para inserir datas caso o usuário acesse o hotel sem parâmetros de data na URL
- Hotéis similares ao fim da página

---

### `/checkout` — Reserva

- Guard de rota: redireciona para `/` se não houver hotel ou quartos selecionados no store
- **Multi-step form** com indicador de progresso visual:
  - **Step 1 — Dados pessoais**: nome completo, email, telefone (com máscara brasileira), CPF (com máscara)
  - **Step 2 — Pagamento simulado**: número do cartão (máscara `#### #### #### ####`), portador, validade (máscara `MM/YY`), CVV
  - **Step 3 — Revisão**: resumo completo de dados pessoais, cartão mascarado (`•••• •••• •••• 1234`) e detalhes da reserva; checkbox de aceite de Termos e Condições (obrigatório) com modal de texto completo
- Auto-preenchimento do formulário com dados salvos do perfil do usuário
- Sidebar sticky com **breakdown de preços**: subtotal + 12% de taxas + total
- Loading de 1.5s simulando chamada de API ao confirmar
- `crypto.randomUUID()` (com fallback) para geração do `bookingId`
- Reserva salva no `reservations-store` após confirmação

---

### `/confirmation/[bookingId]` — Confirmação

- Snapshot do estado da reserva capturado no mount (o store pode ser resetado livremente sem perder o display)
- Número da reserva em box monospace destacado
- Recibo completo: hotel, endereço, datas, quartos, hóspedes, subtotal, taxas, total
- Botão "Nova busca" limpa o store e redireciona para `/`

---

### `/reservas` — Histórico de reservas

- Lista todas as reservas concluídas persistidas no localStorage
- Estado vazio com ícone e link para home
- Cards com hotel, datas, quartos, hóspedes, total e prefixo do ID de reserva

---

### `/perfil` — Perfil do usuário

- Formulário com os mesmos dados e validações do checkout (nome, email, telefone, CPF)
- Máscaras de input em tempo real (sem biblioteca externa)
- Dados persistidos no localStorage e usados para auto-preencher o checkout
- Feedback visual de sucesso (toast inline por 3 segundos)

---

## Features avançadas implementadas

| Feature | Detalhes |
|---|---|
| **i18n customizado (PT-BR + EN)** | Sistema próprio sem biblioteca externa, com interpolação de parâmetros estilo ICU (`{count}`, `{destination}`), pluralização via `Intl.PluralRules`, suporte a Server e Client Components, troca de idioma via cookie com `router.refresh()` |
| **Validação real de CPF** | Algoritmo de verificação de dois dígitos (mod-11) implementado no schema Zod |
| **Algoritmo de Luhn** | Validação real do número de cartão de crédito no schema Zod |
| **Data de validade do cartão** | Verificação de expiração futura (`MM/YY`) |
| **Máscaras de input sem lib** | Telefone, CPF, número e validade do cartão em tempo real via `onChange` + `setValue` do RHF |
| **URL state sync (room selection)** | Seleção de quartos sincronizada com `roomIds` na URL com debounce de 300ms, hidratação no mount e isolamento por hotel |
| **StoreHydrator pattern** | `skipHydration: true` em todos os stores persistidos, rehidratação manual em `useEffect` — elimina mismatches de SSR |
| **Server-prefetch de featured hotels** | Home carrega hotéis no servidor e passa `initialData` ao hook — zero waterfall no client |
| **Snapshot de confirmação** | Reserva capturada em `useState` local ao montar a página, desacoplando exibição do estado global |
| **Dynamic imports estratégicos** | Lightbox, Reviews, RoomDetailModal, SearchParamsModal, FeaturedHotels, RecentSearches — todos importados dinamicamente para reduzir bundle inicial |
| **Scarcity badges** | Badge de escassez em cards e galeria quando `availableRooms ≤ 3` |
| **Bundle analyzer** | `@next/bundle-analyzer` integrado, ativado via `ANALYZE=true` |
| **Lighthouse audit script** | Script em `scripts/lighthouse-audit.mjs` para análise automatizada de performance |
| **Acessibilidade** | `role="dialog" aria-modal`, `aria-label`, `aria-expanded`, `aria-current="step"`, `aria-live`, `<nav><ol>` semânticos para breadcrumb e steps, `alt` em todas as imagens |

---

## Arquitetura e decisões técnicas

### Fonte de verdade por domínio

| Domínio | Onde vive |
|---|---|
| Dados do servidor | TanStack Query |
| Filtros, busca, paginação | URL (searchParams) |
| Reserva em andamento | Zustand (`booking-store`) |
| Histórico e perfil | Zustand persistido (localStorage) |
| Dados de formulário | React Hook Form |
| Valores derivados (preços, noites) | Funções puras em `lib/utils.ts` |

### Server vs Client Components

Server Components são usados onde não há necessidade de interatividade (hero da home, layout, metadados). Client Components são criados apenas onde o uso de hooks ou eventos de browser é necessário. Dynamic imports com `ssr: false` são aplicados em componentes pesados que não precisam de SSR.

### TanStack Query

- `keepPreviousData` em listagem de hotéis e reviews — sem flash ao paginar
- `staleTime: 5min` em sugestões — evita requests redundantes ao digitar
- `gcTime: 10min` no detalhe do hotel — preserva cache ao usar o back do browser
- Query keys estáveis e tipadas, sem strings magic

### Zustand

Cada store tem responsabilidade única. Stores persistidos usam `skipHydration: true` e são rehidratados manualmente via `StoreHydrator` para garantir hidratação consistente com SSR.

### Validações

Todos os schemas Zod são fábricas que recebem uma função `t` de tradução, permitindo mensagens de erro localizadas sem duplicação de lógica. Validações cruzadas (ex: datas) são implementadas como refinamentos Zod.

---

## API

O backend está implementado como **API Routes do Next.js** em `app/api/`, consumindo o arquivo `mocks/db.json` via `lib/mock-db.ts`. Não há servidor externo.

| Endpoint | Descrição |
|---|---|
| `GET /api/suggestions?q=` | Autocomplete de destinos |
| `GET /api/hotels` | Listagem com filtros, ordenação e paginação. Retorna `X-Total-Count` no header |
| `GET /api/hotels/[id]` | Detalhe do hotel com array `rooms` embutido |
| `GET /api/reviews?hotelId=&page=&limit=` | Reviews paginadas, ordenadas por data desc |

### Parâmetros de `/api/hotels`

| Param | Tipo | Descrição |
|---|---|---|
| `destination` | string | Filtro de destino (normalizado) |
| `pricePerNight_gte` | number | Preço mínimo por noite |
| `pricePerNight_lte` | number | Preço máximo por noite |
| `rating_gte` | number | Avaliação mínima |
| `propertyType` | string | Tipo de propriedade (`hotel`, `pousada`, `resort`) |
| `amenities` | string | Comodidades separadas por vírgula |
| `featured` | boolean | Apenas hotéis em destaque |
| `_sort` | string | Campo de ordenação |
| `_order` | `asc` \| `desc` | Direção da ordenação |
| `_page` | number | Página (base 1) |
| `_limit` | number | Itens por página |

---

## Scripts disponíveis

```bash
npm run dev        # Servidor de desenvolvimento com Turbopack
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # ESLint
```

Para analysis de bundle:

```bash
ANALYZE=true npm run build
```
