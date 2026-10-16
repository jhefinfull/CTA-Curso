import Link from "next/link";
import { linkWhatsapp, site } from "@/content/site";
import { MODALIDADES } from "@/config/tiposCurso";
import styles from "./Footer.module.css";

const INSTITUCIONAL = [
  { label: "Sobre nós", href: "/quem-somos" },
  { label: "Instituições parceiras", href: "/#parceiros" },
  { label: "Áreas de formação", href: "/areas" },
  { label: "Perguntas frequentes", href: "/faq" },
  { label: "Fale conosco", href: "/contato" },
];

const Footer = ({ areas = [], totais = {} }) => {
  const cursos = [
    { label: "Todos os cursos", href: "/cursos" },
    ...MODALIDADES.filter((m) => totais[m.chave] > 0).map((m) => ({ label: m.menu, href: m.rota })),
  ];
  // So as maiores; a lista inteira fica em /areas.
  const areasRodape = areas.slice(0, 6);
  const ano = new Date().getFullYear();

  return (
    <footer className={styles.rodape}>
      <div className={styles.topo} aria-hidden="true" />

      <div className={`container ${styles.grade}`}>
        <div className={styles.marca}>
          <img
            src="/imagens/site/logo_branca.png"
            alt={`${site.nome} — ${site.nomeCompleto}`}
            className={styles.logo}
            width={255}
            height={100}
          />
          <p className={styles.chamada}>{site.missao}</p>

          <div className={styles.redes}>
            <a
              href={site.redes.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram do CTA"
            >
              <i className="ph-bold ph-instagram-logo" aria-hidden="true" />
            </a>
            <a
              href={site.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook do CTA"
            >
              <i className="ph-bold ph-facebook-logo" aria-hidden="true" />
            </a>
            <a
              href={linkWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp do CTA"
            >
              <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
            </a>
          </div>
        </div>

        <nav className={styles.coluna} aria-label="Institucional">
          <h2>Institucional</h2>
          <ul>
            {INSTITUCIONAL.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.coluna} aria-label="Cursos">
          <h2>Cursos</h2>
          <ul>
            {cursos.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.coluna} aria-label="Áreas">
          <h2>Áreas</h2>
          <ul>
            {areasRodape.map((area) => (
              <li key={area.slug}>
                <Link href={`/areas/${area.slug}`}>{area.nome}</Link>
              </li>
            ))}
            <li>
              <Link href="/areas">
                {areas.length > areasRodape.length ? "Ver todas as áreas" : "Todas as áreas"}
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.coluna}>
          <h2>Contato</h2>
          <ul className={styles.contato}>
            <li>
              <i className="ph-bold ph-phone" aria-hidden="true" />
              <a href={site.telefoneLink}>{site.telefone}</a>
            </li>
            <li>
              <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
              <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                {site.whatsappExibicao}
              </a>
            </li>
            <li>
              <i className="ph-bold ph-envelope-simple" aria-hidden="true" />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <i className="ph-bold ph-map-pin" aria-hidden="true" />
              <a href={site.endereco.mapa} target="_blank" rel="noopener noreferrer">
                {site.endereco.linha}
                <br />
                {site.endereco.bairro}
                <br />
                CEP {site.endereco.cep}
              </a>
            </li>
            <li>
              <i className="ph-bold ph-clock" aria-hidden="true" />
              <span>{site.horario}</span>
            </li>
          </ul>

          <div className={styles.portais}>
            {site.portais.lista.map((portal) => (
              <a key={portal.nome} href={portal.url} target="_blank" rel="noopener noreferrer">
                <i className="ph-bold ph-student" aria-hidden="true" />
                Área do Aluno · {portal.nome}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.base}>
        <div className={`container ${styles.baseInner}`}>
          <p>
            © {ano} {site.nomeLegal} · CNPJ {site.cnpj}. Todos os direitos reservados.
          </p>
          <div className={styles.baseLinks}>
            <Link href="/politica-privacidade">Política de Privacidade e Termos de Uso</Link>
            <span aria-hidden="true">·</span>
            <Link href="/faq">Ajuda</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
