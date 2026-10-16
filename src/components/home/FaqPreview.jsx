import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import { faqDestaque } from "@/content/faq";
import { linkWhatsapp, site } from "@/content/site";
import styles from "./FaqPreview.module.css";

/**
 * Prévia do FAQ na home. As cinco perguntas que mais chegam no atendimento — quem
 * decide matrícula quase sempre trava numa delas, e responder aqui evita perder a
 * pessoa para o "depois eu vejo".
 */
const FaqPreview = () => {
  const perguntas = faqDestaque();

  return (
    <section className={styles.secao}>
      <div className={`container ${styles.grade}`}>
        <div className={styles.lateral}>
          <span className={styles.olho}>
            <i className="ph-bold ph-question" aria-hidden="true" />
            Dúvidas frequentes
          </span>

          <h2 className={styles.titulo}>Antes de se matricular, provavelmente você vai perguntar isto</h2>

          <p className={styles.chamada}>
            Reunimos as respostas que mais damos no WhatsApp. Se a sua dúvida não estiver aqui,
            é só chamar — tem gente de verdade do outro lado.
          </p>

          <div className={styles.contato}>
            <a href={linkWhatsapp("Olá! Tenho uma dúvida sobre os cursos do CTA.")} target="_blank" rel="noopener noreferrer" className={styles.contatoItem}>
              <span className={styles.contatoIcone}>
                <i className="ph-fill ph-whatsapp-logo" aria-hidden="true" />
              </span>
              <span>
                <strong>WhatsApp</strong>
                <small>{site.whatsappExibicao}</small>
              </span>
            </a>

            <a href={`mailto:${site.email}`} className={styles.contatoItem}>
              <span className={styles.contatoIcone}>
                <i className="ph-fill ph-envelope-simple" aria-hidden="true" />
              </span>
              <span>
                <strong>E-mail</strong>
                <small>{site.email}</small>
              </span>
            </a>
          </div>

          <Button href="/faq" variant="contorno" icone="ph-arrow-right">
            Ver todas as perguntas
          </Button>
        </div>

        <div className={styles.lista}>
          <Accordion itens={perguntas} aberturaInicial={0} />
        </div>
      </div>
    </section>
  );
};

export default FaqPreview;
