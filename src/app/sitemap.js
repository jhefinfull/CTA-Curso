import { site } from "@/content/site";
import { buscarVitrine } from "@/lib/vitrine";
import { listarAreas } from "@/config/areas";
import { MODALIDADES } from "@/config/tiposCurso";

/**
 * Sitemap com as páginas fixas, as modalidades, as áreas e uma entrada por curso — os da
 * loja (/curso/<id>) e os do CTA com inscrição pelo WhatsApp (/curso-cta/<slug>).
 * Se a API não responder, o sitemap sai sem os cursos da loja em vez de falhar.
 */
export default async function sitemap() {
  const agora = new Date();
  const entrada = (url, prioridade, frequencia) => ({
    url: `${site.urlSite}${url}`,
    lastModified: agora,
    changeFrequency: frequencia,
    priority: prioridade,
  });

  const fixas = [
    entrada("", 1, "daily"),
    entrada("/cursos", 0.9, "daily"),
    ...MODALIDADES.map((m) => entrada(m.rota, 0.9, "weekly")),
    entrada("/areas", 0.8, "weekly"),
    entrada("/quem-somos", 0.7, "monthly"),
    entrada("/faq", 0.7, "monthly"),
    entrada("/contato", 0.7, "monthly"),
    entrada("/politica-privacidade", 0.3, "yearly"),
  ];

  const { cursos, facetas } = await buscarVitrine();
  const areas = listarAreas(facetas.categorias).map((area) => entrada(`/areas/${area.slug}`, 0.75, "weekly"));
  const paginasDeCurso = cursos.map((curso) =>
    entrada(curso.rota || `/curso/${curso.id}`, curso.whatsapp ? 0.7 : 0.6, "weekly")
  );

  return [...fixas, ...areas, ...paginasDeCurso];
}
