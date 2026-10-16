import PageHero from "@/components/ui/PageHero";
import { site } from "@/content/site";
import styles from "./politica.module.css";

export const metadata = {
  title: "Política de Privacidade",
  description:
    "Como o CTA Boa Vista Cursos coleta, usa, armazena e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD), e os termos de uso do site.",
  alternates: { canonical: "/politica-privacidade" },
};

/**
 * Documento jurídico — a estrutura segue a LGPD (Lei 13.709/2018): quem trata, quais
 * dados, para quê, com quem compartilha, por quanto tempo guarda e como o titular
 * exerce os direitos dele.
 *
 * ⚠️ Revise com a assessoria jurídica do CTA antes de publicar em produção. O texto
 * é um ponto de partida sólido e específico para este site, mas nenhum modelo substitui
 * a revisão de quem responde legalmente pela empresa.
 */

const SECOES = [
  {
    id: "quem-somos",
    titulo: "1. Quem trata os seus dados",
    conteudo: [
      `Esta política se aplica ao site ${site.urlSite} e aos serviços da ${site.nomeLegal}, que atua sob o nome fantasia ${site.nomeFantasia}, inscrita no CNPJ ${site.cnpj}, com sede em ${site.endereco.linha}, ${site.endereco.bairro}, CEP ${site.endereco.cep}.`,
      `Para qualquer assunto relacionado a dados pessoais, o contato é ${site.email}.`,
    ],
  },
  {
    id: "dados",
    titulo: "2. Quais dados coletamos",
    conteudo: ["Coletamos apenas o necessário para cada finalidade:"],
    lista: [
      "Dados de contato que você informa voluntariamente (nome, e-mail, telefone/WhatsApp e o conteúdo da mensagem), quando você usa o formulário de contato ou fala com a gente pelos nossos canais.",
      "Dados de matrícula, quando você se inscreve em um curso — coletados e tratados no ambiente do nosso sistema acadêmico, que possui política própria de tratamento.",
      "Dados de navegação (páginas visitadas, tipo de dispositivo, navegador e origem do acesso), coletados de forma agregada para entender o uso do site e melhorá-lo.",
    ],
  },
  {
    id: "finalidades",
    titulo: "3. Para que usamos",
    lista: [
      "Responder ao seu contato e dar seguimento ao que você pediu.",
      "Informar sobre cursos, turmas e condições, quando você demonstrou interesse.",
      "Executar a matrícula e prestar o serviço educacional contratado.",
      "Emitir certificados e comprovar a sua conclusão quando solicitado.",
      "Cumprir obrigações legais e regulatórias aplicáveis à atividade educacional.",
      "Melhorar o site, a plataforma e a experiência de quem estuda com a gente.",
    ],
  },
  {
    id: "base-legal",
    titulo: "4. Com que base legal",
    conteudo: [
      "O tratamento se apoia nas hipóteses do art. 7º da LGPD, conforme o caso: o seu consentimento (ao enviar um formulário), a execução do contrato (matrícula e prestação do serviço), o cumprimento de obrigação legal e o legítimo interesse — este último sempre limitado ao que você razoavelmente espera de uma instituição de ensino com a qual você entrou em contato.",
    ],
  },
  {
    id: "compartilhamento",
    titulo: "5. Com quem compartilhamos",
    conteudo: [
      "Não vendemos e não cedemos os seus dados para terceiros fazerem publicidade. O compartilhamento acontece apenas quando é necessário para prestar o serviço:",
    ],
    lista: [
      "Com o sistema acadêmico e a plataforma de ensino que operam a sua matrícula, o seu curso e o seu certificado.",
      "Com o processador de pagamentos, quando você realiza uma compra — os dados financeiros trafegam diretamente para ele e não ficam armazenados neste site.",
      "Com a instituição parceira responsável pelo curso (UNIP, FAMAR ou Unicorp), quando você se matricula em um curso dela.",
      "Com autoridades públicas, quando houver determinação legal ou ordem judicial.",
    ],
  },
  {
    id: "armazenamento",
    titulo: "6. Por quanto tempo guardamos",
    conteudo: [
      "Dados de contato de quem não se matriculou são mantidos apenas enquanto durar o relacionamento comercial e o interesse manifestado, e são eliminados a pedido do titular a qualquer momento.",
      "Dados acadêmicos de alunos são mantidos pelos prazos exigidos pela legislação educacional, inclusive após o término do curso, para garantir a validação de certificados e o histórico do aluno.",
    ],
  },
  {
    id: "seguranca",
    titulo: "7. Como protegemos",
    conteudo: [
      "Adotamos medidas técnicas e administrativas para proteger os seus dados: tráfego criptografado (HTTPS) em todo o site, controle de acesso às informações por perfil, e restrição do acesso apenas a quem precisa dele para trabalhar.",
      "Nenhum sistema é infalível. Em caso de incidente de segurança que possa acarretar risco relevante aos titulares, comunicaremos os afetados e a Autoridade Nacional de Proteção de Dados (ANPD), como determina a lei.",
    ],
  },
  {
    id: "cookies",
    titulo: "8. Cookies",
    conteudo: [
      "Utilizamos cookies estritamente necessários ao funcionamento do site e, quando aplicável, cookies de medição de audiência para entender quais páginas são mais úteis.",
      "Você pode bloquear ou apagar cookies nas configurações do seu navegador. Bloquear os cookies necessários pode afetar o funcionamento de algumas partes do site.",
    ],
  },
  {
    id: "direitos",
    titulo: "9. Seus direitos",
    conteudo: ["Como titular dos dados, a LGPD garante a você o direito de:"],
    lista: [
      "Confirmar se tratamos dados seus e acessar esses dados.",
      "Corrigir dados incompletos, inexatos ou desatualizados.",
      "Solicitar a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei.",
      "Solicitar a portabilidade dos dados a outro fornecedor de serviço.",
      "Revogar o consentimento a qualquer momento.",
      "Ser informado sobre com quem compartilhamos os seus dados.",
    ],
    fecho: `Para exercer qualquer um desses direitos, escreva para ${site.email}. Responderemos no menor prazo possível, respeitando os limites legais aplicáveis.`,
  },
  {
    id: "menores",
    titulo: "10. Crianças e adolescentes",
    conteudo: [
      "Nossos cursos são destinados a maiores de 18 anos ou a menores devidamente representados pelos responsáveis legais. Não coletamos intencionalmente dados de crianças sem o consentimento específico de um dos pais ou responsável.",
    ],
  },
  {
    id: "alteracoes",
    titulo: "11. Alterações nesta política",
    conteudo: [
      "Podemos atualizar esta política para refletir mudanças na legislação ou nos nossos serviços. A data da última atualização fica sempre no início do documento. Mudanças relevantes serão comunicadas pelos nossos canais.",
    ],
  },
];

