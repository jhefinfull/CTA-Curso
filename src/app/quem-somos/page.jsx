import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import Counter from "@/components/ui/Counter";
import { linkWhatsapp, site } from "@/content/site";
import { buscarVitrine } from "@/lib/vitrine";
import { listarAreas } from "@/config/areas";
import styles from "./quem-somos.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sobre nós",
  description:
    "Conheça o CTA Boa Vista Cursos: cursos presenciais e online, do EJA à pós-graduação, com parcerias com instituições reconhecidas nacionalmente, no Centro de Boa Vista/RR.",
  alternates: { canonical: "/quem-somos" },
};

const VALORES = [
  {
    icone: "ph-target",
    cor: "azul",
    titulo: "Conteúdo atualizado e prático",
    texto:
      "Cursos alinhados às exigências do mundo de hoje, para quem quer entrar no mercado, ser recolocado ou crescer na carreira.",
  },
  {
    icone: "ph-hand-heart",
    cor: "verde",
    titulo: "Orientação de verdade",
    texto:
      "A gente não vende só curso: orienta, apoia e oferece as melhores condições para você dar o próximo passo na sua jornada.",
  },
  {
    icone: "ph-calendar-check",
    cor: "amarelo",
    titulo: "Flexibilidade de horários",
    texto:
      "Turmas presenciais de manhã, de tarde e à noite, e plataformas intuitivas para quem estuda a distância.",
  },
  {
    icone: "ph-buildings",
    cor: "laranja",
    titulo: "Parcerias reconhecidas",
    texto:
      "Graduação, técnico e pós-graduação com instituições reconhecidas nacionalmente, como UNIP, FAMAR e Unicorp Faculdades.",
  },
];

