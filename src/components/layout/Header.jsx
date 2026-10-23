"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { MODALIDADES } from "@/config/tiposCurso";
import styles from "./Header.module.css";

const LINKS_SIMPLES = [
  { label: "Sobre nós", href: "/quem-somos" },
  { label: "Dúvidas", href: "/faq" },
  { label: "Fale conosco", href: "/contato" },
];

// Quantas áreas cabem no mega menu sem ele virar uma lista de rolar. O resto fica a um
// clique, em "Ver todas as áreas".
const MAX_AREAS_MENU = 12;

/**
 * `areas` e `totais` (cursos por modalidade) vêm do servidor: das facetas da loja somadas
 * aos cursos do CTA que ainda não estão nela. Quando a escola publica um curso numa área
 * nova, ela aparece no menu sozinha. Modalidade sem curso não aparece no menu.
 */
const Header = ({ areas = [], totais = {} }) => {
  const pathname = usePathname();
  const [rolou, setRolou] = useState(false);
  const [mobileAberto, setMobileAberto] = useState(false);
  const [cursosAberto, setCursosAberto] = useState(false);
  const [mobileCursos, setMobileCursos] = useState(false);
  const [alunoAberto, setAlunoAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(pathname);
  const refCursos = useRef(null);
  const refAluno = useRef(null);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 16);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Trocar de página tem que fechar tudo — senão o menu mobile fica por cima da página nova.
  // Ajustado durante a renderização, e não num efeito, para a página nova já abrir sem menu.
  if (pathname !== paginaAtual) {
    setPaginaAtual(pathname);
    setMobileAberto(false);
    setCursosAberto(false);
    setMobileCursos(false);
    setAlunoAberto(false);
  }

  // O menu da Área do Aluno (três portais) fecha por clique fora e por Esc.
  useEffect(() => {
    if (!alunoAberto) return undefined;
    const fora = (e) => {
      if (refAluno.current && !refAluno.current.contains(e.target)) setAlunoAberto(false);
    };
    const esc = (e) => {
      if (e.key === "Escape") setAlunoAberto(false);
    };
    document.addEventListener("mousedown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [alunoAberto]);

  useEffect(() => {
    document.body.style.overflow = mobileAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileAberto]);

  // O mega menu abre por clique, então precisa fechar por clique fora e por Esc.
  useEffect(() => {
    if (!cursosAberto) return undefined;

    const aoClicarFora = (e) => {
      if (refCursos.current && !refCursos.current.contains(e.target)) setCursosAberto(false);
    };
    const aoTeclar = (e) => {
      if (e.key === "Escape") setCursosAberto(false);
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [cursosAberto]);

  const emCursos =
    pathname.startsWith("/cursos") || pathname.startsWith("/areas") || pathname.startsWith("/curso/");

  const areasMenu = areas.slice(0, MAX_AREAS_MENU);
  const modalidadesMenu = MODALIDADES.filter((m) => totais[m.chave] > 0);
  const totalCursos = modalidadesMenu.reduce((soma, m) => soma + totais[m.chave], 0);

  return (
    <header className={`${styles.header} ${rolou ? styles.rolou : ""}`}>
      <div className={styles.faixa}>
        <div className={`container ${styles.faixaInner}`}>
          <span className={styles.faixaItem}>
            <i className="ph-fill ph-map-pin" aria-hidden="true" />
            Presencial no Centro de Boa Vista · EAD para todo o Brasil
          </span>
          <div className={styles.faixaLinks}>
            <a href={site.telefoneLink} className={styles.faixaItem}>
              <i className="ph-bold ph-phone" aria-hidden="true" />
              {site.telefone}
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.faixaItem}
            >
              <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
              {site.whatsappExibicao}
            </a>
            <a href={`mailto:${site.email}`} className={styles.faixaItem}>
              <i className="ph-bold ph-envelope-simple" aria-hidden="true" />
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.barra}`}>
        <Link href="/" className={styles.logo} aria-label={`${site.nome} — página inicial`}>
          <img
            src="/imagens/site/logo_cor.png"
            alt={`${site.nome} — ${site.nomeCompleto}`}
            width={300}
            height={100}
          />
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          <ul className={styles.navLista}>
            <li>
              <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.ativo : ""}`}>
                Início
              </Link>
            </li>

            <li className={styles.navItemMega} ref={refCursos}>
              <button
                type="button"
                className={`${styles.navLink} ${styles.navBotao} ${emCursos ? styles.ativo : ""} ${cursosAberto ? styles.navAberto : ""}`}
                onClick={() => setCursosAberto((v) => !v)}
                aria-expanded={cursosAberto}
                aria-haspopup="true"
              >
                Cursos
                <i className="ph-bold ph-caret-down" aria-hidden="true" />
              </button>

              <div
                className={`${styles.mega} ${cursosAberto ? styles.megaAberto : ""} ${areasMenu.length === 0 ? styles.megaSemAreas : ""}`}
              >
                {areasMenu.length > 0 && (
                  <div className={styles.megaTrilhas}>
                    <div className={styles.megaCabecalho}>
                      <Link href="/areas" className={styles.megaTitulo}>
                        <i className="ph-bold ph-squares-four" aria-hidden="true" />
                        Áreas de formação
                      </Link>
                      <span className={styles.megaContagem}>{areas.length} áreas</span>
                    </div>

                    <ul className={styles.megaGrade}>
                      {areasMenu.map((area) => (
                        <li key={area.slug}>
                          <Link href={`/areas/${area.slug}`} className={styles.megaArea}>
                            <span className={`${styles.megaIcone} ${styles[area.cor]}`}>
                              <i className={`ph-bold ${area.icone}`} aria-hidden="true" />
                            </span>
                            <span className={styles.megaAreaTexto}>
                              <strong>{area.nome}</strong>
                              <small>
                                {area.total} {area.total === 1 ? "curso" : "cursos"}
                              </small>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {areas.length > areasMenu.length && (
                      <Link href="/areas" className={styles.megaVerAreas}>
                        Ver todas as {areas.length} áreas
                        <i className="ph-bold ph-arrow-right" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                )}

                <div className={styles.megaLateral}>
                  <p className={styles.megaLateralTitulo}>Modalidades</p>

                  {modalidadesMenu.map((m) => (
                    <Link key={m.chave} href={m.rota} className={`${styles.megaCartao} ${styles[`megaCor_${m.cor}`]}`}>
                      <span className={styles.megaCartaoIcone}>
                        <i className={`ph-bold ${m.icone}`} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{m.menu}</strong>
                        <small>{m.resumo}</small>
                      </span>
                    </Link>
                  ))}

                  <Link href="/cursos" className={styles.megaVerTodos}>
                    Ver todos os cursos
                    {totalCursos > 0 && (
                      <span className={styles.megaVerTodosTotal}>{totalCursos}</span>
                    )}
                    <i className="ph-bold ph-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>

            <li>
              <Link
                href="/areas"
                className={`${styles.navLink} ${pathname.startsWith("/areas") ? styles.ativo : ""}`}
              >
                Áreas
              </Link>
            </li>

            {LINKS_SIMPLES.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${pathname === item.href ? styles.ativo : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.acoes}>
          <div className={styles.alunoGrupo} ref={refAluno}>
            <button
              type="button"
              className={styles.aluno}
              onClick={() => setAlunoAberto((v) => !v)}
              aria-expanded={alunoAberto}
              aria-haspopup="true"
            >
              <i className="ph-bold ph-user-circle" aria-hidden="true" />
              <span>Área do Aluno</span>
              <i className="ph-bold ph-caret-down" aria-hidden="true" />
            </button>
            {alunoAberto && (
              <div className={styles.alunoMenu}>
                {site.portais.lista.map((portal) => (
                  <a key={portal.nome} href={portal.url} target="_blank" rel="noopener noreferrer">
                    <strong>{portal.nome}</strong>
                    <small>{portal.descricao}</small>
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link href="/cursos" className={styles.inscreva}>
            Inscreva-se
          </Link>

          <button
            type="button"
            className={styles.burger}
            onClick={() => setMobileAberto((v) => !v)}
            aria-label={mobileAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileAberto}
            aria-controls="menu-mobile"
          >
            <i className={`ph-bold ${mobileAberto ? "ph-x" : "ph-list"}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="menu-mobile"
        className={`${styles.painelMobile} ${mobileAberto ? styles.painelAberto : ""}`}
      >
        <ul className={styles.listaMobile}>
          <li>
            <Link href="/" className={styles.linkMobile}>
              <i className="ph-bold ph-house" aria-hidden="true" />
              Início
            </Link>
          </li>

          <li>
            <button
              type="button"
              className={styles.linkMobile}
              onClick={() => setMobileCursos((v) => !v)}
              aria-expanded={mobileCursos}
            >
              <i className="ph-bold ph-books" aria-hidden="true" />
              Cursos
              <i
                className={`ph-bold ${mobileCursos ? "ph-caret-up" : "ph-caret-down"} ${styles.linkMobileSeta}`}
                aria-hidden="true"
              />
            </button>
            {mobileCursos && (
              <ul className={styles.subListaMobile}>
                <li>
                  <Link href="/cursos" className={styles.subLinkMobile}>
                    Todos os cursos
                  </Link>
                </li>
                {modalidadesMenu.map((m) => (
                  <li key={m.chave}>
                    <Link href={m.rota} className={styles.subLinkMobile}>
                      {m.menu}
                      <span className={styles.subLinkTotal}>{totais[m.chave]}</span>
                    </Link>
                  </li>
                ))}
                {areasMenu.map((area) => (
                  <li key={area.slug}>
                    <Link href={`/areas/${area.slug}`} className={styles.subLinkMobile}>
                      {area.nome}
                      <span className={styles.subLinkTotal}>{area.total}</span>
                    </Link>
                  </li>
                ))}
                {areas.length > areasMenu.length && (
                  <li>
                    <Link href="/areas" className={styles.subLinkMobile}>
                      Ver todas as {areas.length} áreas
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </li>

          <li>
            <Link href="/areas" className={styles.linkMobile}>
              <i className="ph-bold ph-squares-four" aria-hidden="true" />
              Áreas
            </Link>
          </li>

          {LINKS_SIMPLES.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.linkMobile}>
                <i className="ph-bold ph-caret-right" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.rodapeMobile}>
          {site.portais.lista.map((portal) => (
            <a
              key={portal.nome}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.alunoMobile}
            >
              <i className="ph-bold ph-user-circle" aria-hidden="true" />
              Área do Aluno · {portal.nome}
            </a>
          ))}
          <a href={site.telefoneLink} className={styles.telefoneMobile}>
            <i className="ph-bold ph-phone" aria-hidden="true" />
            {site.telefone}
          </a>
        </div>
      </div>

      {mobileAberto && (
        <button
          type="button"
          className={styles.overlay}
          onClick={() => setMobileAberto(false)}
          aria-label="Fechar menu"
          tabIndex={-1}
        />
      )}
    </header>
  );
};

export default Header;
