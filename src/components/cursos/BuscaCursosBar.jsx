"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./ListaCursos.module.css";

const ORDENS = [
  { valor: "nome", label: "Nome (A–Z)" },
  { valor: "recentes", label: "Mais recentes" },
  { valor: "preco", label: "Menor preço" },
  { valor: "preco-desc", label: "Maior preço" },
];

/**
 * Busca e ordenação. Ambas vivem na URL (não em estado local) para que o resultado seja
 * compartilhável, sobreviva ao botão voltar e possa ser renderizado no servidor.
 *
 * O `useTransition` mantém o campo digitável enquanto o servidor devolve a nova lista —
 * sem ele, cada letra dava a sensação de travar em vitrine grande.
 */
const BuscaCursosBar = ({ buscaInicial = "", ordemInicial = "nome" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState(buscaInicial);
  const [pendente, iniciarTransicao] = useTransition();
  const debounce = useRef(null);

  // A busca pode mudar por fora (limpar filtro, botão voltar) — o campo acompanha.
  useEffect(() => {
    setBusca(buscaInicial);
  }, [buscaInicial]);

  const atualizarUrl = (mudancas) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor) params.set(chave, valor);
      else params.delete(chave);
    }
    // Qualquer mudança de filtro invalida a página atual da paginação.
    params.delete("pagina");

    const query = params.toString();
    iniciarTransicao(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  useEffect(() => {
    if (busca === buscaInicial) return undefined;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => atualizarUrl({ busca }), 420);
    return () => clearTimeout(debounce.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca]);

  return (
    <div className={styles.barraBusca}>
      <div className={styles.campoBusca}>
        <i className="ph-bold ph-magnifying-glass" aria-hidden="true" />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar curso por nome, área ou tema…"
          aria-label="Buscar cursos"
          className={styles.inputBusca}
        />
        {busca && (
          <button
            type="button"
            className={styles.limparBusca}
            onClick={() => setBusca("")}
            aria-label="Limpar busca"
          >
            <i className="ph-bold ph-x" aria-hidden="true" />
          </button>
        )}
        {pendente && <span className={styles.carregando} aria-hidden="true" />}
      </div>

      <label className={styles.campoOrdem}>
        <span className="visually-hidden">Ordenar cursos por</span>
        <i className="ph-bold ph-sort-ascending" aria-hidden="true" />
        <select
          value={ordemInicial}
          onChange={(e) => atualizarUrl({ ordem: e.target.value === "nome" ? "" : e.target.value })}
        >
          {ORDENS.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default BuscaCursosBar;
