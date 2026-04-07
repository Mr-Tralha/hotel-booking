# Performance Playbook — Hotel Booking

Guia de boas práticas de performance para o projeto. Este documento serve como referência para desenvolvedores ao criar ou modificar componentes, páginas e funcionalidades.

---

## 1. Imagens

### Quando usar `priority`

- **Imagens LCP (Largest Contentful Paint):** Toda imagem above the fold candidata a LCP deve ter `priority` no `next/image`.
- **Hero/banner:** Sempre `priority`.
- **Primeiros cards visíveis:** Usar a prop `priority` nos primeiros 3 HotelCards via `priorityCount` no HotelList.
- **Gallery principal:** A imagem principal no HotelGallery já usa `priority`.

### Quando usar lazy

- **Imagens abaixo da dobra:** O padrão do Next.js já é `loading="lazy"`.
- **Thumbnails de galeria:** Lazy por padrão.
- **Imagens em modais/lightbox:** Lazy, carregadas sob demanda.

### Regras de `sizes`

Sempre definir `sizes` que reflita o layout real:

```tsx
// Card em grid responsivo
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// Hero/gallery principal
sizes="(max-width: 640px) 100vw, 50vw"

// Thumbnail pequeno
sizes="64px"
```

### Checklist de imagens

- [ ] Usa `next/image` (nunca `<img>` direto)
- [ ] `sizes` coerente com o layout real do container
- [ ] `priority` apenas em imagens above the fold / LCP
- [ ] Imagens LCP não usam `loading="lazy"`
- [ ] Dimensões previsíveis (`aspect-ratio` ou `width`/`height`)
- [ ] Formato e qualidade adequados ao contexto

---

## 2. Componentes — Client vs. Server

### Regra: Server Component por padrão

Só marcar com `'use client'` se o componente usar:

- `useState`, `useEffect`, `useRef` ou outros hooks React
- Event handlers de browser (onClick, onChange, etc.)
- Browser APIs (`window`, `document`, `navigator`)
- Bibliotecas client-only (ex: Zustand stores)

### Componentes que devem ser Server

- `HotelList` — apenas renderiza condicionalmente, sem hooks
- `HotelCardSkeleton` — puramente visual
- `CheckoutSteps` — puramente visual
- `SectionNav` — links estáticos
- `Breadcrumb` — links estáticos
- `Button` — UI pura

### Componentes que devem ser Client

- `SearchForm` — formulário interativo com hooks
- `DestinationAutocomplete` — debounce, refs, keyboard events
- `Navbar` — menu toggle state
- `HotelGallery` — lightbox state
- `BookingSummary` — store access + router

---

## 3. Skeletons e CLS

### Regra: Skeleton = mesmo layout do conteúdo final

- Skeleton deve ocupar o mesmo espaço que o conteúdo carregado
- Usar `aspect-[16/10]` para imagens
- Manter mesma estrutura de grid/flex
- Reservar espaço para: preço, rating, reviews, botões

### Checklist de CLS

- [ ] Imagens sempre com espaço reservado (aspect-ratio ou dimensões fixas)
- [ ] Skeletons com dimensões idênticas ao conteúdo final
- [ ] Navbar com altura fixa (`h-14`)
- [ ] Menu mobile como overlay (`absolute`), sem empurrar layout
- [ ] Modais/drawers fora do fluxo (`fixed`/`absolute`)
- [ ] Nenhum card "cresce" após hidratação

---

## 4. Code Splitting

### Regra: Componentes não-críticos carregam sob demanda

Usar `next/dynamic` para:

- **Modais:** `ImageLightbox`, `RoomDetailModal`, `SearchParamsModal`
- **Seções abaixo da dobra:** `HotelReviews`
- **Features interativas opcionais:** `ShareButton`

```tsx
import dynamic from 'next/dynamic'

const ImageLightbox = dynamic(
  () => import('@/components/ui/image-lightbox').then((m) => ({ default: m.ImageLightbox })),
  { ssr: false }
)
```

### O que NÃO deve ser code-split

- Conteúdo above the fold (hero, search form, primeiros cards)
- Navegação principal (Navbar)
- Formulários primários (SearchForm, checkout steps ativos)

---

## 5. Fetch e React Query

### Configuração padrão

```tsx
staleTime: 60 * 1000  // 60 segundos
retry: 2
refetchOnWindowFocus: false
```

### Boas práticas

- Chaves de query estáveis (`['hotels', params]`)
- `keepPreviousData` para paginação suave
- `enabled: false` quando parâmetros são inválidos/incompletos
- Evitar refetch desnecessário em navegação
- Usar `placeholderData` quando possível

---

## 6. CSS e Animações

### Regras de animação

- Preferir `transform` e `opacity` (não causam reflow)
- Evitar animar `height`, `width`, `top`, `left`
- Usar `transition-transform` para hover em cards
- Usar `grid-rows-[1fr]/grid-rows-[0fr]` para expand/collapse

