import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "pos",
  "Pós-graduação EAD com FAMAR e Unicorp: especializações Lato Sensu e MBAs em educação, direito, saúde, gestão e tecnologia."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="pos"
    searchParams={searchParams}
    chamada="Especializações Lato Sensu e MBAs a distância com a FAMAR e a Unicorp, em educação, direito, saúde, psicologia, engenharia, gestão e tecnologia."
  />
);

export default Page;
