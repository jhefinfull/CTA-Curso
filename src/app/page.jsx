import Hero from "@/components/home/Hero";
import Modalidades from "@/components/home/Modalidades";
import AreasDestaque from "@/components/home/AreasDestaque";
import CursosDestaque from "@/components/home/CursosDestaque";
import Stats from "@/components/home/Stats";
import Diferenciais from "@/components/home/Diferenciais";
import ComoFunciona from "@/components/home/ComoFunciona";
import Parceiros from "@/components/home/Parceiros";
import FaqPreview from "@/components/home/FaqPreview";
import CtaFinal from "@/components/home/CtaFinal";
import { buscarVitrine, contarPorModalidade } from "@/lib/vitrine";
import { listarAreas } from "@/config/areas";
import { MODALIDADES } from "@/config/tiposCurso";
import { site } from "@/content/site";
import { faqDestaque } from "@/content/faq";

export const metadata = {
  title: `${site.nomeCompleto} — ${site.slogan}`,
  description:
    "Graduação, cursos técnicos, pós-graduação, EJA EAD, cursos livres online e cursos presenciais no Centro de Boa Vista/RR. Parceiras UNIP, FAMAR e Unicorp.",
  alternates: { canonical: "/" },
};

// Quantos cursos de cada modalidade entram no "Comece por um destes" (8 no total).
const MISTURA = [
  ["tecnicos", 2],
  ["graduacao", 1],
  ["presenciais", 2],
  ["eja", 1],
  ["pos", 1],
  ["livres", 1],
];

/** Um pouco de cada modalidade, na ordem da MISTURA; sobra preenchida com o resto. */
function selecionarDestaques(cursos) {
  const escolhidos = [];
  for (const [chave, quantos] of MISTURA) {
    const m = MODALIDADES.find((x) => x.chave === chave);
    escolhidos.push(...cursos.filter((c) => m.tipos.includes(c.tipo) && c.imagemUrl).slice(0, quantos));
  }
  const resto = cursos.filter((c) => !escolhidos.includes(c));
  return [...escolhidos, ...resto].slice(0, 8);
}

/**
 * A home faz UMA chamada à vitrine e distribui o resultado entre as seções. Cada seção
 * pedir os próprios cursos mostraria dados de momentos diferentes na mesma tela.
 */
const Home = async () => {
  const { cursos, facetas, total } = await buscarVitrine();
  const areas = listarAreas(facetas.categorias);
  const totais = contarPorModalidade(MODALIDADES, facetas.tipos);

  const faqEstruturado = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqDestaque().map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: Array.isArray(item.resposta) ? item.resposta.join(" ") : item.resposta,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqEstruturado) }}
      />

      <Hero totalCursos={total} totais={totais} />
      <Modalidades totais={totais} />
      <CursosDestaque cursos={selecionarDestaques(cursos)} />
      <Stats totalCursos={total} />
      <AreasDestaque areas={areas} />
      <Diferenciais />
      <ComoFunciona />
      <Parceiros />
      <FaqPreview />
      <CtaFinal />
    </>
  );
};

export default Home;
