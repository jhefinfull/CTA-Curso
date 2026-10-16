import Link from "next/link";
import styles from "./Button.module.css";

/**
 * Botão único do site. Renderiza <Link> pra rota interna, <a> pra link externo e
 * <button> quando não há destino — assim o estilo nunca precisa ser recriado só porque
 * o elemento mudou (foi o que espalhou cinco estilos de botão pelo site antigo).
 */
const Button = ({
  href,
  children,
  variant = "primario",
  tamanho = "md",
  icone,
  iconeAntes,
  externo = false,
  className = "",
  ...rest
}) => {
  const classes = [styles.botao, styles[variant], styles[tamanho], className]
    .filter(Boolean)
    .join(" ");

  const conteudo = (
    <>
      {iconeAntes && <i className={`ph-bold ${iconeAntes}`} aria-hidden="true" />}
      <span>{children}</span>
      {icone && <i className={`ph-bold ${icone} ${styles.iconeDepois}`} aria-hidden="true" />}
    </>
  );

  if (href && (externo || /^(https?:|mailto:|tel:)/.test(href))) {
    return (
      <a
        href={href}
        className={classes}
        target={externo ? "_blank" : undefined}
        rel={externo ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {conteudo}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {conteudo}
    </button>
  );
};

export default Button;
