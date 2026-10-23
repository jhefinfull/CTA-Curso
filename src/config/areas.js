/**
 * Áreas do catálogo — vindas da API, não inventadas aqui.
 *
 * A API devolve `facetas.categorias` com o nome e a contagem exatos de cada área da
 * loja. O site monta o menu, as páginas de área, a home, o rodapé e o sitemap a partir
 * DISSO. Quando a escola ativa um curso numa área nova, a área aparece sozinha — sem
 * ninguém tocar em código e sem risco de o site divergir do que está publicado.
 *
 * (A versão anterior deste arquivo tinha seis "trilhas de tecnologia" escritas à mão e
 * uma regra que tentava adivinhar em qual delas cada curso caía. A regra colocou
 * "NR10: Segurança em Instalações Elétricas" dentro de "Cibersegurança". Adivinhar
 * taxonomia é sempre pior do que perguntar para quem sabe — no caso, a própria API.)
 *
 * Este arquivo faz três coisas:
 *   1. transforma o nome da área em slug de URL (e de volta);
 *   2. guarda a curadoria OPCIONAL das áreas — ícone, cor e um texto de apresentação;
 *   3. dá um visual determinístico para toda área que não tem curadoria.
 */

const PALETA = ["azul", "verde", "amarelo", "laranja"];

// Ícones genéricos para áreas ainda sem curadoria. A escolha é determinística (sai do
// nome), então a mesma área tem sempre o mesmo ícone — inclusive entre servidor e
// cliente, o que evita divergência de hidratação.
const ICONES_GENERICOS = [
  "ph-graduation-cap",
  "ph-books",
  "ph-certificate",
  "ph-lightbulb",
  "ph-compass",
  "ph-target",
];

/**
 * Curadoria por área. Tudo aqui é opcional: acrescentar uma entrada melhora a
 * apresentação daquela área, e não acrescentar não quebra nada.
 *
 * A chave é o nome EXATO da área como a escola cadastrou na loja — a comparação
 * ignora acento e caixa, então "Educacao" também casa com "Educação".
 */
export const CURADORIA_AREAS = {
  // ── Saúde ────────────────────────────────────────────────────────────────
  Enfermagem: {
    icone: "ph-first-aid-kit",
    cor: "verde",
    descricao:
      "Atualização e qualificação para quem cuida de gente: técnicas assistenciais, protocolos e a rotina real dos serviços de saúde.",
  },
  Medicina: {
    icone: "ph-stethoscope",
    cor: "verde",
    descricao:
      "Cursos de aprofundamento clínico e de gestão em saúde para profissionais já formados na área.",
  },
  Odontologia: {
    icone: "ph-tooth",
    cor: "azul",
    descricao:
      "Da clínica geral às especializações — formação prática para dentistas que querem ampliar o que oferecem no consultório.",
  },
  Farmácia: {
    icone: "ph-pill",
    cor: "verde",
    descricao:
      "Atenção farmacêutica, manipulação e gestão de farmácia, com o foco em quem atende o paciente todo dia.",
  },
  Fisioterapia: {
    icone: "ph-person-simple-walk",
    cor: "azul",
    descricao:
      "Técnicas, avaliação e reabilitação para fisioterapeutas que querem ampliar o repertório de atendimento.",
  },
  Nutrição: {
    icone: "ph-bowl-food",
    cor: "verde",
    descricao:
      "Nutrição clínica, esportiva e comportamental — para transformar orientação alimentar em resultado de verdade.",
  },
  Biomedicina: {
    icone: "ph-microscope",
    cor: "verde",
    descricao: "Análises, diagnóstico e as áreas de atuação que mais crescem para o biomédico.",
  },
  Veterinária: {
    icone: "ph-paw-print",
    cor: "amarelo",
    descricao:
      "Clínica animal, reprodução e manejo — para quem atende pets, rebanho ou trabalha no agronegócio.",
  },
  Psicologia: {
    icone: "ph-brain",
    cor: "azul",
    descricao:
      "Abordagens terapêuticas, avaliação e prática clínica para psicólogos e profissionais do cuidado.",
  },

  // ── Imagem, estética e bem-estar ─────────────────────────────────────────
  Estética: {
    icone: "ph-sparkle",
    cor: "laranja",
    descricao:
      "Procedimentos estéticos, protocolos e atendimento — formação prática para trabalhar com beleza e bem-estar.",
  },
  Imagem: {
    icone: "ph-user-focus",
    cor: "amarelo",
    descricao:
      "Consultoria de imagem, visagismo e personal branding: a profissão de ajudar as pessoas a se apresentarem como querem ser vistas.",
  },
  Visagismo: {
    icone: "ph-scissors",
    cor: "laranja",
    descricao:
      "Leitura de traços, harmonização e a técnica por trás de um visual que combina com quem o usa.",
  },
  Terapias: {
    icone: "ph-hand-heart",
    cor: "verde",
    descricao:
      "Terapias integrativas e abordagens complementares para quem atende pessoas em processo de mudança.",
  },
  Beleza: { icone: "ph-sparkle", cor: "laranja" },
  Saúde: { icone: "ph-heartbeat", cor: "verde" },

  // ── Gestão, negócios e mercado ───────────────────────────────────────────
  Administração: {
    icone: "ph-briefcase",
    cor: "laranja",
    descricao:
      "Da rotina do escritório à gestão de equipes e processos — a base de quem faz uma operação funcionar.",
  },
  Gestão: { icone: "ph-strategy", cor: "azul" },
  "Recursos Humanos": {
    icone: "ph-users-three",
    cor: "laranja",
    descricao:
      "Recrutamento, gestão de competências e desenvolvimento de pessoas, do processo seletivo ao plano de carreira.",
  },
  Finanças: {
    icone: "ph-chart-line-up",
    cor: "verde",
    descricao:
      "Fluxo de caixa, custos, investimentos e análise financeira aplicados ao dia a dia da empresa.",
  },
  Contabilidade: {
    icone: "ph-calculator",
    cor: "verde",
    descricao:
      "Rotinas contábeis, fiscais e tributárias explicadas na prática de quem trabalha em escritório contábil.",
  },
  Vendas: {
    icone: "ph-handshake",
    cor: "laranja",
    descricao:
      "Técnicas de venda, negociação e atendimento — a competência que abre porta em qualquer setor.",
  },
  Comércio: {
    icone: "ph-storefront",
    cor: "laranja",
    descricao: "Varejo, estoque, atendimento e a operação de quem vive do balcão para fora.",
  },
  Marketing: {
    icone: "ph-megaphone",
    cor: "laranja",
    descricao:
      "Como divulgar, posicionar e vender — do marketing digital ao relacionamento com o cliente.",
  },

  // ── Educação, direito e segurança ────────────────────────────────────────
  Educação: {
    icone: "ph-chalkboard-teacher",
    cor: "azul",
    descricao:
      "Nossa maior área. Formação para quem ensina: educação inclusiva, alfabetização, gestão escolar e as práticas que a sala de aula pede hoje.",
  },
  Direito: {
    icone: "ph-scales",
    cor: "azul",
    descricao:
      "Prática jurídica por ramo do direito, para advogados, estagiários e quem trabalha em escritório.",
  },
  "Segurança no Trabalho": {
    icone: "ph-shield-check",
    cor: "amarelo",
    descricao:
      "Normas regulamentadoras, prevenção de acidentes e as exigências que toda empresa precisa cumprir.",
  },
  Informática: {
    icone: "ph-desktop-tower",
    cor: "azul",
    descricao: "Ferramentas do dia a dia do escritório, da planilha ao computador em rede.",
  },
};

