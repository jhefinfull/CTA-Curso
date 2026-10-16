import styles from "./loading.module.css";

/**
 * Tela de transição das listagens de curso, que esperam a API do sistema acadêmico.
 *
 * Fica NESTE segmento de propósito, e não na raiz. Um `loading` na raiz faz o Next
 * transmitir todas as rotas em streaming — e, uma vez que o shell foi enviado com
 * status 200, um `notFound()` mais adiante não consegue mais mudar o status. Era isso
 * que fazia /curso/{id-invalido} e /areas/{slug-invalido} responderem 200 com a cara de
 * 404 (soft 404, que o Google indexa). Aqui não há 404 possível: a listagem sempre
 * existe, no pior caso vazia.
 */
const Carregando = () => (
  <div className={styles.tela} role="status" aria-live="polite">
    <span className={styles.marca}>
      <span className={styles.ponto} />
      <span className={styles.ponto} />
      <span className={styles.ponto} />
      <span className={styles.ponto} />
    </span>
    <p>Carregando…</p>
  </div>
);

export default Carregando;
