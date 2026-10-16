import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "graduacao",
  "Graduação EAD em Boa Vista: bacharelado, licenciatura e tecnólogo com UNIP, FAMAR e Unicorp Faculdades."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="graduacao"
    searchParams={searchParams}
    chamada="Bacharelado, licenciatura e tecnólogo com as instituições parceiras do CTA: UNIP (Polo Boa Vista II), FAMAR e Unicorp Faculdades."
  />
);

export default Page;
