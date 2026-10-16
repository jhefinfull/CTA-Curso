/**
 * Vitrine do site = cursos da loja do AcadGSD (API) + cursos do CTA que ainda não estão
 * na loja (conteúdo trazido do site antigo, em content/cursosCta.json).
 *
 * Os da loja levam à matrícula online do sistema. Os do site antigo levam a uma página
 * própria (/curso-cta/<slug>) com o botão do WhatsApp — quando a escola cadastrar um
 * deles na loja, basta tirá-lo do JSON e o da loja passa a aparecer no lugar.
 *
 * Tudo o que lista curso no site passa por aqui, para a contagem do menu, da home e das
 * páginas de modalidade bater sempre.
 */
import { fetchGsdCursos } from "@/lib/gsdApi";
import dadosCta from "@/content/cursosCta.json";

/** Cursos do site antigo no formato dos cursos da API (os campos que o site usa). */
export const CURSOS_CTA = dadosCta.cursos.map((c) => ({
  id: `cta-${c.slug}`,
  slug: c.slug,
  titulo: c.titulo,
  chamada: null,
  resumo: c.resumo,
  imagemUrl: c.imagem,
  tipo: c.tipo,
  tipoLabel: c.rotulo,
  subcategoria: null,
  secao: null,
  ehProprio: false,
  cargaHoraria: c.cargaHoraria || 0,
  preco: null,
  precoTexto: c.inscricao ? `Inscrição ${c.inscricao.replace(",00", "")}` : null,
  rotulo: c.rotulo,
  instituicao: c.instituicao,
  modalidadeTexto: c.modalidade,
  duracao: c.duracao,
  pagamento: c.pagamento,
  conteudoHtml: c.conteudoHtml,
  whatsapp: true,
  rota: `/curso-cta/${c.slug}`,
}));

/** Slugs de curso do WordPress que já existem na loja → página do site novo. */
export const WP_PARA_LOJA = dadosCta.redirecionarParaLoja;

export function cursoCtaPorSlug(slug) {
  return CURSOS_CTA.find((c) => c.slug === slug) || null;
}

function mesmaArea(area, alvo) {
  return (area || "").trim().toLowerCase() === (alvo || "").trim().toLowerCase();
}

function ordenar(cursos, ordem) {
  const lista = [...cursos];
  if (ordem === "preco" || ordem === "preco-desc") {
    // Curso sem preço (os do CTA, que são "consulte pelo WhatsApp") vai sempre para o fim.
    const v = (c) => (typeof c.preco?.valor === "number" ? c.preco.valor : null);
    lista.sort((a, b) => {
      const va = v(a), vb = v(b);
      if (va === null || vb === null) return (va === null) - (vb === null);
      return ordem === "preco" ? va - vb : vb - va;
    });
    return lista;
  }
  if (ordem === "recentes") return lista; // a loja já manda na ordem; os do CTA ficam no fim
  return lista.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));
}

function somarTipos(tiposApi, extras) {
  const mapa = new Map(tiposApi.map((t) => [t.codigo, { ...t }]));
  for (const c of extras) {
    const atual = mapa.get(c.tipo) || { codigo: c.tipo, label: c.tipoLabel, total: 0 };
    atual.total += 1;
    mapa.set(c.tipo, atual);
  }
  return [...mapa.values()];
}

/**
 * Mesma assinatura e mesmo formato de resposta de fetchGsdCursos, com os cursos do CTA
 * somados. `tipos` (lista) tem precedência sobre `tipo` (um só).
 *
 * @param {{categoria?: string, tipo?: string, tipos?: string[], ordem?: string}} params
 */
export async function buscarVitrine({ categoria, tipo, tipos, ordem = "nome" } = {}) {
  const filtroTipos = tipos?.length ? tipos : tipo ? [tipo] : null;
  // Uma chamada só à loja (a mesma URL é reaproveitada pelo cache do Next em todo o site).
  const loja = await fetchGsdCursos({ ordem: ordem === "recentes" ? "recentes" : undefined });

  const daLoja = loja.cursos.filter(
    (c) => (!filtroTipos || filtroTipos.includes(c.tipo)) && (!categoria || mesmaArea(c.subcategoria, categoria))
  );
  const doCta = CURSOS_CTA.filter((c) => (!filtroTipos || filtroTipos.includes(c.tipo)) && !categoria);

  return {
    ...loja,
    cursos: ordenar([...daLoja, ...doCta], ordem),
    total: loja.cursos.length + CURSOS_CTA.length,
    facetas: {
      tipos: somarTipos(loja.facetas.tipos, CURSOS_CTA),
      categorias: loja.facetas.categorias,
    },
  };
}

/** Quantos cursos cada modalidade do site tem (para menu, home e rodapé). */
export function contarPorModalidade(modalidades, tiposComTotal) {
  const porCodigo = Object.fromEntries((tiposComTotal || []).map((t) => [t.codigo, t.total]));
  return Object.fromEntries(
    modalidades.map((m) => [m.chave, m.tipos.reduce((s, t) => s + (porCodigo[t] || 0), 0)])
  );
}
