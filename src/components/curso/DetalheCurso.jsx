import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchGsdCurso, fetchGsdCursos } from "@/lib/gsdApi";
import {
  formatarMoeda,
  rotuloFormaPagamento,
  gradienteDaMarca,
  iniciaisDoCurso,
} from "@/utils/cursoDisplay";
import { dadosDaArea, ehAreaDeFormacao, iconeDaArea } from "@/config/areas";
import { TIPO_FIC, TIPO_PRESENCIAL, labelDoTipo, modalidadeDoTipo } from "@/config/tiposCurso";
import { cursoDaLojaNoSite, ehPresencialDaLoja, posDoSiteAntigo } from "@/lib/vitrine";
import { linkWhatsapp, site } from "@/content/site";
import CursoCard from "@/components/cursos/CursoCard";
import styles from "./DetalheCurso.module.css";
import cta from "./DetalheCursoCta.module.css";

/**
 * Cada plano é um caminho de compra fechado: clicar leva ao checkout do sistema
 * acadêmico com AQUELE plano já selecionado (`checkoutUrl`). Sem vaga, o cartão vira
 * bloco estático — continua informando o preço, mas para de convidar para o que não dá
 * para fazer.
 */
function PlanoCard({ plano, semVaga }) {
  const conteudo = (
    <>
      <div className={styles.planoTopo}>
        <span className={styles.planoNome}>{plano.nome}</span>
        {plano.padrao && <span className={styles.planoSelo}>Recomendado</span>}
      </div>

      <p className={styles.planoValor}>
        {formatarMoeda(plano.valor)}
        {plano.isAssinatura && <span className={styles.planoSufixo}>/mês</span>}
      </p>

      {plano.valorParcela != null && plano.maxParcelas > 1 && (
        <p className={styles.planoDetalhe}>
          ou {plano.maxParcelas}x de {formatarMoeda(plano.valorParcela)} no cartão
        </p>
      )}
      {plano.isAssinatura && plano.mesesRecorrencia > 0 && (
        <p className={styles.planoDetalhe}>
          por {plano.mesesRecorrencia} {plano.mesesRecorrencia === 1 ? "mês" : "meses"}
        </p>
      )}
      {plano.taxaMatricula > 0 && (
        <p className={styles.planoDetalhe}>
          + matrícula de {formatarMoeda(plano.taxaMatricula)}
          {plano.isAssinatura ? " (na inscrição)" : ""}
        </p>
      )}
      {plano.formasPagamento?.length > 0 && (
        <p className={styles.planoFormas}>
          {plano.formasPagamento.map(rotuloFormaPagamento).join(" · ")}
        </p>
      )}

      {!semVaga && (
        <span className={styles.planoEscolher}>
          Escolher este plano <i className="ph-bold ph-arrow-right" aria-hidden="true" />
        </span>
      )}
    </>
  );

  const classe = `${styles.planoCard} ${plano.padrao ? styles.planoPadrao : ""}`;

  if (semVaga || !plano.checkoutUrl) {
    return <div className={classe}>{conteudo}</div>;
  }

  return (
    <a href={plano.checkoutUrl} className={classe} rel="noopener">
      {conteudo}
    </a>
  );
}

/** Preço único: quando o curso tem um plano só (ou nenhum plano detalhado). */
function PrecoUnico({ preco }) {
  const parcela = preco.maxParcelas > 1 ? preco.valor / preco.maxParcelas : null;

  return (
    <>
      {preco.promo && preco.valorOriginal > preco.valor && (
        <p className={styles.precoDe}>
          De <s>{formatarMoeda(preco.valorOriginal)}</s> por
        </p>
      )}

      <p className={styles.precoValor}>
        {preco.aPartirDe && <span className={styles.precoPrefixo}>A partir de </span>}
        {formatarMoeda(preco.valor)}
        {preco.isAssinatura && <span className={styles.planoSufixo}>/mês</span>}
      </p>

      {parcela != null && (
        <p className={styles.planoDetalhe}>
          ou até <b>{preco.maxParcelas}x</b> de <b>{formatarMoeda(parcela)}</b> no cartão
        </p>
      )}
      {preco.isAssinatura && preco.mesesRecorrencia > 0 && (
        <p className={styles.planoDetalhe}>
          por <b>{preco.mesesRecorrencia}</b> {preco.mesesRecorrencia === 1 ? "mês" : "meses"}
        </p>
      )}
      {preco.taxaMatricula > 0 && (
        <p className={styles.planoDetalhe}>
          + taxa de matrícula de <b>{formatarMoeda(preco.taxaMatricula)}</b>
          {preco.isAssinatura ? " (paga na inscrição)" : ""}
        </p>
      )}
    </>
  );
}

