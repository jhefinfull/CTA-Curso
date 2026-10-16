import Button from "@/components/ui/Button";
import { linkWhatsapp } from "@/content/site";
import styles from "./CursosVazio.module.css";

/**
 * Estado vazio das listagens de curso.
 *
 * Três situações caem aqui e o visitante não deve conseguir distinguir: filtro sem
 * resultado, vitrine ainda sem curso publicado e API fora do ar. Em todas, o que ele
 * precisa é de uma saída — por isso o bloco sempre oferece um caminho (limpar filtro,
 * ver tudo, falar no WhatsApp) em vez de só informar a ausência.
 */
const CursosVazio = ({
  titulo = "Nenhum curso encontrado",
  mensagem = "Não achamos cursos com esses filtros. Tente uma busca mais ampla ou fale com a nossa equipe.",
  icone = "ph-magnifying-glass",
  acaoPrimaria,
  mensagemWhatsapp = "Olá! Não encontrei o curso que procuro no site. Podem me ajudar?",
}) => {
  return (
    <div className={styles.bloco}>
      <span className={styles.icone}>
        <i className={`ph-bold ${icone}`} aria-hidden="true" />
      </span>

      <h2 className={styles.titulo}>{titulo}</h2>
      <p className={styles.mensagem}>{mensagem}</p>

      <div className={styles.acoes}>
        {acaoPrimaria && (
          <Button href={acaoPrimaria.href} variant="primario" icone="ph-arrow-right">
            {acaoPrimaria.label}
          </Button>
        )}
        <Button
          href={linkWhatsapp(mensagemWhatsapp)}
          variant="contorno"
          iconeAntes="ph-whatsapp-logo"
          externo
        >
          Falar no WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default CursosVazio;
