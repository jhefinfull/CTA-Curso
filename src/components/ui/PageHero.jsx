import Link from "next/link";
import styles from "./PageHero.module.css";

/**
 * Topo padrão das páginas internas: trilha de navegação + título + chamada.
 * Toda página interna usa este componente — é o que garante que /faq, /contato e
 * /quem-somos comecem no mesmo lugar da tela e com a mesma respiração.
 */
const PageHero = ({ trilha = [], titulo, chamada, icone, children, variante = "azul" }) => {
  return (
    <header className={`${styles.hero} ${styles[variante]}`}>
      <div className={styles.malha} aria-hidden="true" />
      <div className={`container ${styles.conteudo}`}>
        {trilha.length > 0 && (
          <nav className={styles.trilha} aria-label="Você está aqui">
            <Link href="/">Início</Link>
            {trilha.map((item) => (
              <span key={item.href || item.label} className={styles.trilhaItem}>
                <i className="ph-bold ph-caret-right" aria-hidden="true" />
                {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
              </span>
            ))}
          </nav>
        )}

        {icone && (
          <span className={styles.icone}>
            <i className={`ph-bold ${icone}`} aria-hidden="true" />
          </span>
        )}

        <h1 className={styles.titulo}>{titulo}</h1>
        {chamada && <p className={styles.chamada}>{chamada}</p>}
        {children && <div className={styles.extra}>{children}</div>}
      </div>
    </header>
  );
};

export default PageHero;
