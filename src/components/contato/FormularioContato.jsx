"use client";

import { useState } from "react";
import { linkWhatsapp, site } from "@/content/site";
import styles from "./FormularioContato.module.css";

const ASSUNTOS = [
  { valor: "curso", label: "Dúvida sobre um curso" },
  { valor: "matricula", label: "Matrícula e pagamento" },
  { valor: "certificado", label: "Certificado" },
  { valor: "empresa", label: "Capacitação para minha empresa" },
  { valor: "suporte", label: "Suporte ao aluno" },
  { valor: "outro", label: "Outro assunto" },
];

const INICIAL = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "curso",
  mensagem: "",
  website: "", // honeypot
};

/** Máscara de telefone brasileiro aplicada enquanto digita. */
function mascararTelefone(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

const FormularioContato = ({ assuntoInicial }) => {
  const [dados, setDados] = useState({ ...INICIAL, assunto: assuntoInicial || INICIAL.assunto });
  const [erros, setErros] = useState({});
  const [estado, setEstado] = useState("parado"); // parado | enviando | webhook | fallback | erro
  const [erroGeral, setErroGeral] = useState("");

  const alterar = (campo) => (evento) => {
    const valor = campo === "telefone" ? mascararTelefone(evento.target.value) : evento.target.value;
    setDados((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const mensagemWhatsapp = () => {
    const assunto = ASSUNTOS.find((a) => a.valor === dados.assunto)?.label || "Contato";
    return [
      `Olá! Vim pelo site do CTA.`,
      ``,
      `*Assunto:* ${assunto}`,
      `*Nome:* ${dados.nome || "(não informado)"}`,
      `*E-mail:* ${dados.email || "(não informado)"}`,
      ``,
      dados.mensagem || "(sem mensagem)",
    ].join("\n");
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setEstado("enviando");
    setErros({});
    setErroGeral("");

    try {
      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dados,
          origem: typeof window !== "undefined" ? window.location.pathname : "site",
        }),
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        if (resultado.erros) setErros(resultado.erros);
        else setErroGeral(resultado.erro || "Não foi possível enviar. Tente novamente.");
        setEstado("erro");
        return;
      }

      setEstado(resultado.entregue === "webhook" ? "webhook" : "fallback");
    } catch {
      setErroGeral(
        "Não conseguimos falar com o servidor. Verifique sua conexão ou fale com a gente pelo WhatsApp."
      );
      setEstado("erro");
    }
  };

  // ─── Sucesso via webhook: o lead chegou no destino configurado ──────────────
  if (estado === "webhook") {
    return (
      <div className={styles.resultado}>
        <span className={`${styles.resultadoIcone} ${styles.sucesso}`}>
          <i className="ph-fill ph-check-circle" aria-hidden="true" />
        </span>
        <h2>Mensagem enviada!</h2>
        <p>
          Recebemos o seu contato, {dados.nome.split(" ")[0]}. Nossa equipe responde em até um dia
          útil no e-mail <strong>{dados.email}</strong>.
        </p>
        <p className={styles.resultadoNota}>
          Precisa de resposta agora? Chame no WhatsApp — costuma ser mais rápido.
        </p>
        <div className={styles.resultadoAcoes}>
          <a
            href={linkWhatsapp(mensagemWhatsapp())}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.botaoWhats}
          >
            <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
            Falar no WhatsApp
          </a>
          <button
            type="button"
            className={styles.botaoSecundario}
            onClick={() => {
              setDados(INICIAL);
              setEstado("parado");
            }}
          >
            Enviar outra mensagem
          </button>
        </div>
      </div>
    );
  }

  // ─── Sem canal de destino configurado: entrega pelo WhatsApp, com tudo pronto ─
  if (estado === "fallback") {
    return (
      <div className={styles.resultado}>
        <span className={`${styles.resultadoIcone} ${styles.atencao}`}>
          <i className="ph-fill ph-paper-plane-tilt" aria-hidden="true" />
        </span>
        <h2>Falta um clique</h2>
        <p>
          Deixamos a sua mensagem pronta no WhatsApp — é só tocar no botão abaixo e enviar. Assim
          você já fala direto com a nossa equipe e não corre risco de a mensagem se perder.
        </p>
        <div className={styles.resultadoAcoes}>
          <a
            href={linkWhatsapp(mensagemWhatsapp())}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.botaoWhats}
          >
            <i className="ph-bold ph-whatsapp-logo" aria-hidden="true" />
            Abrir no WhatsApp
          </a>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("Contato pelo site")}&body=${encodeURIComponent(mensagemWhatsapp())}`}
            className={styles.botaoSecundario}
          >
            Enviar por e-mail
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={enviar} noValidate>
      <div className={styles.linha}>
        <div className={styles.campo}>
          <label htmlFor="nome">
            Nome completo <span aria-hidden="true">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={dados.nome}
            onChange={alterar("nome")}
            autoComplete="name"
            aria-invalid={Boolean(erros.nome)}
            aria-describedby={erros.nome ? "erro-nome" : undefined}
            placeholder="Como podemos te chamar?"
            required
          />
          {erros.nome && (
            <span id="erro-nome" className={styles.erro}>
              {erros.nome}
            </span>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="email">
            E-mail <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={dados.email}
            onChange={alterar("email")}
            autoComplete="email"
            aria-invalid={Boolean(erros.email)}
            aria-describedby={erros.email ? "erro-email" : undefined}
            placeholder="seu@email.com"
            required
          />
          {erros.email && (
            <span id="erro-email" className={styles.erro}>
              {erros.email}
            </span>
          )}
        </div>
      </div>

      <div className={styles.linha}>
        <div className={styles.campo}>
          <label htmlFor="telefone">
            WhatsApp / telefone <span aria-hidden="true">*</span>
          </label>
          <input
            id="telefone"
            name="telefone"
            type="tel"
            inputMode="numeric"
            value={dados.telefone}
            onChange={alterar("telefone")}
            autoComplete="tel"
            aria-invalid={Boolean(erros.telefone)}
            aria-describedby={erros.telefone ? "erro-telefone" : undefined}
            placeholder="(61) 90000-0000"
            required
          />
          {erros.telefone && (
            <span id="erro-telefone" className={styles.erro}>
              {erros.telefone}
            </span>
          )}
        </div>

        <div className={styles.campo}>
          <label htmlFor="assunto">Assunto</label>
          <select id="assunto" name="assunto" value={dados.assunto} onChange={alterar("assunto")}>
            {ASSUNTOS.map((assunto) => (
              <option key={assunto.valor} value={assunto.valor}>
                {assunto.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="mensagem">
          Mensagem <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={5}
          value={dados.mensagem}
          onChange={alterar("mensagem")}
          aria-invalid={Boolean(erros.mensagem)}
          aria-describedby={erros.mensagem ? "erro-mensagem" : undefined}
          placeholder="Conte o que você precisa. Quanto mais detalhe, melhor conseguimos ajudar."
          required
        />
        {erros.mensagem && (
          <span id="erro-mensagem" className={styles.erro}>
            {erros.mensagem}
          </span>
        )}
      </div>

      {/* Honeypot: escondido de gente, visível para robô. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={dados.website}
          onChange={alterar("website")}
        />
      </div>

      {erroGeral && (
        <p className={styles.erroGeral} role="alert">
          <i className="ph-fill ph-warning-circle" aria-hidden="true" />
          {erroGeral}
        </p>
      )}

      <div className={styles.rodape}>
        <button type="submit" className={styles.enviar} disabled={estado === "enviando"}>
          {estado === "enviando" ? (
            <>
              <span className={styles.girando} aria-hidden="true" />
              Enviando…
            </>
          ) : (
            <>
              Enviar mensagem
              <i className="ph-bold ph-paper-plane-tilt" aria-hidden="true" />
            </>
          )}
        </button>

        <p className={styles.privacidade}>
          Ao enviar, você concorda com a nossa{" "}
          <a href="/politica-privacidade">Política de Privacidade</a>. Usamos os seus dados apenas
          para responder este contato.
        </p>
      </div>
    </form>
  );
};

export default FormularioContato;
