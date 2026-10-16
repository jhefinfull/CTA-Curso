import Link from "next/link";
import Button from "@/components/ui/Button";
import { linkWhatsapp, site } from "@/content/site";
import { MODALIDADES } from "@/config/tiposCurso";
import styles from "./Hero.module.css";

const SELOS = [
  { icone: "ph-buildings", texto: "Parceiras UNIP, FAMAR e Unicorp" },
  { icone: "ph-calendar-check", texto: "Turmas de manhã, tarde e noite" },
  { icone: "ph-users-three", texto: "Atendimento humano, de segunda a sexta" },
];

// As cores do painel são as do CSS do topo; "noite" e "sol" (das modalidades) usam as
// mais próximas que ele tem.
const COR_DO_PAINEL = { verde: "verde", azul: "azul", noite: "azul", sol: "amarelo" };

/**
 * `totais` (cursos por modalidade) e `totalCursos` vêm da vitrine: a loja do sistema
 * mais os cursos do CTA que ainda não estão nela. Modalidade sem curso não aparece, e
 * nenhum número aparece como zero — um zero no primeiro dobrar é pior do que nenhum.
 */
const Hero = ({ totalCursos = 0, totais = {} }) => {
  // "Mais de 270" em vez de "273": número redondo continua verdadeiro enquanto cresce.
  const redondo = Math.floor(totalCursos / 10) * 10;
  const modalidades = MODALIDADES.filter((m) => totais[m.chave] > 0);

  const chamada =
    totalCursos >= 20
      ? `Mais de ${redondo} opções de curso em graduação, técnico, pós, EJA, cursos livres online e presenciais no Centro de Boa Vista, com instituições parceiras reconhecidas nacionalmente.`
      : "Graduação, técnico, pós, EJA, cursos livres online e presenciais no Centro de Boa Vista, com instituições parceiras reconhecidas nacionalmente.";

  return (
    <section className={styles.hero}>
      <div className={styles.malha} aria-hidden="true" />
      <div className={styles.brilhoAzul} aria-hidden="true" />
      <div className={styles.brilhoVerde} aria-hidden="true" />

      <div className={`container ${styles.grade}`}>
        <div className={styles.texto}>
          <span className={styles.olho}>
            <span className={styles.olhoPonto} aria-hidden="true" />
            {site.nomeCompleto} · Roraima
          </span>

          <h1 className={styles.titulo}>
            Do EJA à pós-graduação, seu <span className={styles.destaque}>próximo passo</span>{" "}
            começa aqui.
          </h1>

          <p className={styles.chamada}>{chamada}</p>

          <div className={styles.acoes}>
            <Button href="/cursos" tamanho="lg" variant="laranja" icone="ph-arrow-right">
              Ver cursos
            </Button>
            <Button
              href={linkWhatsapp()}
              externo
              tamanho="lg"
              variant="fantasma"
              iconeAntes="ph-whatsapp-logo"
            >
              Falar no WhatsApp
            </Button>
          </div>

          <ul className={styles.selos}>
            {SELOS.map((selo) => (
              <li key={selo.texto}>
                <i className={`ph-fill ${selo.icone}`} aria-hidden="true" />
                {selo.texto}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual}>
          <div className={styles.painel}>
            <p className={styles.painelTitulo}>Por onde você quer começar?</p>

            <div className={styles.modalidades}>
              {modalidades.map((m) => (
                <Link
                  key={m.chave}
                  href={m.rota}
                  className={`${styles.modalidade} ${styles[COR_DO_PAINEL[m.cor]]}`}
                >
                  <span className={styles.modalidadeIcone}>
                    <i className={`ph-bold ${m.icone}`} aria-hidden="true" />
                  </span>

                  <span className={styles.modalidadeTexto}>
                    <strong>{m.titulo}</strong>
                    <small>{m.resumo}</small>
                  </span>

                  <span className={styles.modalidadeTotal}>{totais[m.chave]}</span>
                  <i className={`ph-bold ph-arrow-right ${styles.modalidadeSeta}`} aria-hidden="true" />
                </Link>
              ))}
            </div>

            <div className={styles.painelRodape}>
              <i className="ph-fill ph-seal-check" aria-hidden="true" />
              <span>Matrícula online nos cursos da loja · atendimento pelo WhatsApp nos presenciais</span>
            </div>
          </div>

          {totalCursos >= 20 && (
            <div className={`${styles.flutuante} ${styles.flutuanteAreas}`}>
              <i className="ph-fill ph-stack" aria-hidden="true" />
              <div>
                <strong>{redondo}+</strong>
                <small>opções de curso</small>
              </div>
            </div>
          )}

          <div className={`${styles.flutuante} ${styles.flutuanteParceiras}`}>
            <i className="ph-fill ph-buildings" aria-hidden="true" />
            <div>
              <strong>3</strong>
              <small>instituições parceiras</small>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rodape}>
        <div className={`container ${styles.rodapeInner}`}>
          <span className={styles.rodapeLabel}>Comece por aqui</span>
          <div className={styles.rodapeLinks}>
            <Link href="/cursos/tecnicos">
              <i className="ph-bold ph-wrench" aria-hidden="true" />
              Cursos técnicos
            </Link>
            <Link href="/cursos/eja">
              <i className="ph-bold ph-student" aria-hidden="true" />
              EJA Ensino Médio
            </Link>
            <Link href="/cursos/presenciais">
              <i className="ph-bold ph-chalkboard-teacher" aria-hidden="true" />
              Presenciais no CTA
            </Link>
            <a href={site.portais.lista[0].url} target="_blank" rel="noopener noreferrer">
              <i className="ph-bold ph-user-circle" aria-hidden="true" />
              Área do Aluno
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
