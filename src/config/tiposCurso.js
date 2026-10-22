/**
 * Modalidades do site do CTA e como elas casam com os códigos de tipo do AcadGSD.
 *
 * A loja do sistema manda o código (`TECNICO`, `FIC_QUALIFICACAO`...). Os cursos que
 * ainda não estão na loja (presenciais, Unicorp, UNIP, certificações) vêm do conteúdo
 * do site antigo e usam os mesmos códigos — mais dois que só existem aqui:
 * `PRESENCIAL` e `CERTIFICACAO`. Amarrar código, rótulo e rota num lugar só evita que
 * um literal solto divirja e uma página apareça vazia.
 */

export const TIPO_TECNICO = "TECNICO";
export const TIPO_GRADUACAO = "GRADUACAO";
export const TIPO_SEQUENCIAL = "SEQUENCIAL";
export const TIPO_POS = "POS_LATO_SENSU";
export const TIPO_FIC = "FIC_QUALIFICACAO";
export const TIPO_EJA = "EJA";
export const TIPO_PRESENCIAL = "PRESENCIAL";
export const TIPO_CERTIFICACAO = "CERTIFICACAO";

/**
 * As modalidades na ordem em que aparecem no site (menu, home, rodapé, filtros).
 * `tipos` = os códigos que a página da modalidade mostra.
 */
export const MODALIDADES = [
  {
    chave: "tecnicos",
    titulo: "Cursos Técnicos",
    menu: "Técnicos",
    rota: "/cursos/tecnicos",
    tipos: [TIPO_TECNICO],
    icone: "ph-wrench",
    cor: "verde",
    resumo: "Diploma de nível médio com FAMAR e Unicorp, e turmas semipresenciais no CTA",
  },
  {
    chave: "graduacao",
    titulo: "Graduação",
    menu: "Graduação",
    rota: "/cursos/graduacao",
    tipos: [TIPO_GRADUACAO],
    icone: "ph-graduation-cap",
    cor: "azul",
    resumo: "Bacharelado, licenciatura e tecnólogo",
  },
  {
    chave: "sequencial",
    titulo: "Superior Sequencial",
    menu: "Superior Sequencial",
    rota: "/cursos/superior-sequencial",
    tipos: [TIPO_SEQUENCIAL],
    icone: "ph-books",
    cor: "noite",
    resumo: "Formação de nível superior focada numa área",
  },
  {
    chave: "pos",
    titulo: "Pós-Graduação",
    menu: "Pós-Graduação",
    rota: "/cursos/pos-graduacao",
    tipos: [TIPO_POS],
    icone: "ph-medal",
    cor: "noite",
    resumo: "Especializações Lato Sensu e MBAs a distância",
  },
  {
    chave: "presenciais",
    titulo: "Presenciais no CTA",
    menu: "Presenciais no CTA",
    rota: "/cursos/presenciais",
    tipos: [TIPO_PRESENCIAL],
    icone: "ph-chalkboard-teacher",
    cor: "sol",
    resumo: "Profissionalizantes no Centro de Boa Vista, às terças e quintas",
  },
  {
    chave: "livres",
    titulo: "Cursos Livres Online",
    menu: "Cursos Livres Online",
    rota: "/cursos/cursos-livres",
    tipos: [TIPO_FIC],
    icone: "ph-laptop",
    cor: "azul",
    resumo: "Qualificação 100% online, com matrícula na hora",
  },
  {
    chave: "eja",
    titulo: "EJA EAD",
    menu: "EJA EAD",
    rota: "/cursos/eja",
    tipos: [TIPO_EJA],
    icone: "ph-student",
    cor: "verde",
    resumo: "Conclua o Ensino Médio estudando pela plataforma",
  },
  {
    chave: "certificacoes",
    titulo: "Certificações",
    menu: "Certificações",
    rota: "/cursos/certificacoes",
    tipos: [TIPO_CERTIFICACAO],
    icone: "ph-certificate",
    cor: "noite",
    resumo: "Segunda graduação, segunda licenciatura, formação pedagógica e notório saber",
  },
];

const MODALIDADE_POR_TIPO = Object.fromEntries(
  MODALIDADES.flatMap((m) => m.tipos.map((t) => [t, m]))
);

export const LABEL_POR_TIPO = {
  [TIPO_TECNICO]: "Curso Técnico",
  [TIPO_GRADUACAO]: "Graduação",
  [TIPO_SEQUENCIAL]: "Superior Sequencial",
  [TIPO_POS]: "Pós-Graduação",
  [TIPO_FIC]: "Curso Livre Online",
  [TIPO_EJA]: "EJA EAD",
  [TIPO_PRESENCIAL]: "Presencial no CTA",
  [TIPO_CERTIFICACAO]: "Certificação",
};

// O endpoint de detalhe (`/cursos/{id}`) devolve só o `tipoLabel`, sem o código — então
// o mesmo nome também precisa ser alcançável a partir do rótulo da API.
const LABEL_POR_LABEL_API = {
  "EJA": LABEL_POR_TIPO[TIPO_EJA],
  "FIC / Qualificação": LABEL_POR_TIPO[TIPO_FIC],
  "Pós (Lato Sensu)": LABEL_POR_TIPO[TIPO_POS],
  "Curso Técnico": LABEL_POR_TIPO[TIPO_TECNICO],
  "Técnico": LABEL_POR_TIPO[TIPO_TECNICO],
  "Graduação": LABEL_POR_TIPO[TIPO_GRADUACAO],
  "Sequencial": LABEL_POR_TIPO[TIPO_SEQUENCIAL],
};

/** Nome do tipo na voz do site, com o label da API como reserva pra um tipo novo. */
export function labelDoTipo(tipo, labelDaApi) {
  return LABEL_POR_TIPO[tipo] || LABEL_POR_LABEL_API[labelDaApi] || labelDaApi || "";
}

/** Modalidade do site a que um código de tipo pertence (ou undefined). */
export function modalidadeDoTipo(codigo) {
  return MODALIDADE_POR_TIPO[codigo];
}

/** Rota da listagem daquele tipo. Tipo sem modalidade cai no filtro genérico. */
export function rotaDoTipo(codigo) {
  return MODALIDADE_POR_TIPO[codigo]?.rota || `/cursos?tipo=${encodeURIComponent(codigo)}`;
}

/** Modalidade pela chave (`tecnicos`, `graduacao`...). */
export function modalidade(chave) {
  return MODALIDADES.find((m) => m.chave === chave);
}
