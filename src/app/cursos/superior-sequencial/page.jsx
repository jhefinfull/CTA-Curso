import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "sequencial",
  "Curso superior sequencial em Boa Vista: formação de nível superior focada numa área, para quem já concluiu o Ensino Médio."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="sequencial"
    searchParams={searchParams}
    chamada="Curso superior sequencial de formação específica: uma formação de nível superior focada numa área, para quem já concluiu o Ensino Médio."
  />
);

export default Page;
