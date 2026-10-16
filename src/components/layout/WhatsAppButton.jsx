"use client";

import { useEffect, useState } from "react";
import { linkWhatsapp } from "@/content/site";
import styles from "./WhatsAppButton.module.css";

/**
 * Botão flutuante de WhatsApp. Só aparece depois de o visitante rolar um pouco: no
 * primeiro dobrar da tela ele competiria com o CTA do hero, e no mobile chega a tapar
 * o botão principal.
 */
const WhatsAppButton = () => {
  const [visivel, setVisivel] = useState(false);
  const [balaoAberto, setBalaoAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 480);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // O balão de convite abre sozinho uma vez, alguns segundos depois de o botão surgir.
  useEffect(() => {
    if (!visivel) return undefined;
    const timer = setTimeout(() => setBalaoAberto(true), 2600);
    return () => clearTimeout(timer);
  }, [visivel]);

  return (
    <div className={`${styles.area} ${visivel ? styles.visivel : ""}`}>
      {balaoAberto && (
        <div className={styles.balao} role="status">
          <button
            type="button"
            className={styles.fechar}
            onClick={() => setBalaoAberto(false)}
            aria-label="Fechar mensagem"
          >
            <i className="ph-bold ph-x" aria-hidden="true" />
          </button>
          <strong>Ficou com dúvida?</strong>
          <span>Fale com a nossa equipe agora — respondemos em minutos.</span>
        </div>
      )}

      <a
        href={linkWhatsapp("Olá! Vim pelo site do CTA e quero saber mais sobre os cursos.")}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.botao}
        aria-label="Falar com o CTA no WhatsApp"
        onClick={() => setBalaoAberto(false)}
      >
        <i className="ph-fill ph-whatsapp-logo" aria-hidden="true" />
        <span className={styles.pulso} aria-hidden="true" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
