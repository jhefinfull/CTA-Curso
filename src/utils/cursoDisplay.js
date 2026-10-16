/**
 * Helpers de exibição compartilhados por tudo que consome a API de cursos do AcadGSD.
 * Regra: nada aqui pode assumir que um campo existe — a API devolve `null` de verdade
 * em imagem, preço, vagas e área.
 */

/**
 * Capa de fallback determinística: mesmo curso, mesmo gradiente, sempre — inclusive
 * entre servidor e cliente. Aleatório aqui causaria mismatch de hidratação.
 * As cores saem da paleta da marca do CTA (azul, verde e o amarelo de destaque) em vez de
 * HSL solto, pra grade de cursos sem foto continuar parecendo o CTA.
 */
const PARES_MARCA = [
  ["#1670B0", "#00467A"],
  ["#00A010", "#00661A"],
  ["#0B2F52", "#031629"],
  ["#F0B400", "#C27C00"],
  ["#00467A", "#00A010"],
  ["#1670B0", "#0B2F52"],
];

function hashTexto(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function gradienteDaMarca(texto = "") {
  const [de, para] = PARES_MARCA[hashTexto(texto) % PARES_MARCA.length];
  return `linear-gradient(135deg, ${de} 0%, ${para} 100%)`;
}

/** Sigla de até 2 letras pra estampar na capa vazia (ex.: "Redes de Computadores" → RC). */
export function iniciaisDoCurso(titulo = "") {
  const palavras = titulo
    .split(/\s+/)
    .filter((p) => p.length > 2 && !/^(de|da|do|das|dos|em|para|com|e)$/i.test(p));
  return (palavras.slice(0, 2).map((p) => p[0]).join("") || titulo.slice(0, 2)).toUpperCase();
}

export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);
}

/**
 * Texto curto de preço pro card. `preco.valor` é sempre "a partir de" (menor preço entre
 * as formas de pagamento aceitas), então o card nunca promete um valor que o checkout
 * pode não repetir.
 */
export function formatarPreco(preco) {
  if (!preco || typeof preco.valor !== "number") return null;
  const sufixo = preco.isAssinatura ? "/mês" : "";
  const prefixo = preco.aPartirDe ? "A partir de " : "";
  return `${prefixo}${formatarMoeda(preco.valor)}${sufixo}`;
}

const FORMA_PAGAMENTO_LABEL = {
  PIX: "PIX",
  BOLETO: "Boleto",
  CARTAO_CREDITO: "Cartão de crédito",
};

export function rotuloFormaPagamento(codigo) {
  return FORMA_PAGAMENTO_LABEL[codigo] || codigo;
}

/** Separa os cursos próprios da escola do catálogo fornecido por parceiros. */
export function separarPorPropria(cursos = []) {
  return {
    proprios: cursos.filter((c) => c.ehProprio),
    catalogo: cursos.filter((c) => !c.ehProprio),
  };
}

// O `?busca=` da API é sensível a acento (buscar "programacao" não acha "Programação"),
// então a busca do site filtra localmente — o visitante não precisa acertar o acento.
export function normalizarTexto(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function filtrarPorBusca(cursos = [], busca) {
  if (!busca) return cursos;
  const termo = normalizarTexto(busca).trim();
  if (!termo) return cursos;

  return cursos.filter((c) => {
    const alvo = normalizarTexto(
      `${c.titulo} ${c.subcategoria || ""} ${c.resumo || ""} ${c.tipoLabel || ""} ${c.instituicao || ""}`
    );
    return termo.split(/\s+/).every((palavra) => alvo.includes(palavra));
  });
}

/** Corta um texto em N caracteres sem partir palavra no meio. */
export function resumir(texto, limite = 140) {
  if (!texto) return "";
  const limpo = texto.replace(/\s+/g, " ").trim();
  if (limpo.length <= limite) return limpo;
  return `${limpo.slice(0, limpo.lastIndexOf(" ", limite))}…`;
}
