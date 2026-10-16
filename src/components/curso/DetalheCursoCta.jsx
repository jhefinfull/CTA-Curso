import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buscarVitrine, cursoCtaPorSlug } from "@/lib/vitrine";
import { gradienteDaMarca, iniciaisDoCurso } from "@/utils/cursoDisplay";
import { modalidadeDoTipo } from "@/config/tiposCurso";
import { linkWhatsappCurso, site } from "@/content/site";
import CursoCard from "@/components/cursos/CursoCard";
import styles from "./DetalheCurso.module.css";
import cta from "./DetalheCursoCta.module.css";

/**
 * Página de um curso do CTA que ainda não está na loja do sistema (presenciais,
 * semipresenciais, Unicorp, UNIP, certificações). O conteúdo veio do site antigo e a
 * inscrição é com a equipe, pelo WhatsApp — por isso não há checkout aqui.
 *
 * Usa o mesmo CSS da página de curso da loja, para as duas parecerem a mesma coisa.
 */
const DetalheCursoCta = async ({ slug }) => {
  const curso = cursoCtaPorSlug(slug);
  if (!curso) notFound();

  const modalidade = modalidadeDoTipo(curso.tipo);
  const whatsapp = linkWhatsappCurso(curso.titulo);
  const { cursos } = await buscarVitrine({ tipos: modalidade?.tipos || [curso.tipo] });
  const relacionados = cursos.filter((c) => c.id !== curso.id).slice(0, 4);
  const presencial = curso.tipo === "PRESENCIAL" || curso.modalidadeTexto === "Semipresencial";

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: curso.titulo,
    description: curso.resumo || curso.titulo,
    provider: { "@type": "EducationalOrganization", name: site.nomeLegal, sameAs: site.urlSite },
    ...(curso.imagemUrl ? { image: `${site.urlSite}${curso.imagemUrl}` } : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: presencial ? "blended" : "online",
      courseWorkload: curso.cargaHoraria > 0 ? `PT${curso.cargaHoraria}H` : undefined,
    },
  };

  return (
    <div className={styles.pagina}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />

      <nav className={`container ${styles.migalhas}`} aria-label="Você está aqui">
        <Link href="/">Início</Link>
        <i className="ph-bold ph-caret-right" aria-hidden="true" />
        <Link href="/cursos">Cursos</Link>
        <i className="ph-bold ph-caret-right" aria-hidden="true" />
        <Link href={modalidade?.rota || "/cursos"}>{modalidade?.titulo || "Cursos"}</Link>
        <i className="ph-bold ph-caret-right" aria-hidden="true" />
        <span>{curso.titulo}</span>
      </nav>

      <div className={`container ${styles.layout}`}>
        <article className={styles.principal}>
          <header className={styles.topo}>
            <div className={styles.chips}>
              <span className={styles.chip}>
                <i className={`ph-bold ${modalidade?.icone || "ph-graduation-cap"}`} aria-hidden="true" />
                {curso.rotulo}
              </span>
              {curso.instituicao && curso.instituicao !== "CTA" && (
                <span className={styles.chipNeutro}>{curso.instituicao}</span>
              )}
              {curso.cargaHoraria > 0 && (
                <span className={styles.chipTexto}>
                  <i className="ph-bold ph-clock" aria-hidden="true" />
                  {curso.cargaHoraria} horas
                </span>
              )}
            </div>

            <h1 className={styles.titulo}>{curso.titulo}</h1>
            {curso.resumo && <p className={styles.chamada}>{curso.resumo}</p>}

            <ul className={styles.resumoRapido}>
              <li>
                <i className={`ph-bold ${presencial ? "ph-chalkboard-teacher" : "ph-monitor-play"}`} aria-hidden="true" />
                <span>
                  <strong>{curso.modalidadeTexto}</strong>
                  <small>modalidade</small>
                </span>
              </li>
              {curso.cargaHoraria > 0 && (
                <li>
                  <i className="ph-bold ph-clock-countdown" aria-hidden="true" />
                  <span>
                    <strong>{curso.cargaHoraria}h</strong>
                    <small>carga horária</small>
                  </span>
                </li>
              )}
              {curso.duracao && (
                <li>
                  <i className="ph-bold ph-calendar" aria-hidden="true" />
                  <span>
                    <strong>{curso.duracao}</strong>
                    <small>duração</small>
                  </span>
                </li>
              )}
              <li>
                <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
                <span>
                  <strong>WhatsApp</strong>
                  <small>inscrição com a equipe</small>
                </span>
              </li>
            </ul>
          </header>

          {curso.conteudoHtml && (
            <section className={styles.bloco}>
              <h2 className={styles.blocoTitulo}>
                <i className="ph-bold ph-book-open" aria-hidden="true" />
                Sobre o curso
              </h2>
              {/* Conteúdo do site antigo, já limpo na conversão (só parágrafos, listas, tabelas e links externos). */}
              <div className={cta.conteudo} dangerouslySetInnerHTML={{ __html: curso.conteudoHtml }} />
            </section>
          )}

          <section className={styles.blocoDuvida}>
            <i className="ph-fill ph-chat-circle-dots" aria-hidden="true" />
            <div>
              <h2>Quer se inscrever ou tirar uma dúvida?</h2>
              <p>
                Chame a equipe do CTA no WhatsApp. A gente confirma turma, horário, valores e
                documentos com você — {site.horario.toLowerCase()}.
              </p>
            </div>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.duvidaBotao}>
              <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
              Falar no WhatsApp
            </a>
          </section>
        </article>

        <aside className={styles.lateral}>
          <div className={styles.cartaoCompra}>
            <div className={styles.capa}>
              {curso.imagemUrl ? (
                <Image
                  src={curso.imagemUrl}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 380px"
                  style={{ objectFit: "cover", objectPosition: "center 40%" }}
                  priority
                />
              ) : (
                <div className={styles.capaVazia} style={{ background: gradienteDaMarca(curso.titulo) }}>
                  <span>{iniciaisDoCurso(curso.titulo)}</span>
                  <i className={`ph-bold ${modalidade?.icone || "ph-graduation-cap"}`} aria-hidden="true" />
                </div>
              )}
            </div>

            <div className={styles.corpoCompra}>
              <div className={styles.blocoPreco}>
                <p className={styles.blocoLabel}>Valores e condições</p>
                {curso.precoTexto ? (
                  <p className={cta.inscricao}>{curso.precoTexto}</p>
                ) : (
                  <p className={styles.precoConsultar}>Consulte valores com a nossa equipe</p>
                )}
                {curso.pagamento?.length > 0 && (
                  <dl className={cta.pagamento}>
                    {curso.pagamento.map((g, i) => (
                      <div key={i}>
                        {g.rotulo && <dt>{g.rotulo}</dt>}
                        {g.linhas.map((l) => (
                          <dd key={l}>{l}</dd>
                        ))}
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              <ul className={styles.infos}>
                {curso.cargaHoraria > 0 && (
                  <li>
                    <i className="ph-bold ph-clock" aria-hidden="true" />
                    Carga horária: <b>{curso.cargaHoraria}h</b>
                  </li>
                )}
                <li>
                  <i className="ph-bold ph-monitor-play" aria-hidden="true" />
                  Modalidade: <b>{curso.modalidadeTexto}</b>
                </li>
                {curso.instituicao && (
                  <li>
                    <i className="ph-bold ph-buildings" aria-hidden="true" />
                    {curso.instituicao === "CTA" ? (
                      <>Oferecido pelo <b>CTA Boa Vista</b></>
                    ) : (
                      <>Instituição: <b>{curso.instituicao}</b></>
                    )}
                  </li>
                )}
                {presencial && (
                  <li>
                    <i className="ph-bold ph-map-pin" aria-hidden="true" />
                    {site.endereco.linha}, Centro
                  </li>
                )}
              </ul>
            </div>

            <div className={styles.rodapeCompra}>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${styles.matricular} ${cta.botaoWhats}`}>
                <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
                Quero me inscrever
              </a>
              <p className={styles.selo}>
                <i className="ph-fill ph-chats-circle" aria-hidden="true" />
                Retorno da equipe em até 24 horas, em dia útil
              </p>
            </div>
          </div>
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section className={styles.relacionados}>
          <div className="container">
            <div className={styles.relacionadosTopo}>
              <h2>Outros cursos de {modalidade?.titulo || "cursos"}</h2>
              <Link href={modalidade?.rota || "/cursos"}>
                Ver todos
                <i className="ph-bold ph-arrow-right" aria-hidden="true" />
              </Link>
            </div>
            <div className={styles.relacionadosGrade}>
              {relacionados.map((c) => (
                <CursoCard key={c.id} curso={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Barra fixa no celular: a coluna da inscrição fica muito abaixo em tela estreita. */}
      <div className={styles.barraMobile}>
        <div className={styles.barraPreco}>
          <small>Inscrição</small>
          <strong>{curso.precoTexto ? curso.precoTexto.replace("Inscrição ", "") : "pelo WhatsApp"}</strong>
        </div>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${styles.barraBotao} ${cta.botaoWhats}`}>
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default DetalheCursoCta;
