import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import FaqBusca from "@/components/faq/FaqBusca";
import { CATEGORIAS_FAQ, FAQ } from "@/content/faq";
import { linkWhatsapp, site } from "@/content/site";
import styles from "./faq.module.css";

export const metadata = {
  title: "Perguntas frequentes",
  description:
    "Tire suas dúvidas sobre matrícula, aulas, pagamento, certificado e atendimento do CTA Boa Vista Cursos. Respostas rápidas para as perguntas que mais recebemos.",
  alternates: { canonical: "/faq" },
};

/** O FAQ inteiro vira dados estruturados — é o tipo de página que o Google adora citar. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.pergunta,
    acceptedAnswer: {
      "@type": "Answer",
      text: Array.isArray(item.resposta) ? item.resposta.join(" ") : item.resposta,
    },
  })),
};

const Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />

      <PageHero
        trilha={[{ label: "FAQ" }]}
        icone="ph-question"
        titulo="Perguntas frequentes"
        chamada={`${FAQ.length} respostas para as dúvidas que mais chegam até nós — matrícula, estudo, pagamento, certificado e suporte.`}
      />

      <section className={styles.secao}>
        <div className="container-estreito">
          <FaqBusca faq={FAQ} categorias={CATEGORIAS_FAQ} />
        </div>
      </section>

      <section className={styles.ajuda}>
        <div className={`container ${styles.ajudaCaixa}`}>
          <div>
            <span className={styles.olho}>
              <i className="ph-bold ph-lifebuoy" aria-hidden="true" />
              Não achou sua resposta?
            </span>
            <h2>Fala com a gente. Tem gente de verdade do outro lado.</h2>
            <p>
              Nosso time responde no WhatsApp durante o horário comercial — e costuma responder
              rápido. Se preferir, mande um e-mail ou use o formulário de contato.
            </p>
          </div>

          <div className={styles.ajudaAcoes}>
            <Button
              href={linkWhatsapp("Olá! Não encontrei minha dúvida no FAQ do site.")}
              variant="verde"
              tamanho="lg"
              iconeAntes="ph-whatsapp-logo"
              externo
            >
              {site.whatsappExibicao}
            </Button>
            <Button href="/contato" variant="fantasma" tamanho="lg" icone="ph-arrow-right">
              Formulário de contato
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
