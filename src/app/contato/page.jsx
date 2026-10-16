import PageHero from "@/components/ui/PageHero";
import FormularioContato from "@/components/contato/FormularioContato";
import { linkWhatsapp, site } from "@/content/site";
import styles from "./contato.module.css";

export const metadata = {
  title: "Fale conosco",
  description:
    "Fale com a equipe do CTA Boa Vista Cursos: dúvidas sobre cursos, matrícula, horários e certificado. WhatsApp, telefone, e-mail, formulário e endereço no Centro de Boa Vista.",
  alternates: { canonical: "/contato" },
};

const CANAIS = [
  {
    icone: "ph-whatsapp-logo",
    cor: "verde",
    titulo: "WhatsApp",
    texto: "O jeito mais rápido de falar com a gente.",
    valor: site.whatsappExibicao,
    href: linkWhatsapp(),
    externo: true,
  },
  {
    icone: "ph-phone",
    cor: "azul",
    titulo: "Telefone",
    texto: site.horario,
    valor: site.telefone,
    href: site.telefoneLink,
  },
  {
    icone: "ph-envelope-simple",
    cor: "laranja",
    titulo: "E-mail",
    texto: "Respondemos em até um dia útil.",
    valor: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icone: "ph-map-pin",
    cor: "amarelo",
    titulo: "Endereço",
    texto: site.endereco.bairro,
    valor: site.endereco.linha,
    href: site.endereco.mapa,
    externo: true,
  },
];

const Page = () => {
  return (
    <>
      <PageHero
        trilha={[{ label: "Contato" }]}
        icone="ph-chats-circle"
        titulo="Fale conosco"
        chamada="Você pode falar com o CTA a qualquer momento. Dúvida sobre curso, matrícula, horário ou certificado: escolha o canal que preferir e a equipe agiliza a sua inscrição."
      />

      <section className={styles.canais}>
        <div className={`container ${styles.canaisGrade}`}>
          {CANAIS.map((canal) => (
            <a
              key={canal.titulo}
              href={canal.href}
              className={`${styles.canal} ${styles[canal.cor]}`}
              target={canal.externo ? "_blank" : undefined}
              rel={canal.externo ? "noopener noreferrer" : undefined}
            >
              <span className={styles.canalIcone}>
                <i className={`ph-bold ${canal.icone}`} aria-hidden="true" />
              </span>
              <strong className={styles.canalTitulo}>{canal.titulo}</strong>
              <span className={styles.canalValor}>{canal.valor}</span>
              <span className={styles.canalTexto}>{canal.texto}</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.formulario}>
        <div className={`container ${styles.formGrade}`}>
          <div className={styles.formTexto}>
            <span className={styles.olho}>
              <i className="ph-bold ph-envelope-open" aria-hidden="true" />
              Formulário
            </span>
            <h2>Prefere escrever?</h2>
            <p>
              Preencha os campos ao lado que a nossa equipe retorna. Se for dúvida sobre um curso
              específico, conte qual — assim já respondemos com valor, carga horária e forma de
              pagamento na primeira mensagem.
            </p>

            <ul className={styles.formLista}>
              <li>
                <i className="ph-fill ph-check-circle" aria-hidden="true" />
                Resposta em até um dia útil
              </li>
              <li>
                <i className="ph-fill ph-check-circle" aria-hidden="true" />
                Sem compromisso de matrícula
              </li>
              <li>
                <i className="ph-fill ph-check-circle" aria-hidden="true" />
                Seus dados servem só para este contato
              </li>
            </ul>

            <div className={styles.portais}>
              <p className={styles.portaisTitulo}>Já é aluno ou professor?</p>
              <a href={site.portais.aluno} target="_blank" rel="noopener noreferrer">
                <i className="ph-bold ph-student" aria-hidden="true" />
                Portal do Aluno
                <i className="ph-bold ph-arrow-up-right" aria-hidden="true" />
              </a>
              <a href={site.portais.professor} target="_blank" rel="noopener noreferrer">
                <i className="ph-bold ph-chalkboard-teacher" aria-hidden="true" />
                Portal do Professor
                <i className="ph-bold ph-arrow-up-right" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.formCartao}>
            <FormularioContato />
          </div>
        </div>
      </section>

      <section className={styles.mapa}>
        <div className="container">
          <div className={styles.mapaCaixa}>
            <div className={styles.mapaTexto}>
              <h2>
                <i className="ph-bold ph-map-pin-area" aria-hidden="true" />
                Onde estamos
              </h2>
              <address>
                {site.endereco.linha}
                <br />
                {site.endereco.bairro}
                <br />
                CEP {site.endereco.cep}
              </address>
              <p className={styles.mapaNota}>
                Atendimento presencial de segunda a sexta, das 8h às 12h e das 14h às 18h.
                As aulas dos cursos presenciais também acontecem aqui.
              </p>
              <a
                href={site.endereco.mapa}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapaBotao}
              >
                <i className="ph-bold ph-navigation-arrow" aria-hidden="true" />
                Abrir no Google Maps
              </a>
            </div>

            <div className={styles.mapaVisual} aria-hidden="true">
              <i className="ph-fill ph-map-trifold" />
              <span>Boa Vista · Roraima</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
