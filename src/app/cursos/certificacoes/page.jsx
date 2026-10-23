import PaginaModalidade, { metadadosDaModalidade } from "@/components/cursos/PaginaModalidade";

export const dynamic = "force-dynamic";

export const metadata = metadadosDaModalidade(
  "certificacoes",
  "Segunda graduação, segunda licenciatura, formação pedagógica (R2), certificação por competência e certificação por notório saber."
);

const Page = ({ searchParams }) => (
  <PaginaModalidade
    chave="certificacoes"
    searchParams={searchParams}
    chamada="Para quem já tem formação e quer ampliar a atuação: segunda graduação, segunda licenciatura, formação pedagógica (R2), certificação por competência e certificação por notório saber. Fale com a equipe pelo WhatsApp para saber valores e condições."
  />
);

export default Page;
