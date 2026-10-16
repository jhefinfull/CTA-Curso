"use client";

import { useEffect } from "react";
import { linkWhatsapp } from "@/content/site";
import styles from "./status.module.css";

/**
 * Erro em tempo de execução. Fica genérico de propósito: mensagem de erro técnica na
 * tela do visitante não ajuda ninguém e, no pior caso, vaza detalhe de infraestrutura.
 * O detalhe vai para o console (e para o monitoramento, quando houver).
 */
const Erro = ({ error, reset }) => {
  useEffect(() => {
    console.error("[erro]", error);
  }, [error]);

  return (
    <section className={styles.tela}>
      <div className={styles.malha} aria-hidden="true" />

      <div className={`container ${styles.conteudo}`}>
        <span className={styles.icone} aria-hidden="true">
          <i className="ph-bold ph-warning-octagon" />
        </span>

        <h1 className={styles.titulo}>Alguma coisa deu errado</h1>
        <p className={styles.texto}>
          Tivemos um problema para carregar esta página. Normalmente é passageiro — tente de
          novo em alguns instantes. Se continuar, fale com a gente que resolvemos rápido.
        </p>

        <div className={styles.acoes}>
          <button type="button" onClick={reset} className={styles.botaoClaro}>
            <i className="ph-bold ph-arrow-clockwise" aria-hidden="true" />
            Tentar de novo
          </button>

          <a
            href={linkWhatsapp("Olá! Encontrei um erro no site do CTA.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.botaoFantasma}
          >
            <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
            Avisar a equipe
          </a>
        </div>
      </div>
    </section>
  );
};

export default Erro;
