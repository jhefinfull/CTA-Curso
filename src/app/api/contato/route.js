import { NextResponse } from "next/server";

/**
 * Recebe o formulário de contato do site.
 *
 * Entrega: se `CONTATO_WEBHOOK_URL` estiver configurada, o lead é encaminhado para lá
 * (Google Apps Script, Make, n8n, Zapier, CRM — qualquer endpoint que aceite JSON).
 * Sem webhook, a rota responde `entregue: "fallback"` e o formulário no navegador
 * assume o WhatsApp como canal — de propósito: responder "enviado com sucesso" e
 * jogar o lead no log do servidor seria perder o contato sem ninguém perceber.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEBHOOK = process.env.CONTATO_WEBHOOK_URL;

const ASSUNTOS_VALIDOS = new Set([
  "curso",
  "matricula",
  "certificado",
  "empresa",
  "suporte",
  "outro",
]);

// Rate limit simples por IP, em memória. Não sobrevive a restart nem é compartilhado
// entre instâncias — é uma barreira contra o script bobo que envia 200 vezes, não
// contra ataque coordenado (esse é papel do WAF/CDN na frente).
const JANELA_MS = 10 * 60 * 1000;
const MAX_ENVIOS = 5;
const envios = new Map();

function excedeuLimite(ip) {
  const agora = Date.now();
  const registros = (envios.get(ip) || []).filter((t) => agora - t < JANELA_MS);

  if (registros.length >= MAX_ENVIOS) {
    envios.set(ip, registros);
    return true;
  }

  registros.push(agora);
  envios.set(ip, registros);

  // Poda oportunista: sem isso o Map cresce para sempre num processo longo.
  if (envios.size > 5000) {
    for (const [chave, marcas] of envios) {
      if (marcas.every((t) => agora - t >= JANELA_MS)) envios.delete(chave);
    }
  }

  return false;
}

function limpar(valor, max = 500) {
  return String(valor ?? "").trim().slice(0, max);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request) {
  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ ok: false, erro: "Requisição inválida." }, { status: 400 });
  }

  // Campo escondido no formulário: humano nunca preenche, robô preenche quase sempre.
  // Responde 200 de propósito — dizer "bloqueado" ensina o robô a tentar de novo.
  if (limpar(corpo.website)) {
    return NextResponse.json({ ok: true, entregue: "descartado" });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "desconhecido";

  if (excedeuLimite(ip)) {
    return NextResponse.json(
      { ok: false, erro: "Muitos envios seguidos. Tente novamente em alguns minutos." },
      { status: 429 }
    );
  }

  const dados = {
    nome: limpar(corpo.nome, 120),
    email: limpar(corpo.email, 160).toLowerCase(),
    telefone: limpar(corpo.telefone, 40),
    assunto: ASSUNTOS_VALIDOS.has(corpo.assunto) ? corpo.assunto : "outro",
    mensagem: limpar(corpo.mensagem, 2000),
    origem: limpar(corpo.origem, 200) || "site",
  };

  const erros = {};
  if (dados.nome.length < 3) erros.nome = "Informe seu nome completo.";
  if (!EMAIL_RE.test(dados.email)) erros.email = "Informe um e-mail válido.";
  if (dados.telefone.replace(/\D/g, "").length < 10) {
    erros.telefone = "Informe um telefone com DDD.";
  }
  if (dados.mensagem.length < 10) erros.mensagem = "Conte um pouco mais sobre a sua dúvida.";

  if (Object.keys(erros).length > 0) {
    return NextResponse.json({ ok: false, erros }, { status: 400 });
  }

  const registro = {
    ...dados,
    recebidoEm: new Date().toISOString(),
    userAgent: request.headers.get("user-agent")?.slice(0, 200) || "",
  };

  if (!WEBHOOK) {
    console.warn(
      "[contato] CONTATO_WEBHOOK_URL não configurada — lead devolvido para o fallback de WhatsApp."
    );
    return NextResponse.json({ ok: true, entregue: "fallback" });
  }

  try {
    const resposta = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registro),
      // Webhook lento não pode segurar a resposta do formulário indefinidamente.
      signal: AbortSignal.timeout(8000),
    });

    if (!resposta.ok) throw new Error(`webhook respondeu ${resposta.status}`);

    return NextResponse.json({ ok: true, entregue: "webhook" });
  } catch (erro) {
    console.error("[contato] falha ao entregar o lead:", erro.message);
    // O visitante não tem culpa da integração — devolve o fallback em vez de erro.
    return NextResponse.json({ ok: true, entregue: "fallback" });
  }
}
