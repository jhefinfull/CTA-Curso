import styles from "./SectionHeading.module.css";

/**
 * Cabeçalho padrão de seção (olho + título + subtítulo). Existe pra que toda seção do
 * site tenha o mesmo ritmo vertical e a mesma hierarquia tipográfica.
 *
 * `nivel` permite usar h3 numa seção aninhada sem quebrar a ordem de headings — a
 * aparência não muda, só o elemento.
 */
const SectionHeading = ({
  olho,
  icone,
  titulo,
  subtitulo,
  alinhamento = "centro",
  tema = "claro",
  nivel = 2,
  id,
}) => {
  const Titulo = `h${nivel}`;

  return (
    <div
      className={`${styles.bloco} ${styles[alinhamento]} ${tema === "escuro" ? styles.escuro : ""}`}
    >
      {olho && (
        <span className={styles.olho}>
          {icone && <i className={`ph-bold ${icone}`} aria-hidden="true" />}
          {olho}
        </span>
      )}
      <Titulo className={styles.titulo} id={id}>
        {titulo}
      </Titulo>
      {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
    </div>
  );
};

export default SectionHeading;
