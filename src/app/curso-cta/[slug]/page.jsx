import { notFound } from "next/navigation";
import DetalheCursoCta from "@/components/curso/DetalheCursoCta";
import { cursoCtaPorSlug } from "@/lib/vitrine";
import { resumir } from "@/utils/cursoDisplay";
import { site } from "@/content/site";

// O conteúdo do curso é fixo, mas os "outros cursos" do rodapé vêm da loja: a página é
// montada na hora, como as demais páginas de curso.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const curso = cursoCtaPorSlug(slug);
  if (!curso) notFound();

  const descricao = resumir(curso.resumo || `Curso de ${curso.titulo} no ${site.nomeCompleto}.`, 155);
  return {
    title: curso.titulo,
    description: descricao,
    alternates: { canonical: `/curso-cta/${curso.slug}` },
    openGraph: {
      title: `${curso.titulo} | ${site.nome}`,
      description: descricao,
      type: "website",
      url: `${site.urlSite}/curso-cta/${curso.slug}`,
      images: curso.imagemUrl ? [{ url: curso.imagemUrl }] : [{ url: "/imagens/site/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

const Page = async ({ params }) => {
  const { slug } = await params;
  return <DetalheCursoCta slug={slug} />;
};

export default Page;
