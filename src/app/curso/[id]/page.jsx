import { notFound } from "next/navigation";
import DetalheCurso from "@/components/curso/DetalheCurso";
import { fetchGsdCurso } from "@/lib/gsdApi";
import { resumir } from "@/utils/cursoDisplay";
import { site } from "@/content/site";

export const dynamic = "force-dynamic";

/**
 * O título e a descrição vêm do próprio curso — página de curso sem meta específica é
 * a diferença entre aparecer e não aparecer numa busca por "curso de X".
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const curso = await fetchGsdCurso(id);

  // 404 aqui, e não só no componente: `generateMetadata` roda antes de a resposta
  // começar a sair, então é o único lugar em que o status 404 realmente pega. Curso
  // despublicado precisa sair do índice do Google, não virar página de erro com 200.
  if (!curso) notFound();

  const descricao = resumir(
    curso.resumo || curso.sobreOCurso || `Curso de ${curso.titulo} na ${site.nome}.`,
    155
  );

  return {
    title: curso.titulo,
    description: descricao,
    alternates: { canonical: `/curso/${curso.id}` },
    openGraph: {
      title: `${curso.titulo} | ${site.nome}`,
      description: descricao,
      type: "website",
      url: `${site.urlSite}/curso/${curso.id}`,
      // O `openGraph` da página substitui o do layout inteiro — sem este fallback,
      // curso sem capa cadastrada seria compartilhado sem imagem nenhuma.
      images: curso.imagemUrl
        ? [{ url: curso.imagemUrl }]
        : [{ url: "/imagens/site/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

const Page = async ({ params }) => {
  const { id } = await params;
  return <DetalheCurso id={id} />;
};

export default Page;
