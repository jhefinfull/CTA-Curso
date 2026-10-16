import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./AreasDestaque.module.css";

const MAX_NA_HOME = 8;

/**
 * As áreas com mais cursos, direto das facetas da API. Não há lista escrita à mão aqui:
 * a home mostra o que a escola realmente publicou, ordenado por tamanho.
 *
 * Com a vitrine vazia a seção some — melhor não ter seção do que ter uma seção vazia
 * dizendo que a escola tem áreas que ninguém consegue clicar.
 */
const AreasDestaque = ({ areas = [] }) => {
  if (areas.length === 0) return null;

  const destaque = areas.slice(0, MAX_NA_HOME);
  const restantes = areas.length - destaque.length;

  return (
    <section className={styles.secao}>
      <div className="container">
        <SectionHeading
          olho="Áreas de formação"
          icone="ph-squares-four"
          titulo="Escolha a área que combina com o seu momento"
          subtitulo="Da qualificação para entrar no mercado à especialização de quem já atua. Todas as áreas com curso publicado agora."
        />

        <div className={styles.grade}>
          {destaque.map((area) => (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className={`${styles.cartao} ${styles[area.cor]}`}
            >
              <span className={styles.icone}>
                <i className={`ph-bold ${area.icone}`} aria-hidden="true" />
              </span>

              <span className={styles.texto}>
                <strong>{area.nome}</strong>
                <small>
                  {area.total} {area.total === 1 ? "curso" : "cursos"}
                </small>
              </span>

              <i className={`ph-bold ph-arrow-right ${styles.seta}`} aria-hidden="true" />
            </Link>
          ))}

          {restantes > 0 && (
            <Link href="/areas" className={`${styles.cartao} ${styles.cartaoTodas}`}>
              <span className={styles.icone}>
                <i className="ph-bold ph-dots-three-outline" aria-hidden="true" />
              </span>
              <span className={styles.texto}>
                <strong>Mais {restantes} áreas</strong>
                <small>ver todas</small>
              </span>
              <i className={`ph-bold ph-arrow-right ${styles.seta}`} aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className={styles.acoes}>
          <Button href="/areas" variant="contorno" icone="ph-arrow-right">
            Ver todas as áreas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AreasDestaque;
