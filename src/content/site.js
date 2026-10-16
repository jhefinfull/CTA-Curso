/**
 * Fonte única de verdade dos dados institucionais do CTA Boa Vista Cursos.
 *
 * Tudo veio do site antigo (WordPress, ctabv.com.br). Página nova que precise de um dado
 * institucional importa daqui em vez de digitar de novo.
 */
export const site = {
  nome: "CTA BV",
  nomeCompleto: "CTA Boa Vista Cursos",
  nomeLegal: "CTA Boa Vista Cursos",
  /** Nome fantasia registrado no sistema acadêmico (painel da escola). */
  nomeFantasia: "CTA Cursos",
  cnpj: "14.388.206/0002-26",
  slogan: "Estude mais, alcance mais",
  missao:
    "Levamos educação de qualidade com cursos atualizados, capacitando pessoas e instituições a transformarem suas realidades pelo conhecimento.",

  telefone: "(95) 98400-1505",
  telefoneLink: "tel:+5595984001505",
  // O WhatsApp é o número do botão de conversa do site antigo. O rodapé de lá escrevia
  // "998428-7000" (dígito trocado); o número certo é este.
  whatsapp: "5595984287000",
  whatsappExibicao: "(95) 98428-7000",
  email: "ctaboavista@gmail.com",

  endereco: {
    linha: "Rua Barão do Rio Branco, 664",
    bairro: "Centro — Boa Vista/RR",
    cep: "69301-130",
    mapa: "https://www.google.com/maps/search/?api=1&query=Rua+Bar%C3%A3o+do+Rio+Branco+664+Boa+Vista+RR",
  },

  redes: {
    instagram: "https://www.instagram.com/ctaboavista",
    facebook: "https://www.facebook.com/ctaboavista",
  },

  urlSite: "https://ctabv.com.br",

  /** Portais da Área do Aluno — os mesmos três do site antigo. */
  portais: {
    lista: [
      { nome: "EAD", descricao: "Cursos a distância", url: "https://www.ctaboavista.com.br/metodo/login.php" },
      { nome: "Presencial", descricao: "Cursos no CTA", url: "https://www.ctaeja.com.br/ead/login" },
      { nome: "UNICORP", descricao: "Alunos Unicorp", url: "https://unicorp.loja.srv.br/sga_alunos_login/" },
    ],
    loja: "https://cta-cursos.acadgsd.com/loja",
  },

  horario: "Segunda a sexta, das 8h às 12h e das 14h às 18h",
  horarioCurto: "Seg. a sex., 8h às 12h e 14h às 18h",

  parceiras: [
    { sigla: "UNIP", nome: "Universidade Paulista", resumo: "Graduação no Polo Boa Vista II" },
    { sigla: "FAMAR", nome: "Faculdade Aliança do Maranhão", resumo: "Graduação, técnicos regulares e pós-graduação" },
    { sigla: "Unicorp", nome: "Unicorp Faculdades", resumo: "Tecnólogos, técnicos com e sem estágio e pós-graduação" },
  ],
};

/** Link de WhatsApp já com a mensagem pré-escrita — sempre passar por aqui. */
export function linkWhatsapp(mensagem = "Olá! Vim pelo site e quero saber mais sobre os cursos do CTA.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

/** Mensagem de WhatsApp de interesse num curso específico. */
export function linkWhatsappCurso(titulo) {
  return linkWhatsapp(`Olá! Vim pelo site do CTA e tenho interesse no curso ${titulo}. Pode me passar as informações?`);
}
