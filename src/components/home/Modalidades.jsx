import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { MODALIDADES } from "@/config/tiposCurso";
import styles from "./Modalidades.module.css";

// Texto de apresentação de cada modalidade na home (a chave é a de config/tiposCurso).
const TEXTOS = {
  tecnicos: {
    chamada:
      "Diploma de técnico de nível médio com as parceiras FAMAR e Unicorp, com ou sem estágio, e turmas semipresenciais no CTA.",
    itens: ["Matrícula online nos técnicos da loja", "Conclusão em 6 a 8 meses", "Turmas semipresenciais à noite no CTA"],
  },
  graduacao: {
    chamada:
      "Bacharelado, licenciatura e tecnólogo com UNIP, FAMAR e Unicorp Faculdades, além do curso superior sequencial.",
    itens: ["Pedagogia, Administração, Música e mais", "Tecnólogos a partir de 1 ano e meio", "Mensalidade que cabe no mês"],
  },
  pos: {
    chamada:
      "Especialização Lato Sensu a distância com a FAMAR e a Unicorp, em educação, direito, saúde, gestão e tecnologia.",
    itens: ["Duração de 4 a 8 meses", "Certificado de especialista", "Estudo 100% online"],
  },
  presenciais: {
    chamada:
      "Qualificação presencial híbrida no Centro de Boa Vista: informática, idiomas, administração, saúde e tecnologia.",
    itens: ["Aulas às terças e quintas", "Turmas de manhã, tarde e noite", "Inscrição de R$ 150 e parcelas de R$ 200"],
  },
  livres: {
    chamada: "Cursos de 80 horas, 100% online, em educação, saúde, direito, vendas, gestão e muito mais.",
    itens: ["Matrícula e acesso na hora", "Estude de onde estiver", "Certificado ao concluir"],
  },
  eja: {
    chamada: "Educação de Jovens e Adultos a distância, para concluir o Ensino Médio estudando pela plataforma.",
    itens: ["Matrícula online", "Estudo no seu ritmo", "Conclusão do Ensino Médio"],
  },
  certificacoes: {
    chamada:
      "Segunda graduação, segunda licenciatura, formação pedagógica (R2), pedagogia para graduados e notório saber.",
    itens: ["Para quem já tem formação", "Cursos a distância", "Atendimento pelo WhatsApp"],
  },
};

const COR = { verde: "verde", azul: "azul", noite: "azul", sol: "amarelo" };
const NUMERAL = ["Nenhum", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito"];

/**
 * `totais` = cursos por modalidade (loja + cursos do CTA). Só aparece a modalidade que
 * tem curso: cartão de modalidade vazia levaria a uma página vazia.
 */
const Modalidades = ({ totais = {} }) => {
  const lista = MODALIDADES.filter((m) => totais[m.chave] > 0);

  return (
    <section className={styles.secao}>
      <div className="container">
        <SectionHeading
          olho="Modalidades"
          icone="ph-stack"
          titulo={`${NUMERAL[lista.length] || lista.length} caminhos, do Ensino Médio à especialização`}
          subtitulo="Escolha pelo momento em que você está: concluir os estudos, conquistar uma profissão técnica, entrar na faculdade, se especializar ou fazer um curso rápido."
        />

        <div className={styles.grade}>
          {lista.map((m) => {
            const total = totais[m.chave];
            const texto = TEXTOS[m.chave];

            return (
              <Link key={m.chave} href={m.rota} className={`${styles.cartao} ${styles[COR[m.cor]]}`}>
                <div className={styles.cabecalho}>
                  <span className={styles.icone}>
                    <i className={`ph-bold ${m.icone}`} aria-hidden="true" />
                  </span>
                  <span className={styles.total}>
                    {total} {total === 1 ? "curso" : "cursos"}
                  </span>
                </div>

                <h3 className={styles.titulo}>{m.titulo}</h3>
                <p className={styles.chamada}>{texto?.chamada || m.resumo}</p>

                {texto && (
                  <ul className={styles.itens}>
                    {texto.itens.map((item) => (
                      <li key={item}>
                        <i className="ph-fill ph-check-circle" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <span className={styles.link}>
                  Conhecer <i className="ph-bold ph-arrow-right" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Modalidades;
