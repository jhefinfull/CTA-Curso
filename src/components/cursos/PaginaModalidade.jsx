import PageHero from "@/components/ui/PageHero";
import ListaCursos from "@/components/cursos/ListaCursos";
import { modalidade } from "@/config/tiposCurso";

/** Metadados de uma página de modalidade (título, descrição e endereço canônico). */
export function metadadosDaModalidade(chave, descricao) {
  const m = modalidade(chave);
  return { title: m.titulo, description: descricao, alternates: { canonical: m.rota } };
}

/**
 * Página de uma modalidade (/cursos/tecnicos, /cursos/graduacao...): o cabeçalho com a
 * explicação e a lista de cursos daquela modalidade — loja do sistema + cursos do CTA.
 */
const PaginaModalidade = async ({ chave, chamada, searchParams }) => {
  const m = modalidade(chave);
  const { categoria, busca, ordem, pagina } = await searchParams;

  return (
    <>
      <PageHero
        trilha={[{ label: "Cursos", href: "/cursos" }, { label: m.titulo }]}
        icone={m.icone}
        titulo={m.titulo}
        chamada={chamada}
      />

      <ListaCursos
        tipoFixo={m.tipos}
        basePath={m.rota}
        categoriaAtual={categoria ? decodeURIComponent(categoria) : undefined}
        busca={busca}
        ordem={ordem || "nome"}
        pagina={pagina}
        ocultarCabecalho
      />
    </>
  );
};

export default PaginaModalidade;
