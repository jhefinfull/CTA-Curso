import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import CursoCard from "@/components/cursos/CursoCard";
import CursosVazio from "@/components/cursos/CursosVazio";
import { fetchGsdCursos } from "@/lib/gsdApi";
import { areaPorSlug, listarAreas } from "@/config/areas";
import { linkWhatsapp } from "@/content/site";
import styles from "./area.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { facetas } = await fetchGsdCursos();
  const area = areaPorSlug(slug, facetas.categorias);

  // O 404 precisa sair DAQUI, não só do componente: `generateMetadata` roda antes de a
  // resposta começar a ser enviada, então é o único ponto em que dá pra devolver status
  // 404 de verdade. Chamando só no corpo da página, o HTML de erro saía com status 200
  // — um soft 404, que o Google indexa como se fosse página boa.
  if (!area) notFound();

  return {
    title: `Cursos de ${area.nome}`,
    description:
      area.descricao ||
      `${area.total} ${area.total === 1 ? "curso" : "cursos"} de ${area.nome} no CTA Boa Vista Cursos, com matrícula online.`,
    alternates: { canonical: `/areas/${area.slug}` },
  };
}

const Page = async ({ params }) => {
  const { slug } = await params;

  // Uma chamada só traz as facetas (para resolver o slug) e a vitrine inteira; filtrar
  // localmente evita uma segunda ida à API e mantém o cache com uma entrada só.
  const { cursos, facetas } = await fetchGsdCursos({ ordem: "nome" });
  const area = areaPorSlug(slug, facetas.categorias);

  // Área que não existe na vitrine é 404 de verdade: pode ter sido despublicada, e uma
  // página de área vazia sem aviso é pior do que assumir que o link morreu.
  if (!area) notFound();

  const daArea = cursos.filter((c) => c.subcategoria === area.nome);
  const outras = listarAreas(facetas.categorias)
    .filter((a) => a.slug !== area.slug)
    .slice(0, 6);

  return (
    <>
      <PageHero
        trilha={[{ label: "Áreas", href: "/areas" }, { label: area.nome }]}
        icone={area.icone}
        titulo={`Cursos de ${area.nome}`}
        chamada={
          area.descricao ||
          `${daArea.length} ${daArea.length === 1 ? "curso disponível" : "cursos disponíveis"} nesta área, 100% EAD e com certificado ao concluir.`
        }
        variante={area.cor === "verde" ? "verde" : area.cor === "azul" ? "azul" : "laranja"}
      />

      <section className={`${styles.secao} ${styles[area.cor]}`}>
        <div className="container">
          <div className={styles.topo}>
            <h2>
              {daArea.length} {daArea.length === 1 ? "curso" : "cursos"} em {area.nome}
            </h2>
            <Link href="/cursos" className={styles.verTudo}>
              Ver todas as áreas
              <i className="ph-bold ph-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          {daArea.length === 0 ? (
            <CursosVazio
              icone={area.icone}
              titulo={`Turmas de ${area.nome} em breve`}
              mensagem="Ainda não há curso publicado nesta área. Deixe seu contato pelo WhatsApp que avisamos assim que a turma abrir."
              acaoPrimaria={{ href: "/cursos", label: "Ver todos os cursos" }}
              mensagemWhatsapp={`Olá! Quero ser avisado quando abrirem cursos de ${area.nome}.`}
            />
          ) : (
            <div className={styles.grade}>
              {daArea.map((curso, i) => (
                <CursoCard
                  key={curso.id}
                  curso={curso}
                  destaque={curso.ehProprio}
                  prioridade={i < 4}
                />
              ))}
            </div>
          )}

          <div className={styles.duvida}>
            <i className="ph-fill ph-chat-circle-dots" aria-hidden="true" />
            <div>
              <h2>Quer ajuda para escolher dentro de {area.nome}?</h2>
              <p>
                Nossa equipe conhece cada curso e indica o que faz sentido para o seu momento —
                sem compromisso.
              </p>
            </div>
            <a
              href={linkWhatsapp(`Olá! Quero ajuda para escolher um curso de ${area.nome}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.duvidaBotao}
            >
              <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
              Falar no WhatsApp
            </a>
          </div>

          {outras.length > 0 && (
            <div className={styles.outras}>
              <h2 className={styles.outrasTitulo}>Outras áreas</h2>
              <div className={styles.outrasGrade}>
                {outras.map((outra) => (
                  <Link
                    key={outra.slug}
                    href={`/areas/${outra.slug}`}
                    className={`${styles.outraCartao} ${styles[outra.cor]}`}
                  >
                    <span className={styles.outraIcone}>
                      <i className={`ph-bold ${outra.icone}`} aria-hidden="true" />
                    </span>
                    <span className={styles.outraTexto}>
                      <strong>{outra.nome}</strong>
                      <small>
                        {outra.total} {outra.total === 1 ? "curso" : "cursos"}
                      </small>
                    </span>
                    <i className={`ph-bold ph-arrow-right ${styles.outraSeta}`} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