const Page = () => {
  return (
    <>
      <PageHero
        trilha={[{ label: "Política de Privacidade" }]}
        icone="ph-shield-check"
        titulo="Política de Privacidade"
        chamada="Como o CTA coleta, usa e protege os seus dados pessoais — em linguagem que dá para entender, conforme a Lei Geral de Proteção de Dados."
      />

      <article className={styles.documento}>
        <div className="container-estreito">
          <div className={styles.meta}>
            <span>
              <i className="ph-bold ph-calendar-blank" aria-hidden="true" />
              Última atualização: agosto de 2026
            </span>
            <span>
              <i className="ph-bold ph-scales" aria-hidden="true" />
              Lei nº 13.709/2018 (LGPD)
            </span>
          </div>

          <nav className={styles.indice} aria-label="Índice do documento">
            <p className={styles.indiceTitulo}>Neste documento</p>
            <ol>
              {SECOES.map((secao) => (
                <li key={secao.id}>
                  <a href={`#${secao.id}`}>{secao.titulo}</a>
                </li>
              ))}
            </ol>
          </nav>

          {SECOES.map((secao) => (
            <section key={secao.id} id={secao.id} className={styles.secao}>
              <h2>{secao.titulo}</h2>
              {secao.conteudo?.map((paragrafo, i) => (
                <p key={i}>{paragrafo}</p>
              ))}
              {secao.lista && (
                <ul>
                  {secao.lista.map((item, i) => (
                    <li key={i}>
                      <i className="ph-fill ph-check-circle" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {secao.fecho && <p>{secao.fecho}</p>}
            </section>
          ))}

          <aside className={styles.contato}>
            <i className="ph-fill ph-envelope-simple" aria-hidden="true" />
            <div>
              <h2>Dúvidas sobre os seus dados?</h2>
              <p>
                Escreva para <a href={`mailto:${site.email}`}>{site.email}</a> ou fale com a gente
                pelo telefone <a href={site.telefoneLink}>{site.telefone}</a>.
              </p>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
};

export default Page;
