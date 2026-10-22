import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "livres",
  "Cursos livres online em educação, saúde, direito, vendas, gestão e mais, com matrícula e acesso na hora."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="livres"
    searchParams={searchParams}
    chamada="Cursos 100% online para aprender uma nova competência ou se atualizar na sua área. A matrícula é feita aqui mesmo e o acesso é liberado assim que o pagamento é confirmado."
  />
);

export default Page;
