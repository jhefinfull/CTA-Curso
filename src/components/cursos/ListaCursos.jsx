import Link from "next/link";
import { buscarVitrine, contarPorModalidade } from "@/lib/vitrine";
import { MODALIDADES, labelDoTipo } from "@/config/tiposCurso";
import { ehAreaDeFormacao } from "@/config/areas";
import { filtrarPorBusca } from "@/utils/cursoDisplay";
import { linkWhatsapp } from "@/content/site";
import CursoCard from "./CursoCard";
import CursosVazio from "./CursosVazio";
import BuscaCursosBar from "./BuscaCursosBar";
import styles from "./ListaCursos.module.css";

const POR_PAGINA = 12;

/** Mesma comparação do filtro `?categoria=` da API: nome exato, sem diferenciar maiúsculas. */
function mesmaArea(area, alvo) {
  return (area || "").trim().toLowerCase() === (alvo || "").trim().toLowerCase();
}

/** Áreas (com contagem) de uma lista de cursos, no formato da faceta `categorias` da API. */
function contarAreas(cursos) {
  const totais = new Map();
  for (const curso of cursos) {
    if (curso.subcategoria) totais.set(curso.subcategoria, (totais.get(curso.subcategoria) || 0) + 1);
  }
  return [...totais].map(([nome, total]) => ({ nome, total }));
}

