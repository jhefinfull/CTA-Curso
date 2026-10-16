import Link from "next/link";
import Button from "@/components/ui/Button";
import styles from "./status.module.css";

export const metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

// Atalhos fixos de propósito: a página de erro nunca deve depender de a API
// responder — se ela cair junto, o visitante fica sem saída nenhuma.
const ATALHOS = [
  { label: "Todos os cursos", href: "/cursos", icone: "ph-books" },
  { label: "Áreas de formação", href: "/areas", icone: "ph-squares-four" },
  { label: "Pós-Graduação EAD", href: "/cursos/pos-graduacao", icone: "ph-graduation-cap" },
  { label: "Profissionalizantes", href: "/cursos/profissionalizantes", icone: "ph-briefcase" },
  { label: "Formação Continuada", href: "/cursos/formacao-continuada", icone: "ph-chalkboard-teacher" },
  { label: "Fale conosco", href: "/contato", icone: "ph-chats-circle" },
];

const NotFound = () => {
  return (
    <section className={styles.tela}>
      <div className={styles.malha} aria-hidden="true" />

      <div className={`container ${styles.conteudo}`}>
        <span className={styles.codigo} aria-hidden="true">
          404
        </span>

        <h1 className={styles.titulo}>Essa página saiu do ar</h1>
        <p className={styles.texto}>
          O link pode ter mudado, ou o curso que estava aqui não está mais na vitrine. Nada se
          perdeu: é só seguir por um destes caminhos.
        </p>

        <div className={styles.acoes}>
          <Button href="/cursos" tamanho="lg" variant="claro" icone="ph-arrow-right">
            Ver todos os cursos
          </Button>
          <Button href="/" tamanho="lg" variant="fantasma" iconeAntes="ph-house">
            Voltar ao início
          </Button>
        </div>

        <div className={styles.atalhos}>
          <p className={styles.atalhosTitulo}>Ou siga por aqui</p>
          <div className={styles.atalhosGrade}>
            {ATALHOS.map((atalho) => (
              <Link key={atalho.href} href={atalho.href} className={styles.atalho}>
                <i className={`ph-bold ${atalho.icone}`} aria-hidden="true" />
                {atalho.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
