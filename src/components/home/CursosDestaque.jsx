import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CursoCard from "@/components/cursos/CursoCard";
import CursosVazio from "@/components/cursos/CursosVazio";
import styles from "./CursosDestaque.module.css";

const LIMITE = 8;

/**
 * Vitrine da home: um pouco de cada modalidade (a seleção vem pronta da página), para o
 * visitante ver logo de cara que o CTA tem do EJA à pós.
 */
const CursosDestaque = ({ cursos = [] }) => {
  const selecao = cursos.slice(0, LIMITE);

  return (
    <section className={styles.secao}>
      <div className="container">
        <SectionHeading
          olho="Em destaque"
          icone="ph-sparkle"
          titulo="Comece por um destes"
          subtitulo="Uma seleção da nossa vitrine. Nos cursos da loja a matrícula é online; nos presenciais, a equipe atende pelo WhatsApp."
        />

        {selecao.length === 0 ? (
          <CursosVazio
            icone="ph-rocket-launch"
            titulo="Nossa vitrine está sendo montada"
            mensagem="Estamos finalizando o cadastro das turmas. Fale com a equipe pelo WhatsApp e a gente te avisa em primeira mão."
            acaoPrimaria={{ href: "/areas", label: "Ver as áreas" }}
            mensagemWhatsapp="Olá! Quero ser avisado quando as turmas do CTA abrirem."
          />
        ) : (
          <>
            <div className={styles.grade}>
              {selecao.map((curso, indice) => (
                <CursoCard
                  key={curso.id}
                  curso={curso}
                  prioridade={indice < 4}
                />
              ))}
            </div>

            <div className={styles.acoes}>
              <Button href="/cursos" tamanho="lg" icone="ph-arrow-right">
                Ver todos os cursos
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CursosDestaque;