function Paginacao({ paginaAtual, totalPaginas, gerarHref }) {
  if (totalPaginas <= 1) return null;

  // Mostra primeira, última e as vizinhas da atual; o resto vira reticência.
  const paginas = [];
  for (let p = 1; p <= totalPaginas; p += 1) {
    if (p === 1 || p === totalPaginas || Math.abs(p - paginaAtual) <= 1) {
      paginas.push(p);
    } else if (paginas[paginas.length - 1] !== "…") {
      paginas.push("…");
    }
  }

  return (
    <nav className={styles.paginacao} aria-label="Paginação de cursos">
      <Link
        href={gerarHref(Math.max(1, paginaAtual - 1))}
        className={`${styles.pagBotao} ${paginaAtual === 1 ? styles.pagDesativado : ""}`}
        aria-disabled={paginaAtual === 1}
        aria-label="Página anterior"
      >
        <i className="ph-bold ph-caret-left" aria-hidden="true" />
      </Link>

      {paginas.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className={styles.pagReticencia} aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={gerarHref(p)}
            className={`${styles.pagBotao} ${p === paginaAtual ? styles.pagAtivo : ""}`}
            aria-current={p === paginaAtual ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={gerarHref(Math.min(totalPaginas, paginaAtual + 1))}
        className={`${styles.pagBotao} ${paginaAtual === totalPaginas ? styles.pagDesativado : ""}`}
        aria-disabled={paginaAtual === totalPaginas}
        aria-label="Próxima página"
      >
        <i className="ph-bold ph-caret-right" aria-hidden="true" />
      </Link>
    </nav>
  );
}

/**
 * Listagem de cursos — a mesma em /cursos e nas rotas de modalidade.
 *
 * Em modo geral (`tipoFixo` ausente) mostra o filtro de modalidade na barra lateral. Numa
 * rota de modalidade o tipo já vem travado (`tipoFixo`: um código ou uma lista de códigos)
 * e o filtro de modalidade some. Os cursos vêm de buscarVitrine: loja do sistema + cursos
 * do CTA que ainda não estão na loja.
 */
const ListaCursos = async ({
  categoriaAtual,
  tipoAtual,
  tipoFixo,
  basePath = "/cursos",
  tituloPagina,
  descricaoPagina,
  busca,
  ordem = "nome",
  pagina,
  // As rotas de modalidade já abrem com um PageHero, que carrega o <h1> da página.
  // Repetir o cabeçalho aqui criaria dois h1 e duas vezes o mesmo título na tela.
  ocultarCabecalho = false,
}) => {
  const fixos = tipoFixo ? [].concat(tipoFixo) : null;

  // Numa rota de modalidade, a vitrine vem SEM o filtro de área: as áreas da barra
  // lateral são contadas sobre os cursos da própria modalidade (a faceta da API conta
  // a vitrine inteira) e a área escolhida é aplicada aqui, com a mesma regra da API.
  const { cursos: vitrine, facetas, instituicao } = await buscarVitrine({
    categoria: fixos ? undefined : categoriaAtual,
    tipos: fixos || (tipoAtual ? [tipoAtual] : undefined),
    ordem,
  });

  const daSecao = vitrine;
  const daArea =
    tipoFixo && categoriaAtual
      ? daSecao.filter((curso) => mesmaArea(curso.subcategoria, categoriaAtual))
      : daSecao;
  const cursos = filtrarPorBusca(daArea, busca);
  const catalogo = cursos;

  const paginaPedida = Math.max(1, parseInt(pagina, 10) || 1);
  const totalPaginas = Math.max(1, Math.ceil(catalogo.length / POR_PAGINA));
  const paginaAtual = Math.min(paginaPedida, totalPaginas);
  const catalogoPagina = catalogo.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);


  const comParams = (mudancas) => {
    const params = new URLSearchParams();
    if (categoriaAtual) params.set("categoria", categoriaAtual);
    if (!tipoFixo && tipoAtual) params.set("tipo", tipoAtual);
    if (busca) params.set("busca", busca);
    if (ordem && ordem !== "nome") params.set("ordem", ordem);

    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor === null || valor === undefined || valor === "") params.delete(chave);
      else params.set(chave, String(valor));
    }

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const hrefCategoria = (nome) => comParams({ categoria: nome, pagina: null });
  const hrefPagina = (p) => comParams({ pagina: p > 1 ? p : null });

  // Em /cursos (todas as modalidades) a faceta da API serve como está. Numa rota de
  // modalidade, só as áreas dos cursos DELA: Pós, Técnicos e Formação Continuada ganham
  // a barra de áreas quando a escola preenche a "Área no site" do curso (o técnico sem
  // área vem com o eixo tecnológico do CNCT), e a contagem não mistura modalidades.
  const categorias = (tipoFixo ? contarAreas(daSecao) : facetas.categorias || [])
    .filter((categoria) => ehAreaDeFormacao(categoria.nome))
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, "pt-BR"));
  const tipos = facetas.tipos || [];
  const totalPorModalidade = contarPorModalidade(MODALIDADES, tipos);
  const modalidadesComCurso = MODALIDADES.filter((m) => totalPorModalidade[m.chave] > 0);

  const mostrarAreas = categorias.length > 0;
  const mostrarTipos = !tipoFixo && modalidadesComCurso.length > 0;
  const temSidebar = mostrarAreas || mostrarTipos;

  const titulo =
    tituloPagina ||
    categoriaAtual ||
    labelDoTipo(tipoAtual, tipos.find((t) => t.codigo === tipoAtual)?.label) ||
    "Todos os cursos";

  const temFiltroAtivo = Boolean(categoriaAtual || (!tipoFixo && tipoAtual) || busca);

  return (
    <section className={`${styles.secao} ${ocultarCabecalho ? styles.secaoComHero : ""}`}>
      <div className={`container ${styles.envolucro} ${temSidebar ? "" : styles.semSidebar}`}>
        {temSidebar && (
          <>
            {/* Mobile: chips roláveis. Uma sidebar empilhada empurraria a grade
                de cursos para baixo da dobra em todo telefone. */}
            {mostrarAreas && (
              <div className={styles.chips}>
                <Link
                  href={hrefCategoria(null)}
                  className={`${styles.chip} ${!categoriaAtual ? styles.chipAtivo : ""}`}
                >
                  Todas as áreas
                </Link>
                {categorias.map((categoria) => (
                  <Link
                    key={categoria.nome}
                    href={hrefCategoria(categoria.nome)}
                    className={`${styles.chip} ${categoriaAtual === categoria.nome ? styles.chipAtivo : ""}`}
                  >
                    {categoria.nome}
                    <span>{categoria.total}</span>
                  </Link>
                ))}
              </div>
            )}

            <aside className={styles.sidebar} aria-label="Filtros">
              {mostrarTipos && (
                <div className={styles.cartaoFiltro}>
                  <h2 className={styles.tituloFiltro}>
                    <i className="ph-bold ph-stack" aria-hidden="true" />
                    Modalidade
                  </h2>
                  <ul className={styles.listaFiltro}>
                    <li>
                      <Link
                        href={comParams({ tipo: null, pagina: null })}
                        className={`${styles.itemFiltro} ${!tipoAtual ? styles.itemAtivo : ""}`}
                      >
                        <i className="ph-bold ph-squares-four" aria-hidden="true" />
                        Todas
                      </Link>
                    </li>
                    {modalidadesComCurso.map((m) => (
                      <li key={m.chave}>
                        <Link
                          href={m.rota}
                          className={`${styles.itemFiltro} ${m.tipos.includes(tipoAtual) ? styles.itemAtivo : ""}`}
                        >
                          <i className={`ph-bold ${m.icone}`} aria-hidden="true" />
                          {m.menu}
                          <span className={styles.contagem}>{totalPorModalidade[m.chave]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mostrarAreas && (
                <div className={styles.cartaoFiltro}>
                  <h2 className={styles.tituloFiltro}>
                    <i className="ph-bold ph-folders" aria-hidden="true" />
                    Áreas
                  </h2>
                  <ul className={styles.listaFiltro}>
                    <li>
                      <Link
                        href={hrefCategoria(null)}
                        className={`${styles.itemFiltro} ${!categoriaAtual ? styles.itemAtivo : ""}`}
                      >
                        <i className="ph-bold ph-squares-four" aria-hidden="true" />
                        Todas as áreas
                      </Link>
                    </li>
                    {categorias.map((categoria) => (
                      <li key={categoria.nome}>
                        <Link
                          href={hrefCategoria(categoria.nome)}
                          className={`${styles.itemFiltro} ${categoriaAtual === categoria.nome ? styles.itemAtivo : ""}`}
                        >
                          <i className="ph-bold ph-folder-open" aria-hidden="true" />
                          {categoria.nome}
                          <span className={styles.contagem}>{categoria.total}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.ajuda}>
                <i className="ph-fill ph-lifebuoy" aria-hidden="true" />
                <p>Não achou o que procurava? A gente te ajuda a escolher.</p>
                <a
                  href={linkWhatsapp("Olá! Vim pelo site do CTA e quero ajuda para escolher um curso.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ajudaBotao}
                >
                  <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
                  Falar no WhatsApp
                </a>
              </div>
            </aside>
          </>
        )}

        <div className={styles.principal}>
          {ocultarCabecalho ? (
            <p className={styles.contador}>
              {cursos.length} {cursos.length === 1 ? "curso encontrado" : "cursos encontrados"}
            </p>
          ) : (
            <header className={styles.cabecalho}>
              <h1 className={styles.titulo}>{titulo}</h1>
              <p className={styles.subtitulo}>
                {descricaoPagina ||
                  `${instituicao?.nome ? `${instituicao.nome} — ` : ""}${cursos.length} ${
                    cursos.length === 1 ? "curso disponível" : "cursos disponíveis"
                  }`}
              </p>
            </header>
          )}

          <BuscaCursosBar buscaInicial={busca || ""} ordemInicial={ordem} />

          {temFiltroAtivo && (
            <div className={styles.filtrosAtivos}>
              <span className={styles.filtrosLabel}>Filtros:</span>
              {categoriaAtual && (
                <Link href={hrefCategoria(null)} className={styles.pilula}>
                  Área: {categoriaAtual}
                  <i className="ph-bold ph-x" aria-hidden="true" />
                </Link>
              )}
              {!tipoFixo && tipoAtual && (
                <Link href={comParams({ tipo: null, pagina: null })} className={styles.pilula}>
                  {labelDoTipo(tipoAtual, tipos.find((t) => t.codigo === tipoAtual)?.label)}
                  <i className="ph-bold ph-x" aria-hidden="true" />
                </Link>
              )}
              {busca && (
                <Link href={comParams({ busca: null, pagina: null })} className={styles.pilula}>
                  “{busca}”
                  <i className="ph-bold ph-x" aria-hidden="true" />
                </Link>
              )}
              <Link href={basePath} className={styles.limpar}>
                Limpar tudo
              </Link>
            </div>
          )}

          {cursos.length === 0 ? (
            <CursosVazio
              icone={temFiltroAtivo ? "ph-magnifying-glass" : "ph-rocket-launch"}
              titulo={temFiltroAtivo ? "Nenhum curso com esses filtros" : "Vitrine em montagem"}
              mensagem={
                temFiltroAtivo
                  ? "Tente uma busca mais ampla, escolha outra área ou limpe os filtros para ver tudo o que está disponível."
                  : "Os cursos desta modalidade estão sendo cadastrados. Fale com a nossa equipe para saber das próximas turmas — respondemos rápido."
              }
              acaoPrimaria={
                temFiltroAtivo
                  ? { href: basePath, label: "Ver todos os cursos" }
                  : { href: "/areas", label: "Conhecer as áreas" }
              }
            />
          ) : (
            <>
              {catalogoPagina.length > 0 && (
                <div className={styles.grupo}>
                  <div className={styles.grade}>
                    {catalogoPagina.map((curso, i) => (
                      <CursoCard
                        key={curso.id}
                        curso={curso}
                        prioridade={i < 4}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                gerarHref={hrefPagina}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ListaCursos;
