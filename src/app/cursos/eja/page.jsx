import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "eja",
  "EJA EAD: conclua o Ensino Médio estudando pela plataforma, com matrícula online no CTA Boa Vista Cursos."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="eja"
    searchParams={searchParams}
    chamada="A Educação de Jovens e Adultos a distância é a chance de concluir o Ensino Médio sem abrir mão do trabalho e da rotina. Você estuda pela plataforma, no celular ou no computador."
  />
);

export default Page;
