"use client";

import { useId, useState } from "react";
import styles from "./Accordion.module.css";

/**
 * Acordeão controlado, um item aberto por vez. Não usa <details> porque o FAQ precisa
 * fechar o item anterior ao abrir outro — e porque a busca do FAQ remonta a lista, o
 * que faria o <details> nativo perder o estado de aberto.
 */
const Accordion = ({ itens = [], aberturaInicial = null }) => {
  const [aberto, setAberto] = useState(aberturaInicial);
  const idBase = useId();

  if (itens.length === 0) return null;

  return (
    <div className={styles.lista}>
      {itens.map((item, indice) => {
        const estaAberto = aberto === indice;
        const idBotao = `${idBase}-b-${indice}`;
        const idPainel = `${idBase}-p-${indice}`;

        return (
          <div key={item.pergunta || indice} className={`${styles.item} ${estaAberto ? styles.itemAberto : ""}`}>
            <h3 className={styles.cabecalho}>
              <button
                type="button"
                id={idBotao}
                className={styles.botao}
                aria-expanded={estaAberto}
                aria-controls={idPainel}
                onClick={() => setAberto(estaAberto ? null : indice)}
              >
                <span>{item.pergunta}</span>
                <i className="ph-bold ph-plus" aria-hidden="true" />
              </button>
            </h3>

            <div
              id={idPainel}
              role="region"
              aria-labelledby={idBotao}
              className={styles.painel}
              hidden={!estaAberto}
            >
              <div className={styles.painelCorpo}>
                {Array.isArray(item.resposta) ? (
                  item.resposta.map((paragrafo, i) => <p key={i}>{paragrafo}</p>)
                ) : (
                  <p>{item.resposta}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
