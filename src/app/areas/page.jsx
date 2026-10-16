import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import CursosVazio from "@/components/cursos/CursosVazio";
import { fetchGsdCursos } from "@/lib/gsdApi";
import { listarAreas } from "@/config/areas";
import { site } from "@/content/site";
import styles from "./areas.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Áreas de formação",
  description:
    "Todas as áreas de formação do CTA Boa Vista Cursos: educação, saúde, direito, vendas, gestão, segurança do trabalho e mais. Escolha a sua e veja os cursos disponíveis.",
  alternates: { canonical: "/areas" },
};

const Page = async () => {
  const { facetas, total } = await fetchGsdCursos();
  const areas = listarAreas(facetas.categorias);

  return (
    <>
      <PageHero
        trilha={[{ label: "Áreas" }]}
        icone="ph-squares-four"
        titulo="Áreas de formação"
        chamada={
          areas.length > 0
            ? `${areas.length} áreas e ${total} cursos disponíveis agora. Escolha por onde você quer começar — ou onde já atua e quer se aprofundar.`
            : "Escolha por onde você quer começar — ou onde já atua e quer se aprofundar."
        }
      />

      <section className={styles.secao}>
        <div className="container">
          {areas.length === 0 ? (
            <CursosVazio
              icone="ph-squares-four"
              titulo="Áreas em cadastro"
              mensagem="Estamos publicando os cursos na plataforma. Fale com a nossa equipe para saber quais formações já estão disponíveis."
              acaoPrimaria={{ href: "/cursos", label: "Ver a vitrine" }}
            />
          ) : (
            <>
              <div className={styles.grade}>
                {areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/areas/${area.slug}`}
                    className={`${styles.cartao} ${styles[area.cor]}`}
                  >
                    <span className={styles.icone}>
                      <i className={`ph-bold ${area.icone}`} aria-hidden="true" />
                    </span>

                    <div className={styles.corpo}>
                      <h2 className={styles.nome}>{area.nome}</h2>
                      {area.descricao ? (
                        <p className={styles.descricao}>{area.descricao}</p>
                      ) : (
                        <p className={styles.descricao}>
                          {area.total === 1
                            ? "1 curso disponível nesta área."
                            : `${area.total} cursos disponíveis nesta área.`}
                        </p>
                      )}
                    </div>

                    <span className={styles.rodape}>
                      <span className={styles.total}>
                        {area.total} {area.total === 1 ? "curso" : "cursos"}
                      </span>
                      <span className={styles.link}>
                        Ver <i className="ph-bold ph-arrow-right" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                ))}
              </div>

              <div className={styles.ajuda}>
                <div>
                  <h2>Não sabe qual área combina com você?</h2>
                  <p>
                    Conte para a nossa equipe o que você faz hoje e onde quer chegar. A gente
                    indica o curso mais adequado — sem compromisso e sem enrolação.
                  </p>
                </div>
                <div className={styles.ajudaAcoes}>
                  <Button
                    href={`https://wa.me/${site.whatsapp}`}
                    variant="verde"
                    iconeAntes="ph-whatsapp-logo"
                    externo
                  >
                    Falar com um consultor
                  </Button>
                  <Button href="/cursos" variant="fantasma" icone="ph-arrow-right">
                    Ver a vitrine completa
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
