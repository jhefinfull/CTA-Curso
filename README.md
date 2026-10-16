# Site CTA Boa Vista Cursos

Site do **CTA Boa Vista Cursos** (Boa Vista/RR) em **Next.js 15 (App Router)**, no visual do
modelo 1 aprovado pelo cliente ("Navy institucional": azul-marinho #00467A + verde #00A010).

Os cursos vêm de dois lugares e aparecem juntos em todas as listas:

1. **Loja do CTA no sistema acadêmico (AcadGSD)**, pela API pública. O que a escola publica
   na loja aparece no site sozinho, em até ~10 minutos. A página do curso (`/curso/<id>`)
   leva à **matrícula online** do sistema.
2. **Cursos do site antigo (WordPress) que ainda não estão na loja** — presenciais,
   técnicos semipresenciais, Unicorp, UNIP e certificações. Ficam em
   `src/content/cursosCta.json` (texto, valores, horários e imagem trazidos de lá) e têm
   página própria (`/curso-cta/<slug>`) com o botão do **WhatsApp**. Quando a escola
   cadastrar um deles na loja, apague-o do JSON.

A junção dos dois é feita em `src/lib/vitrine.js` (`buscarVitrine`).

---

## Rodando localmente

```bash
npm install
cp .env.example .env.local     # preencha GSD_API_TOKEN
npm run dev                    # http://localhost:3000
```

## Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|---|---|---|
| `GSD_API_BASE_URL` | sim | `https://cta-cursos.acadgsd.com/api/public/v1` |
| `GSD_API_TOKEN` | sim | Token da escola. Painel do CTA → **Configurações › API do site** |
| `CONTATO_WEBHOOK_URL` | não | Destino dos dados do formulário de contato; sem ele, o formulário abre o WhatsApp |

`GSD_API_TOKEN` é **só do servidor**: nunca prefixe com `NEXT_PUBLIC_`.

Diagnóstico depois de publicar: `GET /api/status` mostra se a API respondeu.

## Onde mexer

| Quero mudar… | Arquivo |
|---|---|
| Telefone, WhatsApp, e-mail, endereço, portais da Área do Aluno | `src/content/site.js` |
| Modalidades (menu, home, páginas `/cursos/...`) | `src/config/tiposCurso.js` |
| Cursos que não estão na loja (WhatsApp) | `src/content/cursosCta.json` |
| Perguntas frequentes | `src/content/faq.js` |
| Cores e fontes | `src/app/globals.css` (tokens) |
| Endereços antigos do WordPress que redirecionam | `next.config.js` |

## Publicação

Container no Dokploy, construído a partir da `main` deste repositório. O domínio
(ctabv.com.br) é ligado no Dokploy depois da aprovação do cliente.