const DetalheCurso = async ({ id }) => {
  // Uma chamada para o detalhe e outra para a vitrine: a vitrine dá o código do tipo
  // (que o endpoint de detalhe não devolve) e os cursos relacionados de brinde.
  const [curso, vitrine] = await Promise.all([fetchGsdCurso(id), fetchGsdCursos()]);

  if (!curso) notFound();

  // Os cursos com o tipo que têm no site: o presencial do CTA chega da loja como FIC.
  const cursosNoSite = vitrine.cursos.map(cursoDaLojaNoSite);
  const naVitrine = cursosNoSite.find((c) => c.id === curso.id);
  const ehProprio = Boolean(naVitrine?.ehProprio);
  const presencial = ehPresencialDaLoja(curso);
  const tipo = presencial ? TIPO_PRESENCIAL : naVitrine?.tipo;

  // Subtipo ("Subsequente", "MBA") não é área: não vira chip nem link de área.
  const temArea = ehAreaDeFormacao(curso.subcategoria);
  const area = temArea ? dadosDaArea(curso.subcategoria) : null;
  // A navegação sobe para a página da modalidade do curso. O curso livre (FIC) com área
  // sobe para a área, que é como o visitante procura esses cursos.
  const modalidade = tipo ? modalidadeDoTipo(tipo) : null;
  const rotaTipo = tipo === TIPO_FIC && area ? null : modalidade?.rota || null;
  const nomeTipo = labelDoTipo(tipo, curso.tipoLabel);
  const hrefArea = rotaTipo || (area ? `/areas/${area.slug}` : "/cursos");
  const nomeAreaBreadcrumb = rotaTipo ? modalidade.titulo : (temArea && curso.subcategoria) || "Cursos";

  const preco = curso.preco || {};
  const planos = curso.planos || [];
  const formasPagamento = preco.formasPagamento || [];

  const modulos = (curso.grade || []).filter((m) => (m.disciplinas || []).length > 0);

  // `sobreOCurso` é o texto longo e `resumo` o curto. Quando os dois existem, o resumo
  // vira a chamada do topo em vez de repetir o mesmo conteúdo logo abaixo.
  const descricao = curso.sobreOCurso || curso.resumo;
  const chamada = curso.chamada || (curso.sobreOCurso ? curso.resumo : null);
  // Pós por área que substituiu a do site antigo: lá o texto tem os links das grades de
  // cada especialização, que não cabem no "Sobre o curso" da loja (só texto).
  const conteudoHtml = posDoSiteAntigo(naVitrine)?.conteudoHtml || null;

  // Relacionados: mesma área quando o curso tem área; senão, a mesma modalidade.
  const relacionados = cursosNoSite
    .filter((c) => c.id !== curso.id && (temArea ? c.subcategoria === curso.subcategoria : c.tipo === tipo))
    .slice(0, 4);

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: curso.titulo,
    description: descricao || curso.titulo,
    provider: {
      "@type": "EducationalOrganization",
      name: site.nomeLegal,
      sameAs: site.urlSite,
    },
    ...(curso.imagemUrl ? { image: curso.imagemUrl } : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: presencial ? "onsite" : "online",
    },
    ...(typeof preco.valor === "number"
      ? {
          offers: {
            "@type": "Offer",
            price: preco.valor,
            priceCurrency: "BRL",
            availability: curso.semVaga
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
            url: curso.urls?.checkout || `${site.urlSite}/curso/${curso.id}`,
          },
        }
      : {}),
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
        <Link href={hrefArea}>{nomeAreaBreadcrumb}</Link>
        <i className="ph-bold ph-caret-right" aria-hidden="true" />
        <span>{curso.titulo}</span>
      </nav>

      <div className={`container ${styles.layout}`}>
        <article className={styles.principal}>
          <header className={styles.topo}>
            <div className={styles.chips}>
              {temArea && (
                <span className={styles.chip}>
                  <i className={`ph-bold ${iconeDaArea(curso.subcategoria)}`} aria-hidden="true" />
                  {curso.subcategoria}
                </span>
              )}
              {curso.tipoLabel && <span className={styles.chipNeutro}>{nomeTipo}</span>}
              {preco.promo && (
                <span className={styles.chipPromo}>
                  <i className="ph-fill ph-fire" aria-hidden="true" />
                  Em promoção
                </span>
              )}
              {ehProprio && (
                <span className={styles.chipProprio}>
                  <i className="ph-fill ph-seal-check" aria-hidden="true" />
                  Curso {site.nome}
                </span>
              )}
            </div>

            <h1 className={styles.titulo}>{curso.titulo}</h1>
            {chamada && <p className={styles.chamada}>{chamada}</p>}

            <ul className={styles.resumoRapido}>
              <li>
                <i className={`ph-bold ${presencial ? "ph-chalkboard-teacher" : "ph-monitor-play"}`} aria-hidden="true" />
                <span>
                  <strong>{presencial ? "Presencial" : "100% online"}</strong>
                  <small>{presencial ? "no Centro de Boa Vista" : "estude quando quiser"}</small>
                </span>
              </li>
              <li>
                <i className="ph-bold ph-certificate" aria-hidden="true" />
                <span>
                  <strong>Certificado</strong>
                  <small>ao concluir</small>
                </span>
              </li>
            </ul>
          </header>

          {(conteudoHtml || descricao) && (
            <section className={styles.bloco}>
              <h2 className={styles.blocoTitulo}>
                <i className="ph-bold ph-book-open" aria-hidden="true" />
                Sobre o curso
              </h2>
              {conteudoHtml ? (
                <div className={cta.conteudo} dangerouslySetInnerHTML={{ __html: conteudoHtml }} />
              ) : (
                <p className={styles.paragrafo}>{descricao}</p>
              )}
            </section>
          )}

          {curso.publicoAlvo?.length > 0 && (
            <section className={styles.bloco}>
              <h2 className={styles.blocoTitulo}>
                <i className="ph-bold ph-users-three" aria-hidden="true" />
                Para quem é este curso
              </h2>
              <ul className={styles.listaCheck}>
                {curso.publicoAlvo.map((item, i) => (
                  <li key={i}>
                    <i className="ph-fill ph-check-circle" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {curso.preRequisitos?.length > 0 && (
            <section className={styles.bloco}>
              <h2 className={styles.blocoTitulo}>
                <i className="ph-bold ph-list-checks" aria-hidden="true" />
                Pré-requisitos
              </h2>
              <ul className={`${styles.listaCheck} ${styles.listaNeutra}`}>
                {curso.preRequisitos.map((item, i) => (
                  <li key={i}>
                    <i className="ph-fill ph-dot-outline" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {modulos.length > 0 && (
            <section className={styles.bloco}>
              <h2 className={styles.blocoTitulo}>
                <i className="ph-bold ph-graduation-cap" aria-hidden="true" />
                O que você vai estudar
              </h2>
              <div className={styles.modulos}>
                {modulos.map((modulo, i) => (
                  <div key={modulo.periodo ?? i}>
                    {modulos.length > 1 && (
                      <p className={styles.moduloLabel}>Módulo {modulo.periodo ?? i + 1}</p>
                    )}

                    <div className={styles.disciplinas}>
                      {modulo.disciplinas.map((disciplina, j) => {
                        const ementa = disciplina.ementa?.trim();

                        // Vira acordeão só quando há ementa: abrir uma linha para ler
                        // "sem ementa" é ruído. <details> nativo, zero JS.
                        if (!ementa) {
                          return (
                            <div key={j} className={styles.disciplina}>
                              <span>{disciplina.nome}</span>
                            </div>
                          );
                        }

                        return (
                          <details key={j} className={styles.disciplinaExpansivel}>
                            <summary className={styles.disciplina}>
                              <span>{disciplina.nome}</span>
                              <i className="ph-bold ph-caret-down" aria-hidden="true" />
                            </summary>
                            <p className={styles.ementa}>{ementa}</p>
                          </details>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {area && !rotaTipo && (
            <section className={`${styles.bloco} ${styles.blocoTrilha}`}>
              <div>
                <p className={styles.trilhaOlho}>Este curso é da área de</p>
                <h2 className={styles.trilhaNome}>
                  <i className={`ph-bold ${area.icone}`} aria-hidden="true" />
                  {area.nome}
                </h2>
                {area.descricao && <p className={styles.paragrafo}>{area.descricao}</p>}
              </div>
              <Link href={`/areas/${area.slug}`} className={styles.trilhaBotao}>
                Ver todos de {area.nome}
                <i className="ph-bold ph-arrow-right" aria-hidden="true" />
              </Link>
            </section>
          )}

          <section className={styles.blocoDuvida}>
            <i className="ph-fill ph-chat-circle-dots" aria-hidden="true" />
            <div>
              <h2>Ficou com dúvida sobre este curso?</h2>
              <p>
                Fale com a nossa equipe antes de decidir. A gente explica conteúdo, prazo,
                certificado e formas de pagamento — sem compromisso.
              </p>
            </div>
            <a
              href={linkWhatsapp(`Olá! Quero saber mais sobre o curso "${curso.titulo}".`)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.duvidaBotao}
            >
              <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
              Tirar dúvida
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
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <div
                  className={styles.capaVazia}
                  style={{ background: gradienteDaMarca(curso.titulo) }}
                >
                  <span>{iniciaisDoCurso(curso.titulo)}</span>
                  <i className={`ph-bold ${iconeDaArea(curso.subcategoria)}`} aria-hidden="true" />
                </div>
              )}
              {ehProprio && (
                <span className={styles.capaSelo}>
                  <i className="ph-fill ph-seal-check" aria-hidden="true" />
                  {site.nome}
                </span>
              )}
            </div>

            <div className={styles.corpoCompra}>
              <div className={styles.blocoPreco}>
                {planos.length > 1 ? (
                  <>
                    <p className={styles.blocoLabel}>Planos de pagamento</p>
                    <div className={styles.planos}>
                      {planos.map((plano) => (
                        <PlanoCard key={plano.id} plano={plano} semVaga={curso.semVaga} />
                      ))}
                    </div>
                    <p className={styles.planosNota}>
                      {curso.semVaga
                        ? "Você escolhe o plano na inscrição."
                        : "Toque no plano que preferir para se matricular."}
                    </p>
                  </>
                ) : typeof preco.valor === "number" ? (
                  <PrecoUnico preco={planos[0] ? { ...preco, ...planos[0] } : preco} />
                ) : (
                  <p className={styles.precoConsultar}>Consulte valores com a nossa equipe</p>
                )}
              </div>

              <ul className={styles.infos}>
                <li>
                  <i className={`ph-bold ${presencial ? "ph-chalkboard-teacher" : "ph-monitor-play"}`} aria-hidden="true" />
                  Modalidade: <b>{presencial ? "Presencial no CTA" : "EAD — 100% online"}</b>
                </li>
                {presencial && (
                  <li>
                    <i className="ph-bold ph-map-pin" aria-hidden="true" />
                    {site.endereco.linha}, Centro
                  </li>
                )}
                <li>
                  <i className="ph-bold ph-certificate" aria-hidden="true" />
                  Certificado de conclusão
                </li>
                <li>
                  <i className="ph-bold ph-lightning" aria-hidden="true" />
                  {presencial ? "Matrícula confirmada após o pagamento" : "Acesso liberado após a confirmação"}
                </li>
                {formasPagamento.length > 0 && (
                  <li>
                    <i className="ph-bold ph-shield-check" aria-hidden="true" />
                    {formasPagamento.map(rotuloFormaPagamento).join(" · ")}
                  </li>
                )}
              </ul>
            </div>

            <div className={styles.rodapeCompra}>
              {!curso.semVaga && curso.vagas != null && (
                <p className={styles.vagas}>
                  <i className="ph-fill ph-users" aria-hidden="true" />
                  {curso.vagas} {curso.vagas === 1 ? "vaga disponível" : "vagas disponíveis"}
                </p>
              )}

              {curso.semVaga ? (
                <>
                  <span className={styles.semVaga}>Sem vaga no momento</span>
                  <a
                    href={linkWhatsapp(
                      `Olá! Quero entrar na lista de espera do curso "${curso.titulo}".`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.listaEspera}
                  >
                    <i className="ph-bold ph-bell" aria-hidden="true" />
                    Avise-me quando abrir
                  </a>
                </>
              ) : (
                curso.urls?.checkout && (
                  <a href={curso.urls.checkout} className={styles.matricular} rel="noopener">
                    Matricule-se agora
                    <i className="ph-bold ph-arrow-right" aria-hidden="true" />
                  </a>
                )
              )}

              <p className={styles.selo}>
                <i className="ph-fill ph-lock-key" aria-hidden="true" />
                {curso.semVaga
                  ? "Novas turmas em breve — fale com a gente."
                  : "Pagamento seguro processado pelo sistema acadêmico"}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {relacionados.length > 0 && (
        <section className={styles.relacionados}>
          <div className="container">
            <div className={styles.relacionadosTopo}>
              <h2>Quem viu este curso também viu</h2>
              <Link href={hrefArea}>
                Ver mais de {rotaTipo || temArea ? nomeAreaBreadcrumb : "cursos"}
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

      {/* Barra fixa no mobile: a coluna de compra fica muito abaixo em tela estreita. */}
      {!curso.semVaga && curso.urls?.checkout && (
        <div className={styles.barraMobile}>
          <div className={styles.barraPreco}>
            {typeof preco.valor === "number" ? (
              <>
                <small>{preco.aPartirDe ? "A partir de" : "Investimento"}</small>
                <strong>
                  {formatarMoeda(preco.valor)}
                  {preco.isAssinatura ? "/mês" : ""}
                </strong>
              </>
            ) : (
              <strong>Consulte valores</strong>
            )}
          </div>
          <a href={curso.urls.checkout} className={styles.barraBotao} rel="noopener">
            Matricule-se
          </a>
        </div>
      )}
    </div>
  );
};

export default DetalheCurso;
