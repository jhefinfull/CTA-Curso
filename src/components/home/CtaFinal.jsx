import Button from "@/components/ui/Button";
import { linkWhatsapp, site } from "@/content/site";
import styles from "./CtaFinal.module.css";

const CtaFinal = () => {
  return (
    <section className={styles.secao}>
      <div className="container">
        <div className={styles.caixa}>
          <div className={styles.brilho} aria-hidden="true" />

          <div className={styles.conteudo}>
            <span className={styles.olho}>
              <i className="ph-fill ph-rocket-launch" aria-hidden="true" />
              Vamos começar?
            </span>

            <h2 className={styles.titulo}>
              Estude mais, alcance mais. Conte com o CTA.
            </h2>

            <p className={styles.chamada}>
              Escolha o curso e faça a sua matrícula. Ainda em dúvida sobre qual caminho seguir?
              Fale com a nossa equipe: a gente ajuda você a decidir, sem compromisso.
            </p>

            <div className={styles.acoes}>
              <Button href="/cursos" tamanho="lg" variant="claro" icone="ph-arrow-right">
                Ver todos os cursos
              </Button>
              <Button
                href={linkWhatsapp("Olá! Quero ajuda para escolher um curso do CTA.")}
                tamanho="lg"
                variant="fantasma"
                iconeAntes="ph-whatsapp-logo"
                externo
              >
                Falar com um consultor
              </Button>
            </div>

            <p className={styles.rodape}>
              <i className="ph-bold ph-phone" aria-hidden="true" />
              Prefere ligar? <a href={site.telefoneLink}>{site.telefone}</a> · {site.horario}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaFinal;
