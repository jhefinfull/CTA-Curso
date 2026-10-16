import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "tecnicos",
  "Cursos técnicos de nível médio com FAMAR e Unicorp, com ou sem estágio, e turmas semipresenciais no CTA, no Centro de Boa Vista."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="tecnicos"
    searchParams={searchParams}
    chamada="O diploma de técnico de nível médio com as parceiras FAMAR e Unicorp, com ou sem estágio obrigatório, e turmas semipresenciais no CTA com aulas à noite. Nos cursos da loja a matrícula é online; nos semipresenciais e da Unicorp, a equipe atende pelo WhatsApp."
  />
);

export default Page;