### CSS global

- Manter `globals.css` mínimo
- Usar Tailwind utility classes sempre que possível
- Evitar seletores CSS globais pesados

---

## 7. Forced Reflow

### Regra: Nunca ler layout após escrever no DOM

```tsx
// ❌ Ruim — lê layout logo após trigger de mudança
const top = el.getBoundingClientRect().top + window.scrollY
window.scrollTo({ top, behavior: 'smooth' })

// ✅ Bom — adia leitura para o próximo frame
requestAnimationFrame(() => {
  const top = el.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: 'smooth' })
})
```

### Componentes com atenção especial

- Autocomplete (scrollIntoView no activeIndex)
- Carousel (getBoundingClientRect para cálculo de scroll)
- Sticky elements (top offset calculation)

---

## 8. Dependências

### Critério para adicionar nova lib

1. É realmente necessária? Existe solução nativa?
2. Qual o impacto no bundle size?
3. Traz polyfills desnecessários?
4. Está ativamente mantida?

### Libs atuais (justificativa)

| Lib | Motivo | Alternativa nativa |
|-----|--------|-------------------|
| `@tanstack/react-query` | Cache, retry, staleTime | Não há equivalente simples |
| `zustand` | Estado global leve | Context API (mais verboso) |
| `react-hook-form` | Formulários complexos com validação | Formulários nativos (mais código) |
| `zod` | Validação tipada | Validação manual (menos segura) |

---

## 9. Medição e Prevenção de Regressão

### Páginas a medir

1. **Home** (`/`)
2. **Search** (`/search?destination=...`)
3. **Hotel Detail** (`/hotel/1`)
4. **Checkout** (`/checkout`)

### Métricas-chave

| Métrica | Alvo | Ferramenta |
|---------|------|-----------|
| LCP | < 2.5s (bom), < 4.0s (precisa melhorar) | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| FID/INP | < 200ms | Lighthouse |
| JS Transfer | Diminuir progressivamente | DevTools Network |

### Processo

1. Medir antes de cada sprint de mudanças
2. Rodar Lighthouse em modo mobile nas 4 páginas
3. Registrar métricas no commit/PR
4. Comparar antes/depois
5. Rejeitar mudanças que piorem métricas significativamente

### Comando rápido

```bash
# Lighthouse CI (se configurado)
npx lighthouse http://localhost:3000 --view --preset=desktop
npx lighthouse http://localhost:3000 --view --preset=perf --form-factor=mobile
```

---

## 10. Resumo de Alterações Realizadas

### O que foi alterado

| Alteração | Arquivo(s) | Impacto esperado |
|-----------|-----------|-----------------|
| `priority` prop em HotelCard | `hotel-card.tsx`, `hotel-list.tsx` | ⬇️ LCP: imagens above the fold carregam antes |
| `priorityCount` em HotelList | `hotel-list.tsx`, `featured-hotels.tsx`, `search/page.tsx` | ⬇️ LCP: primeiros 3 cards com imagem prioritária |
| Navbar mobile overlay | `navbar.tsx` | ⬇️ CLS: menu não empurra layout |
| Search skeleton melhorado | `search/page.tsx` | ⬇️ CLS: skeleton espelha layout final |
| `use client` removido | `hotel-list.tsx`, `checkout-steps.tsx` | ⬇️ JS: menos hidratação no cliente |
| Dynamic imports | `hotel-gallery.tsx`, `room-list.tsx`, `hotel/[hotelId]/page.tsx` | ⬇️ JS: lightbox/modais carregam sob demanda |
| `requestAnimationFrame` | `search/page.tsx` | ⬇️ Reflow: leitura de layout adiada |
| SectionNav top-14 | `section-nav.tsx` | ⬇️ CLS: não sobrepõe navbar |

### Impacto esperado

- **LCP:** Redução significativa pela descoberta antecipada de imagens acima da dobra
- **CLS:** Redução por navbar overlay, skeleton fiel ao layout e sticky positioning correto
- **JS Bundle:** Menor pela remoção de `use client` desnecessário e code splitting de modais
- **Forced Reflow:** Eliminado no scrollTo da search page

### Possíveis trade-offs

- Dynamic imports adicionam um micro-delay no primeiro clique em lightbox/modal (compensado pelo bundle menor)
- `priority` nos primeiros 3 cards pode aumentar levemente a carga inicial de imagens (mas melhora LCP)

### Próximos pontos de melhoria

1. Adicionar `placeholder="blur"` com blurDataURL em imagens hero para melhorar percepção de carregamento
2. Implementar bundle analyzer para identificar chunks pesados
3. Revisar browserslist para reduzir polyfills/legacy JS
4. Adicionar `staleTime` específico por query para otimizar cache
5. Considerar ISR/SSG para páginas de hotel detail populares
6. Implementar Lighthouse CI no pipeline
