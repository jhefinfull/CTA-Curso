import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./ComoFunciona.module.css";

const PASSOS = [
  {
    numero: "01",
    icone: "ph-magnifying-glass",
    titulo: "Escolha o curso",
    texto:
      "Navegue pelas modalidades ou pela lista completa. Cada curso mostra conteúdo, modalidade e valores antes de você decidir.",
  },
  {
    numero: "02",
    icone: "ph-credit-card",
    titulo: "Faça a matrícula",
    texto:
      "Nos cursos da loja, a matrícula é online, com PIX, boleto ou cartão. Nos presenciais e das parceiras, a equipe atende você pelo WhatsApp.",
  },
  {
    numero: "03",
    icone: "ph-monitor-play",
    titulo: "Comece a estudar",
    texto:
      "Presencial, semipresencial ou EAD: o acesso às aulas fica na Área do Aluno, do celular ao computador.",
  },
  {
    numero: "04",
    icone: "ph-certificate",
    titulo: "Conclua e receba o documento",
    texto:
      "Terminou o curso, você recebe o certificado ou diploma da instituição responsável pela formação.",
  },
];

const ComoFunciona = () => {
  return (
    <section className={styles.secao}>
      <div className="container">
        <SectionHeading
          olho="Como funciona"
          icone="ph-path"
          titulo="Da escolha do curso à conclusão em quatro passos"
          subtitulo="Sem fila e sem burocracia. E, se surgir qualquer dúvida no caminho, a equipe do CTA responde pelo WhatsApp."
        />

        <ol className={styles.passos}>
          {PASSOS.map((passo) => (
            <li key={passo.numero} className={styles.passo}>
              <span className={styles.numero} aria-hidden="true">
                {passo.numero}
              </span>
              <span className={styles.icone}>
                <i className={`ph-bold ${passo.icone}`} aria-hidden="true" />
              </span>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </li>
          ))}
        </ol>

        <div className={styles.acoes}>
          <Button href="/cursos" tamanho="lg" variant="laranja" icone="ph-arrow-right">
            Escolher meu curso
          </Button>
          <Button href="/faq" variant="contorno" tamanho="lg" iconeAntes="ph-question">
            Tirar dúvidas
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ComoFunciona;
