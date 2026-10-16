"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Número que conta até o valor quando entra na tela. O valor final já é renderizado no
 * servidor e só depois a animação começa do zero — assim quem tem JS desligado, quem
 * está lendo com leitor de tela e o crawler do Google veem o número certo.
 */
const Counter = ({ valor = 0, sufixo = "", prefixo = "", duracao = 1600 }) => {
  const [exibido, setExibido] = useState(valor);
  const ref = useRef(null);
  const jaAnimou = useRef(false);

  useEffect(() => {
    const alvo = ref.current;
    if (!alvo || jaAnimou.current) return undefined;

    const prefereMenosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefereMenosMovimento) return undefined;

    const observador = new IntersectionObserver(
      (entradas) => {
        const entrou = entradas[0]?.isIntersecting;
        if (!entrou || jaAnimou.current) return;

        jaAnimou.current = true;
        observador.disconnect();

        const inicio = performance.now();
        const passo = (agora) => {
          const progresso = Math.min((agora - inicio) / duracao, 1);
          // easeOutExpo: sobe rápido e desacelera — leitura mais confortável que linear.
          const suave = progresso === 1 ? 1 : 1 - Math.pow(2, -10 * progresso);
          setExibido(Math.round(valor * suave));
          if (progresso < 1) requestAnimationFrame(passo);
        };

        setExibido(0);
        requestAnimationFrame(passo);
      },
      { threshold: 0.4 }
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, [valor, duracao]);

  return (
    <span ref={ref}>
      {prefixo}
      {exibido.toLocaleString("pt-BR")}
      {sufixo}
    </span>
  );
};

export default Counter;