const Page = async () => {
  const { facetas, total } = await buscarVitrine();
  const areas = listarAreas(facetas.categorias);
  const numeros = [
    ...(total >= 20 ? [{ valor: Math.floor(total / 10) * 10, sufixo: "+", label: "opções de curso", icone: "ph-stack" }] : []),
    { valor: 3, sufixo: "", label: "instituições parceiras", icone: "ph-buildings" },
    { valor: 5, sufixo: "", label: "horários de aula presencial", icone: "ph-clock" },
    { valor: 24, sufixo: " h", label: "para a equipe retornar o contato", icone: "ph-chats-circle" },
  ];

  return (
    <>
      <PageHero
        trilha={[{ label: "Sobre nós" }]}
        icone="ph-buildings"
        titulo="Somos o CTA Boa Vista Cursos"
        chamada="Uma empresa do setor educacional que acredita no poder da educação como ferramenta de transformação de vidas, com cursos online e presenciais no Centro de Boa Vista."
      />

      {/* ─── Manifesto ─────────────────────────────────────────────────────── */}
      <section className={styles.manifesto}>
        <div className={`container ${styles.manifestoGrade}`}>
          <div className={styles.manifestoTexto}>
            <span className={styles.olho}>
              <i className="ph-bold ph-flag" aria-hidden="true" />
              Nossa razão de existir
            </span>

            <h2 className={styles.tituloGrande}>
              Não vendemos apenas cursos: criamos <span className="texto-marca">pontes</span> entre sonhos e realizações.
            </h2>

            <div className={styles.paragrafos}>
              <p>
                No CTA Boa Vista Cursos, acreditamos no poder da educação como ferramenta de
                transformação de vidas. Oferecemos oportunidades acessíveis e de qualidade por meio
                de cursos online e presenciais, com parcerias estratégicas com instituições
                reconhecidas nacionalmente.
              </p>
              <p>
                Nosso foco é atender jovens que estão concluindo ou ingressando no Ensino Médio,
                profissionais em busca de recolocação ou crescimento na carreira e pessoas que
                desejam conquistar uma qualificação profissional sólida e reconhecida no mercado.
              </p>
              <p>
                São cursos profissionalizantes, EJA, técnicos, de graduação (bacharelado,
                tecnológicos e licenciaturas) e de pós-graduação, sempre com conteúdo atualizado e
                prático. Com plataformas intuitivas, flexibilidade de horários e suporte
                pedagógico especializado, incentivamos cada aluno a construir o próprio caminho de
                sucesso. Estude mais, alcance mais — conte conosco!
              </p>
            </div>

            <div className={styles.acoes}>
              <Button href="/cursos" icone="ph-arrow-right">
                Conhecer os cursos
              </Button>
              <Button href="/contato" variant="contorno" iconeAntes="ph-chat-circle-dots">
                Fale conosco
              </Button>
            </div>
          </div>

          <aside className={styles.identidade}>
            <div className={styles.identidadeCartao}>
              <h3>
                <i className="ph-bold ph-compass" aria-hidden="true" />
                Missão
              </h3>
              <p>{site.missao}</p>
            </div>

            <div className={styles.identidadeCartao}>
              <h3>
                <i className="ph-bold ph-eye" aria-hidden="true" />
                Visão
              </h3>
              <p>
                Ser a ponte entre quem quer estudar em Roraima e a formação que abre portas, do
                Ensino Médio à especialização.
              </p>
            </div>

            <div className={styles.identidadeCartao}>
              <h3>
                <i className="ph-bold ph-heart" aria-hidden="true" />
                Valores
              </h3>
              <p>
                Orientação, apoio, conteúdo atualizado e as melhores condições para cada aluno dar
                o próximo passo.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── Números ───────────────────────────────────────────────────────── */}
      <section className={styles.numeros}>
        <div className={`container ${styles.numerosGrade}`}>
          {numeros.map((stat) => (
            <div key={stat.label}>
              <i className={`ph-bold ${stat.icone}`} aria-hidden="true" />
              <strong>
                <Counter valor={stat.valor} sufixo={stat.sufixo} />
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Valores ───────────────────────────────────────────────────────── */}
      <section className={styles.valores}>
        <div className="container">
          <SectionHeading
            olho="No que acreditamos"
            icone="ph-compass-tool"
            titulo="O que guia o nosso trabalho"
            subtitulo="É o que define os cursos que oferecemos, as parcerias que fazemos e como a gente atende você."
          />

          <div className={styles.valoresGrade}>
            {VALORES.map((valor) => (
              <article key={valor.titulo} className={`${styles.valorCartao} ${styles[valor.cor]}`}>
                <span className={styles.valorIcone}>
                  <i className={`ph-bold ${valor.icone}`} aria-hidden="true" />
                </span>
                <h3>{valor.titulo}</h3>
                <p>{valor.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── O que ensinamos ───────────────────────────────────────────────── */}
      <section className={styles.areas}>
        <div className="container">
          <SectionHeading
            olho="O que ensinamos"
            icone="ph-squares-four"
            titulo={areas.length > 0 ? `${areas.length} áreas de formação` : "Áreas de formação"}
            subtitulo="Os cursos da nossa loja se organizam por área — e esta lista vem direto da plataforma, então é exatamente o que está disponível agora."
            tema="escuro"
          />

          <div className={styles.areasGrade}>
            {areas.slice(0, 9).map((area) => (
              <Link key={area.slug} href={`/areas/${area.slug}`} className={styles.areaCartao}>
                <i className={`ph-bold ${area.icone}`} aria-hidden="true" />
                <div>
                  <strong>{area.nome}</strong>
                  <small>
                    {area.total} {area.total === 1 ? "curso disponível" : "cursos disponíveis"}
                  </small>
                </div>
                <i className={`ph-bold ph-arrow-right ${styles.areaSeta}`} aria-hidden="true" />
              </Link>
            ))}
            {areas.length > 9 && (
              <Link href="/areas" className={styles.areaCartao}>
                <i className="ph-bold ph-dots-three-outline" aria-hidden="true" />
                <div>
                  <strong>Mais {areas.length - 9} áreas</strong>
                  <small>ver a lista completa</small>
                </div>
                <i className={`ph-bold ph-arrow-right ${styles.areaSeta}`} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── Dados institucionais ──────────────────────────────────────────── */}
      <section className={styles.institucional}>
        <div className={`container ${styles.institucionalGrade}`}>
          <div>
            <SectionHeading
              olho="Dados institucionais"
              icone="ph-identification-card"
              titulo="Transparência começa por saber com quem você fala"
              alinhamento="esquerda"
            />

            <dl className={styles.dados}>
              <div>
                <dt>Instituição</dt>
                <dd>{site.nomeLegal}</dd>
              </div>
              <div>
                <dt>Nome fantasia</dt>
                <dd>{site.nomeFantasia}</dd>
              </div>
              <div>
                <dt>CNPJ</dt>
                <dd>{site.cnpj}</dd>
              </div>
              <div>
                <dt>Endereço</dt>
                <dd>
                  {site.endereco.linha}
                  <br />
                  {site.endereco.bairro} — CEP {site.endereco.cep}
                </dd>
              </div>
              <div>
                <dt>Atendimento</dt>
                <dd>{site.horario}</dd>
              </div>
              <div>
                <dt>Telefone</dt>
                <dd>
                  <a href={site.telefoneLink}>{site.telefone}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer">
                    {site.whatsappExibicao}
                  </a>
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
            </dl>
          </div>

          <div className={styles.contatoCartao}>
            <i className="ph-fill ph-chat-teardrop-dots" aria-hidden="true" />
            <h2>Quer conversar com a gente?</h2>
            <p>
              Dúvida sobre curso, matrícula, horário ou certificado: a nossa equipe responde no
              WhatsApp, de segunda a sexta, das 8h às 12h e das 14h às 18h.
            </p>
            <div className={styles.contatoAcoes}>
              <Button href="/contato" variant="claro" icone="ph-arrow-right">
                Fale conosco
              </Button>
              <Button
                href={linkWhatsapp()}
                variant="fantasma"
                iconeAntes="ph-whatsapp-logo"
                externo
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
