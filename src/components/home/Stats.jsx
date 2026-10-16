import Counter from "@/components/ui/Counter";
import styles from "./Stats.module.css";

/** Números do CTA. O total de cursos vem da vitrine (loja + cursos do CTA). */
const Stats = ({ totalCursos = 0 }) => {
  const redondo = Math.floor(totalCursos / 10) * 10;
  const itens = [
    ...(redondo >= 20 ? [{ valor: redondo, sufixo: "+", label: "opções de curso", icone: "ph-stack" }] : []),
    { valor: 3, sufixo: "", label: "instituições parceiras", icone: "ph-buildings" },
    { valor: 5, sufixo: "", label: "horários de aula presencial", icone: "ph-clock" },
    { valor: 24, sufixo: " h", label: "para a equipe retornar o seu contato", icone: "ph-chats-circle" },
  ];

  return (
    <section className={styles.secao} aria-label="O CTA em números">
      <div className={`container ${styles.grade}`}>
        {itens.map((stat) => (
          <div key={stat.label} className={styles.item}>
            <span className={styles.icone}>
              <i className={`ph-bold ${stat.icone}`} aria-hidden="true" />
            </span>
            <strong className={styles.valor}>
              <Counter valor={stat.valor} sufixo={stat.sufixo} />
            </strong>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
