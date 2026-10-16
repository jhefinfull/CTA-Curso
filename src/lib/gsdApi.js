/**
 * Cliente server-side da API pública de cursos do AcadGSD (sistema acadêmico do CTA).
 *
 * NUNCA importar isto de um componente "use client": o token identifica a escola e vive
 * só no servidor. Todo consumo acontece em Server Component ou Route Handler.
 *
 * Contrato: docs/api-publica-site.md do repo acadgsdnew (endpoints /info, /cursos,
 * /cursos/{id}). O contrato do v1 é estável — campos novos podem aparecer, os
 * existentes não mudam de nome nem de formato — então ignorar campo desconhecido é
 * seguro e o site nunca deve quebrar por causa de um campo a mais.
 */

const GSD_API_BASE_URL =
  process.env.GSD_API_BASE_URL || "https://cta-cursos.acadgsd.com/api/public/v1";
const GSD_API_TOKEN = process.env.GSD_API_TOKEN;

/**
 * Resposta neutra: a página renderiza o estado vazio em vez de estourar. É o que o site
 * mostra quando a loja ainda não tem curso publicado, quando o token não está
 * configurado e quando a API está fora do ar — três situações diferentes que, para o
 * visitante, precisam ter exatamente o mesmo desfecho: uma tela apresentável.
 */
const VITRINE_VAZIA = {
  success: false,
  instituicao: null,
  total: 0,
  cursos: [],
  facetas: { tipos: [], categorias: [] },
};

// Segundos de cache do Next para as respostas da vitrine. O servidor do AcadGSD já
// guarda a vitrine ~2 min; 5 min aqui mantém o site rápido sem atrasar demais uma
// publicação nova (o pior caso somado fica em ~10 min, como o contrato avisa).
const REVALIDATE_SEGUNDOS = 300;

// Uma falha de rede pontual sem retry congelaria a resposta vazia pelos 300s de
// revalidate — o menu ficaria sem as áreas e a home sem cursos por 5 minutos por causa
// de um timeout de 1 segundo. Vale reservar tentativas.
const TENTATIVAS = 3;

let avisouTokenAusente = false;

/**
 * Última resposta boa de cada chamada, guardada em memória.
 *
 * Para uma escola, "nenhum curso" é o pior desfecho possível de uma falha: o visitante
 * conclui que não há o que comprar e vai embora. Quando a API falha e já tivemos uma
 * resposta boa antes, é muito melhor mostrar a vitrine de 5 minutos atrás do que uma
 * tela vazia. Só cai no estado vazio de verdade quem nunca viu a API responder.
 *
 * Vive no processo: reinício ou instância nova começa sem lastro, e tudo bem — o
 * primeiro acesso refaz a chamada.
 */
const ultimaBoa = new Map();

async function gsdFetch(path, params = {}) {
  if (!GSD_API_TOKEN) {
    if (!avisouTokenAusente) {
      avisouTokenAusente = true;
      console.warn(
        "[gsdApi] GSD_API_TOKEN não configurado — o site vai renderizar os estados vazios. " +
          "Gere o token no painel da escola em Configurações › API do site e coloque em .env.local."
      );
    }
    return null;
  }

  const url = new URL(`${GSD_API_BASE_URL}${path}`);
  for (const [chave, valor] of Object.entries(params)) {
    if (valor !== undefined && valor !== null && valor !== "") {
      url.searchParams.set(chave, String(valor));
    }
  }

  const chave = url.toString();

  // 404 é resposta legítima e definitiva (curso fora da vitrine): não é falha, e servir
  // a última resposta boa aqui faria uma página de curso removido continuar de pé.
  const semLastro = (status) => status === 404;

  for (let tentativa = 1; tentativa <= TENTATIVAS; tentativa += 1) {
    try {
      const resposta = await fetch(chave, {
        headers: { Authorization: `Bearer ${GSD_API_TOKEN}` },
        next: { revalidate: REVALIDATE_SEGUNDOS },
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        ultimaBoa.set(chave, dados);
        return dados;
      }

      // 4xx é resposta definitiva do servidor (token inválido, curso fora da vitrine):
      // repetir não muda nada e só atrasa a página.
      if (resposta.status < 500 || tentativa === TENTATIVAS) {
        console.warn(`[gsdApi] ${path} respondeu ${resposta.status}`);
        return semLastro(resposta.status) ? null : ultimaBoa.get(chave) ?? null;
      }
    } catch (erro) {
      if (tentativa === TENTATIVAS) {
        console.warn(`[gsdApi] falha em ${path} após ${TENTATIVAS} tentativas: ${erro.message}`);
        return ultimaBoa.get(chave) ?? null;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * tentativa));
  }

  return ultimaBoa.get(chave) ?? null;
}

/**
 * Vitrine de cursos com facetas (tipos e áreas, com contagem).
 *
 * As facetas vêm sempre calculadas sobre a vitrine INTEIRA, não sobre o filtro aplicado
 * — é de propósito (serve pra montar o menu de filtros numa chamada só), mas significa
 * que a contagem de área numa rota de tipo fixo não corresponde àquele tipo.
 *
 * @param {{categoria?: string, tipo?: string, busca?: string, promo?: boolean,
 *          assinatura?: boolean, proprio?: boolean, ordem?: string}} params
 */
export async function fetchGsdCursos(params = {}) {
  const dados = await gsdFetch("/cursos", params);
  if (!dados) return VITRINE_VAZIA;

  return {
    ...VITRINE_VAZIA,
    ...dados,
    cursos: Array.isArray(dados.cursos) ? dados.cursos : [],
    facetas: {
      tipos: dados.facetas?.tipos || [],
      categorias: dados.facetas?.categorias || [],
    },
  };
}

/** Detalhe de venda de um curso (grade, planos, pré-requisitos). Null se fora da vitrine. */
export async function fetchGsdCurso(id) {
  const dados = await gsdFetch(`/cursos/${encodeURIComponent(id)}`);
  const curso = dados?.curso ?? dados;
  return curso && curso.id ? curso : null;
}

/** Ping de conexão + branding da escola. Usado no /api/status pra diagnosticar deploy. */
export async function fetchGsdInfo() {
  return gsdFetch("/info");
}

/** Base configurada — exposta só para a rota de diagnóstico, nunca para o browser. */
export function gsdBaseUrl() {
  return GSD_API_BASE_URL;
}

export function gsdTokenConfigurado() {
  return Boolean(GSD_API_TOKEN);
}
