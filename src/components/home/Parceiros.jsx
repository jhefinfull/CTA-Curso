import Button from "@/components/ui/Button";
import { site } from "@/content/site";
import styles from "./Parceiros.module.css";

/** Faixa das instituições parceiras (os cursos de graduação, técnico e pós vêm delas). */
const Parceiros = () => {
  return (
    <section className={styles.secao} id="parceiros">
      <div className={styles.pontos} aria-hidden="true" />

      <div className={`container ${styles.grade}`}>
        <div className={styles.texto}>
          <span className={styles.olho}>
            <i className="ph-bold ph-buildings" aria-hidden="true" />
            Instituições parceiras
          </span>

          <h2 className={styles.titulo}>Graduação, técnico e pós com quem é referência no país</h2>

          <p className={styles.chamada}>
            O CTA trabalha com parcerias estratégicas com instituições reconhecidas nacionalmente.
            Você estuda com a instituição parceira e tem o apoio de quem está perto, aqui em Boa
            Vista.
          </p>

          <ul className={styles.vantagens}>
            {site.parceiras.map((p) => (
              <li key={p.sigla}>
                <i className="ph-fill ph-check-circle" aria-hidden="true" />
                {p.sigla} · {p.nome}
              </li>
            ))}
          </ul>

          <div className={styles.acoes}>
            <Button href="/cursos/graduacao" tamanho="lg" variant="claro" icone="ph-arrow-right">
              Conhecer as graduações
            </Button>
          </div>
        </div>

        <div className={styles.inst}>
          {site.parceiras.map((p) => (
            <div key={p.sigla} className={styles.instItem}>
              <b>{p.sigla}</b>
              <strong>{p.nome}</strong>
              <small>{p.resumo}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Parceiros;
