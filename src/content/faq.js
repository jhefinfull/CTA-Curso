/**
 * Perguntas frequentes. Usado em /faq (com busca e abas) e na prévia da home.
 *
 * As respostas descrevem o PROCESSO (como se matricular, como pagar, onde estudar), que é
 * o que a equipe mais repete no WhatsApp. Tudo o que envolve reconhecimento acadêmico
 * fica escrito de forma conservadora de propósito: o documento é sempre emitido pela
 * instituição responsável pelo curso — revise a categoria "certificacao" com a
 * coordenação do CTA antes de mudar a oferta.
 */

export const CATEGORIAS_FAQ = [
  { id: "matricula", label: "Matrícula", icone: "ph-user-plus" },
  { id: "cursos", label: "Cursos e aulas", icone: "ph-books" },
  { id: "pagamento", label: "Pagamento", icone: "ph-credit-card" },
  { id: "certificacao", label: "Certificado", icone: "ph-certificate" },
  { id: "atendimento", label: "Atendimento", icone: "ph-lifebuoy" },
];

export const FAQ = [
  // ─── Matrícula ────────────────────────────────────────────────────────────
  {
    categoria: "matricula",
    pergunta: "Como faço para me matricular em um curso?",
    resposta: [
      "Escolha o curso na página de cursos. Nos cursos da nossa loja, o botão “Matricule-se” leva ao sistema acadêmico do CTA: você informa seus dados, escolhe a forma de pagamento e finaliza.",
      "Nos cursos que ainda não têm matrícula online, como os técnicos semipresenciais e os técnicos e a graduação da Unicorp, o botão abre o WhatsApp do CTA e a equipe conclui a sua inscrição com você. Na Graduação UNIP, a inscrição é feita no site oficial da UNIP.",
    ],
  },
  {
    categoria: "matricula",
    pergunta: "Em quanto tempo o CTA retorna o meu contato?",
    resposta:
      "Em até 24 horas, em dia útil. O atendimento é de segunda a sexta, das 8h às 12h e das 14h às 18h.",
  },
  {
    categoria: "matricula",
    pergunta: "Quais documentos preciso para me matricular?",
    resposta:
      "Depende do curso: para os técnicos e o EJA, os documentos pessoais e o histórico da etapa anterior; para a graduação e a pós, também o diploma ou certificado de conclusão exigido. A equipe informa a lista exata do seu curso na matrícula.",
  },
  // ─── Cursos e aulas ───────────────────────────────────────────────────────
  {
    categoria: "cursos",
    pergunta: "Os cursos são presenciais ou online?",
    resposta: [
      "Temos as duas opções. Os profissionalizantes são presenciais híbridos, com aulas no CTA às terças e quintas; os técnicos semipresenciais combinam aulas no CTA com a plataforma online.",
      "A graduação, a pós-graduação, o EJA, os técnicos regulares e os cursos livres são a distância, pela plataforma.",
    ],
  },
  {
    categoria: "cursos",
    pergunta: "Quais são os horários das aulas presenciais?",
    resposta:
      "As turmas presenciais têm aulas às terças e quintas, em cinco horários: das 8h às 10h, das 10h às 12h, das 14h às 16h, das 16h às 18h e das 19h às 21h. Os técnicos semipresenciais têm encontros à noite.",
  },
  {
    categoria: "cursos",
    pergunta: "Onde fica o CTA?",
    resposta:
      "Na Rua Barão do Rio Branco, 664, Centro, Boa Vista/RR, CEP 69301-130.",
  },
  {
    categoria: "cursos",
    pergunta: "Como acesso a plataforma de estudos?",
    resposta:
      "Pela Área do Aluno, no topo do site. Ela tem três portais: EAD, Presencial e UNICORP — entre no portal do seu curso com o login que você recebeu na matrícula.",
  },
  // ─── Pagamento ────────────────────────────────────────────────────────────
  {
    categoria: "pagamento",
    pergunta: "Quais formas de pagamento vocês aceitam?",
    resposta:
      "PIX, boleto e cartão de crédito. Nos cursos da loja você escolhe a forma de pagamento na própria matrícula; nos presenciais o pagamento é por Pix Automático ou boleto.",
  },
  {
    categoria: "pagamento",
    pergunta: "Quanto custa a inscrição?",
    resposta:
      "Varia conforme o curso. Na maioria dos técnicos, graduações e pós-graduações das parceiras a inscrição é de R$ 99; nos profissionalizantes presenciais, de R$ 150. O valor de cada curso aparece na página dele.",
  },
  // ─── Certificado ──────────────────────────────────────────────────────────
  {
    categoria: "certificacao",
    pergunta: "Quem emite o certificado ou diploma?",
    resposta:
      "A instituição responsável pelo curso: nos cursos das parceiras (UNIP, FAMAR e Unicorp), a própria instituição parceira; nos cursos do CTA, o CTA. A página de cada curso informa quem oferece.",
  },
  {
    categoria: "certificacao",
    pergunta: "O certificado é reconhecido?",
    resposta:
      "Os cursos de graduação, técnico e pós são oferecidos com instituições reconhecidas nacionalmente, que emitem o documento ao final. Os cursos livres e os profissionalizantes dão certificado de conclusão com a carga horária cursada.",
  },
  // ─── Atendimento ──────────────────────────────────────────────────────────
  {
    categoria: "atendimento",
    pergunta: "Como falo com o CTA?",
    resposta:
      "Pelo WhatsApp (95) 98428-7000, pelo telefone (95) 98400-1505 ou pelo e-mail ctaboavista@gmail.com, de segunda a sexta, das 8h às 12h e das 14h às 18h. Se preferir, venha nos visitar no Centro de Boa Vista.",
  },
  {
    categoria: "atendimento",
    pergunta: "Esqueci o acesso da plataforma. O que faço?",
    resposta:
      "Fale com a equipe pelo WhatsApp e diga qual é o seu curso. A gente confere o seu cadastro e reenvia o acesso.",
  },
];

export const FAQ_DESTAQUE = [
  "Como faço para me matricular em um curso?",
  "Os cursos são presenciais ou online?",
  "Quais formas de pagamento vocês aceitam?",
  "Quanto custa a inscrição?",
  "Em quanto tempo o CTA retorna o meu contato?",
];

export function faqDaCategoria(categoria) {
  return FAQ.filter((item) => item.categoria === categoria);
}

export function faqDestaque() {
  return FAQ_DESTAQUE.map((pergunta) => FAQ.find((item) => item.pergunta === pergunta)).filter(
    Boolean
  );
}