// ── Utilitários ────────────────────────────────────────────────────────────

function semAcento(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function chaveNormalizada(texto) {
  return semAcento(texto).toLowerCase().trim();
}

// Curso próprio da escola que não tem área chega da API com o SUBTIPO no lugar dela
// ("Subsequente", "Integrado", "MBA"…). Isso descreve a forma do curso, não uma área
// de formação — no menu de áreas, "Subsequente · 14 cursos" não diz nada ao visitante.
const SUBTIPOS_DA_API = new Set(
  [
    "Anos Iniciais",
    "Anos Finais",
    "Fundamental",
    "Médio",
    "Integrado",
    "Concomitante",
    "Subsequente",
    "Bacharelado",
    "Licenciatura",
    "Tecnólogo",
    "Especialização",
    "MBA",
    "Mestrado",
    "Doutorado",
    "Vestibular",
    "ENEM",
    "Concurso",
  ].map(chaveNormalizada)
);

// A pós vendida por área ("Pós-Graduação Unicorp em Direito") vem com o próprio nome na
// área. Cada uma virava uma "área" de um curso só no menu, repetindo o nome do curso.
const NOME_DE_POS = /^pos[\s-]*graduacao\b/;

/** A categoria da API é uma área de formação de verdade (e não um subtipo de curso)? */
export function ehAreaDeFormacao(nome) {
  const chave = chaveNormalizada(nome);
  return Boolean(nome) && !SUBTIPOS_DA_API.has(chave) && !NOME_DE_POS.test(chave);
}

/** "Segurança no Trabalho" → "seguranca-no-trabalho" */
export function slugArea(nome) {
  return semAcento(nome)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Índice da curadoria por chave normalizada, montado uma vez.
const CURADORIA_POR_CHAVE = new Map(
  Object.entries(CURADORIA_AREAS).map(([nome, dados]) => [chaveNormalizada(nome), dados])
);

function hashTexto(texto) {
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Dados de apresentação de uma área. Sempre devolve algo utilizável: com curadoria usa
 * o que foi escrito à mão; sem curadoria, ícone e cor saem do próprio nome.
 */
export function dadosDaArea(nome) {
  const curadoria = CURADORIA_POR_CHAVE.get(chaveNormalizada(nome));
  const semente = hashTexto(chaveNormalizada(nome));

  return {
    nome,
    slug: slugArea(nome),
    icone: curadoria?.icone || ICONES_GENERICOS[semente % ICONES_GENERICOS.length],
    cor: curadoria?.cor || PALETA[semente % PALETA.length],
    descricao: curadoria?.descricao || null,
    temCuradoria: Boolean(curadoria),
  };
}

/** Facetas da API → lista pronta para renderizar, ordenada da maior para a menor. */
export function listarAreas(categorias = []) {
  return categorias
    .filter((categoria) => ehAreaDeFormacao(categoria.nome))
    .sort((a, b) => (b.total || 0) - (a.total || 0) || a.nome.localeCompare(b.nome, "pt-BR"))
    .map((categoria) => ({ ...dadosDaArea(categoria.nome), total: categoria.total || 0 }));
}

/**
 * Slug da URL → nome da área como a API escreve.
 *
 * O nome tem que voltar da API, não de uma tabela local: é ele que vai no `?categoria=`
 * da próxima chamada, e o filtro do AcadGSD compara com o nome exato cadastrado.
 */
export function areaPorSlug(slug, categorias = []) {
  const categoria = categorias.find((c) => ehAreaDeFormacao(c.nome) && slugArea(c.nome) === slug);
  if (!categoria) return null;
  return { ...dadosDaArea(categoria.nome), total: categoria.total || 0 };
}

/** Ícone da área, para o card de curso. Área desconhecida cai num genérico. */
export function iconeDaArea(nome) {
  if (!nome) return "ph-graduation-cap";
  return dadosDaArea(nome).icone;
}
