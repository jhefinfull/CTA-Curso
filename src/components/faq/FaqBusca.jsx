"use client";

import { useMemo, useState } from "react";
import Accordion from "@/components/ui/Accordion";
import { normalizarTexto } from "@/utils/cursoDisplay";
import styles from "./FaqBusca.module.css";

/**
 * FAQ com abas por categoria e busca em texto.
 *
 * A busca ignora a aba de propósito: quem digita "certificado" quer a resposta,
 * não descobrir em qual categoria ela foi arquivada. Enquanto há texto digitado, as
 * abas ficam desabilitadas e o resultado varre o FAQ inteiro.
 */
const FaqBusca = ({ faq = [], categorias = [] }) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState(categorias[0]?.id || null);
  const [busca, setBusca] = useState("");

  const buscando = busca.trim().length > 1;

  const resultados = useMemo(() => {
    if (!buscando) return faq.filter((item) => item.categoria === categoriaAtiva);

    const termo = normalizarTexto(busca).trim();
    return faq.filter((item) => {
      const resposta = Array.isArray(item.resposta) ? item.resposta.join(" ") : item.resposta;
      return normalizarTexto(`${item.pergunta} ${resposta}`).includes(termo);
    });
  }, [faq, categoriaAtiva, busca, buscando]);

  const categoriaAtual = categorias.find((c) => c.id === categoriaAtiva);

  return (
    <div className={styles.bloco}>
      <div className={styles.campo}>
        <i className="ph-bold ph-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar em todas as perguntas…"
          aria-label="Buscar nas perguntas frequentes"
        />
        {busca && (
          <button type="button" onClick={() => setBusca("")} aria-label="Limpar busca">
            <i className="ph-bold ph-x" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className={styles.abas} role="tablist" aria-label="Categorias de perguntas">
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            type="button"
            role="tab"
            aria-selected={!buscando && categoriaAtiva === categoria.id}
            className={`${styles.aba} ${!buscando && categoriaAtiva === categoria.id ? styles.abaAtiva : ""}`}
            onClick={() => {
              setBusca("");
              setCategoriaAtiva(categoria.id);
            }}
            disabled={buscando}
          >
            <i className={`ph-bold ${categoria.icone}`} aria-hidden="true" />
            {categoria.label}
          </button>
        ))}
      </div>

      <div className={styles.resultado}>
        <p className={styles.contador}>
          {buscando ? (
            <>
              <strong>{resultados.length}</strong>{" "}
              {resultados.length === 1 ? "resposta encontrada" : "respostas encontradas"} para “
              {busca.trim()}”
            </>
          ) : (
            <>
              <strong>{resultados.length}</strong> {resultados.length === 1 ? "pergunta" : "perguntas"}{" "}
              em {categoriaAtual?.label?.toLowerCase()}
            </>
          )}
        </p>

        {resultados.length === 0 ? (
          <div className={styles.vazio}>
            <i className="ph-bold ph-smiley-sad" aria-hidden="true" />
            <p>Não achamos nada com esse termo. Tente outra palavra ou fale com a nossa equipe.</p>
          </div>
        ) : (
          /* A key remonta o acordeão quando o filtro muda — sem isso, o item aberto
             continuaria aberto num item que agora é outra pergunta. */
          <Accordion key={buscando ? `busca-${busca}` : categoriaAtiva} itens={resultados} />
        )}
      </div>
    </div>
  );
};

export default FaqBusca;
