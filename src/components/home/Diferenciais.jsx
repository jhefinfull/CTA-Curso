import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./Diferenciais.module.css";

const ITENS = [
  {
    icone: "ph-map-pin",
    cor: "verde",
    titulo: "No Centro de Boa Vista",
    texto:
      "Atendimento e aulas presenciais na Rua Barão do Rio Branco, 664. Você conversa com quem cuida da sua matrícula.",
  },
  {
    icone: "ph-buildings",
    cor: "azul",
    titulo: "Parceiras reconhecidas",
    texto:
      "Graduação, técnico e pós em parceria com UNIP, FAMAR e Unicorp Faculdades, instituições reconhecidas nacionalmente.",
  },
  {
    icone: "ph-stack",
    cor: "verde",
    titulo: "Do Ensino Médio à especialização",
    texto: "EJA, técnico, graduação, pós e cursos livres no mesmo lugar. Terminou uma etapa, a próxima já está aqui.",
  },
  {
    icone: "ph-calendar-check",
    cor: "azul",
    titulo: "Horário que cabe na rotina",
    texto:
      "Presenciais às terças e quintas, com turmas de manhã, de tarde e à noite. Nos cursos EAD, você estuda quando puder.",
  },
  {
    icone: "ph-credit-card",
    cor: "verde",
    titulo: "Pagamento facilitado",
    texto:
      "PIX, boleto ou cartão, com o valor de cada curso informado antes da matrícula, sem surpresa no fim.",
  },
  {
    icone: "ph-users-three",
    cor: "azul",
    titulo: "Gente para orientar você",
    texto:
      "Do primeiro contato ao certificado, a equipe do CTA acompanha você e tira as dúvidas pelo WhatsApp.",
  },
];

const Diferenciais = () => {
  return (
    <section className={styles.secao}>
      <div className={styles.textura} aria-hidden="true" />

      <div className="container">
        <SectionHeading
          olho="Por que o CTA"
          icone="ph-medal"
          titulo="O que muda quando você estuda com a gente"
          subtitulo="No CTA Boa Vista Cursos a gente não vende só curso: cria pontes entre sonho e realização, com orientação do primeiro contato ao certificado."
          tema="escuro"
        />

        <div className={styles.grade}>
          {ITENS.map((item) => (
            <article key={item.titulo} className={`${styles.cartao} ${styles[item.cor]}`}>
              <span className={styles.icone}>
                <i className={`ph-bold ${item.icone}`} aria-hidden="true" />
              </span>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Diferenciais;
