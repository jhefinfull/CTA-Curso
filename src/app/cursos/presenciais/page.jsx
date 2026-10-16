import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "presenciais",
  "Cursos profissionalizantes presenciais no Centro de Boa Vista: informática, idiomas, administração, saúde e tecnologia, às terças e quintas."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="presenciais"
    searchParams={searchParams}
    chamada="Cursos presenciais híbridos no Centro de Boa Vista, com aulas às terças e quintas, de manhã, de tarde ou à noite. Informática, idiomas, administração, saúde e tecnologia. A inscrição é feita com a equipe pelo WhatsApp."
  />
);

export default Page;
