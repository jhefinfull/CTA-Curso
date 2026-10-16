import ListaCursos from "@/components/cursos/ListaCursos";

// A listagem depende inteiramente dos filtros da URL — pré-renderizar não faria sentido.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Todos os cursos",
  description:
    "Todos os cursos do CTA Boa Vista Cursos: técnicos, graduação, pós-graduação, EJA, cursos livres online, presenciais e certificações. Filtre por modalidade e área.",
  alternates: { canonical: "/cursos" },
};

const Page = async ({ searchParams }) => {
  const { categoria, tipo, busca, ordem, pagina } = await searchParams;

  return (
    <ListaCursos
      categoriaAtual={categoria ? decodeURIComponent(categoria) : undefined}
      tipoAtual={tipo}
      busca={busca}
      ordem={ordem || "nome"}
      pagina={pagina}
      descricaoPagina="Tudo o que o CTA oferece, em um só lugar. Use os filtros para encontrar o curso certo para o seu momento."
    />
  );
};

export default Page;
