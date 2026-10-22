import Link from "next/link";
import Image from "next/image";
import {
  formatarPreco,
  gradienteDaMarca,
  iniciaisDoCurso,
} from "@/utils/cursoDisplay";
import { ehAreaDeFormacao, iconeDaArea } from "@/config/areas";
import { labelDoTipo } from "@/config/tiposCurso";
import { site } from "@/content/site";
import styles from "./CursoCard.module.css";

/**
 * Card de curso — o MESMO na home, na listagem, na página de área e nos relacionados.
 * Serve para os dois tipos de curso do site: o da loja (vai para /curso/<id>, com a
 * matrícula online) e o do CTA que ainda não está na loja (vai para /curso-cta/<slug>,
 * com o WhatsApp) — este traz `rota`, `whatsapp` e `precoTexto`.
 *
 * A API devolve `imagemUrl: null` com frequência (curso sem foto cadastrada), então a
 * capa de fallback não é um caso de erro: é metade dos cards. Por isso ela é desenhada
 * com a paleta da marca e a inicial do curso, em vez de um placeholder cinza.
 */
const CursoCard = ({ curso, destaque = false, prioridade = false }) => {
  const preco = formatarPreco(curso.preco);
  const temPromo = curso.preco?.promo && curso.preco?.valorOriginal > curso.preco?.valor;
  // A área do curso quando a escola preencheu; senão, o nome da modalidade — nunca o
  // subtipo ("Subsequente") que a API manda no lugar da área que falta.
  const rotuloArea = curso.whatsapp
    ? curso.rotulo
    : ehAreaDeFormacao(curso.subcategoria)
      ? curso.subcategoria
      : labelDoTipo(curso.tipo, curso.tipoLabel);

  return (
    <Link
      href={curso.rota || `/curso/${curso.id}`}
      className={`${styles.cartao} ${destaque ? styles.destaque : ""}`}
    >
      <div className={styles.capa}>
        {curso.imagemUrl ? (
          <Image
            src={curso.imagemUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            style={{ objectFit: "cover" }}
            priority={prioridade}
          />
        ) : (
          <div className={styles.capaVazia} style={{ background: gradienteDaMarca(curso.titulo) }}>
            <span className={styles.iniciais}>{iniciaisDoCurso(curso.titulo)}</span>
            <i className={`ph-bold ${iconeDaArea(curso.subcategoria)}`} aria-hidden="true" />
          </div>
        )}

        <div className={styles.selos}>
          {curso.ehProprio && (
            <span className={`${styles.selo} ${styles.seloProprio}`}>
              <i className="ph-fill ph-seal-check" aria-hidden="true" />
              {site.nome}
            </span>
          )}
          {temPromo && (
            <span className={`${styles.selo} ${styles.seloPromo}`}>
              <i className="ph-fill ph-fire" aria-hidden="true" />
              Promoção
            </span>
          )}
          {curso.semVaga && <span className={`${styles.selo} ${styles.seloEsgotado}`}>Sem vaga</span>}
          {curso.whatsapp && curso.instituicao && curso.instituicao !== "CTA" && (
            <span className={styles.selo}>{curso.instituicao}</span>
          )}
        </div>
      </div>

      <div className={styles.corpo}>
        {rotuloArea && (
          <div className={styles.meta}>
            <span className={styles.area}>{rotuloArea}</span>
          </div>
        )}

        <h3 className={styles.titulo}>{curso.titulo}</h3>

        {(curso.chamada || curso.resumo) && (
          <p className={styles.resumo}>{curso.chamada || curso.resumo}</p>
        )}

        <div className={styles.rodape}>
          {preco ? (
            <span className={styles.preco}>
              {temPromo && (
                <s className={styles.precoAntigo}>
                  {curso.preco.valorOriginal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </s>
              )}
              {preco}
            </span>
          ) : curso.whatsapp ? (
            <span className={styles.precoWhats}>
              <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
              {curso.precoTexto || "Informações no WhatsApp"}
            </span>
          ) : (
            <span className={styles.precoConsultar}>Consulte valores</span>
          )}

          <span className={styles.acao} aria-hidden="true">
            <i className="ph-bold ph-arrow-right" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CursoCard;
