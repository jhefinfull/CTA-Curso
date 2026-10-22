/**
 * Vitrine do site = cursos da loja do AcadGSD (API) + cursos do CTA que ainda não estão
 * na loja (conteúdo trazido do site antigo, em content/cursosCta.json).
 *
 * Os da loja levam à matrícula online do sistema. Os do site antigo levam a uma página
 * própria (/curso-cta/<slug>) com o botão do WhatsApp — quando a escola cadastrar um
 * deles na loja, basta tirá-lo do JSON e o da loja passa a aparecer no lugar. O curso do
 * JSON com `idLoja` sai sozinho assim que aquele curso da loja é publicado; a pós sai
 * também quando a loja publica uma pós com o mesmo nome.
 *
 * Tudo o que lista curso no site passa por aqui, para a contagem do menu, da home e das
 * páginas de modalidade bater sempre.
 */
import { fetchGsdCursos } from "@/lib/gsdApi";
import { LABEL_POR_TIPO, TIPO_POS, TIPO_PRESENCIAL } from "@/config/tiposCurso";
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
  // Inscrição feita no site da própria instituição (UNIP), em vez do WhatsApp do CTA.
  inscricaoUrl: c.inscricaoUrl || null,
  whatsapp: true,
  rota: `/curso-cta/${c.slug}`,
  idLoja: c.idLoja || null,
}));

/** Slugs de curso do WordPress que já existem na loja → página do site novo. */
export const WP_PARA_LOJA = dadosCta.redirecionarParaLoja;

export function cursoCtaPorSlug(slug) {
  return CURSOS_CTA.find((c) => c.slug === slug) || null;
}

// Cursos da loja que são o mesmo de um presencial do site antigo (`idLoja` no JSON). A
// ligação é pelo id e não pelo nome: a escola cadastrou vários com outra grafia
// ("Englesh", "Andraide", "Mover Maker"), e casar pelo nome deixava o curso duas vezes.
const IDS_LOJA_PRESENCIAIS = new Set(
  dadosCta.cursos.filter((c) => c.tipo === TIPO_PRESENCIAL && c.idLoja).map((c) => c.idLoja)
);

function normalizar(texto) {
  return (texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
}

/**
 * O curso da loja é presencial no CTA quando a escola pôs "Presenciais no CTA" (ou só
 * "Presencial") na "Seção no site", ou quando ele é o de um presencial do site antigo.
 * A loja manda esses cursos como FIC, que no site é "Cursos Livres Online". A palavra
 * inteira evita que uma seção "Semipresencial" caia aqui.
 */
export function ehPresencialDaLoja(curso) {
  return /\bpresencia(l|is)\b/.test(normalizar(curso.secao)) || IDS_LOJA_PRESENCIAIS.has(curso.id);
}

/** Curso da loja com o tipo que ele tem no site. */
export function cursoDaLojaNoSite(curso) {
  return ehPresencialDaLoja(curso)
    ? { ...curso, tipo: TIPO_PRESENCIAL, tipoLabel: LABEL_POR_TIPO[TIPO_PRESENCIAL] }
    : curso;
}

// Título sem acento, caixa nem pontuação: "Pós Graduação" e "Pós-Graduação" são o mesmo.
function chaveDoTitulo(titulo) {
  return normalizar(titulo).replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Id do curso da loja que tomou o lugar deste curso do site antigo, ou null.
 *
 * Pelo `idLoja` do JSON e, na pós, também pelo nome: a pós é vendida por área
 * ("Pós-Graduação Unicorp em Direito") e a escola cadastra na loja com o mesmo nome do site
 * antigo, então cada área sai sozinha quando é publicada, sem mexer no JSON. Nos
 * presenciais o nome não serve (ver IDS_LOJA_PRESENCIAIS).
 */
function idDaLojaNoLugar(cursoCta, cursosLoja) {
  if (cursoCta.idLoja) return cursosLoja.some((c) => c.id === cursoCta.idLoja) ? cursoCta.idLoja : null;
  if (cursoCta.tipo !== TIPO_POS) return null;
  const chave = chaveDoTitulo(cursoCta.titulo);
  return cursosLoja.find((c) => c.tipo === TIPO_POS && chaveDoTitulo(c.titulo) === chave)?.id || null;
}

/**
 * Id do curso da loja que já tomou o lugar deste curso do site antigo, ou null. A página
 * antiga redireciona para ele, levando junto os links do WordPress que caem nela.
 */
export async function cursoDaLojaNoLugar(cursoCta) {
  if (!cursoCta) return null;
  const loja = await fetchGsdCursos();
  return idDaLojaNoLugar(cursoCta, loja.cursos);
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

// Contado sobre a vitrine do site, e não somado à faceta da API: a API conta o
// presencial da loja como FIC e não sabe que o curso do JSON que ele substitui saiu.
function contarTipos(tiposApi, cursos) {
  const rotulos = new Map(tiposApi.map((t) => [t.codigo, t.label]));
  const mapa = new Map();
  for (const c of cursos) {
    const atual = mapa.get(c.tipo) || { codigo: c.tipo, label: rotulos.get(c.tipo) || c.tipoLabel, total: 0 };
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

  const lojaNoSite = loja.cursos.map(cursoDaLojaNoSite);
  const ctaNoSite = CURSOS_CTA.filter((c) => !idDaLojaNoLugar(c, loja.cursos));

  const daLoja = lojaNoSite.filter(
    (c) => (!filtroTipos || filtroTipos.includes(c.tipo)) && (!categoria || mesmaArea(c.subcategoria, categoria))
  );
  const doCta = ctaNoSite.filter((c) => (!filtroTipos || filtroTipos.includes(c.tipo)) && !categoria);

  return {
    ...loja,
    cursos: ordenar([...daLoja, ...doCta], ordem),
    total: lojaNoSite.length + ctaNoSite.length,
    facetas: {
      tipos: contarTipos(loja.facetas.tipos, [...lojaNoSite, ...ctaNoSite]),
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
