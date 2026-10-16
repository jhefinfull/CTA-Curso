import { NextResponse } from "next/server";
import { fetchGsdCursos, fetchGsdInfo, gsdBaseUrl, gsdTokenConfigurado } from "@/lib/gsdApi";

/**
 * Diagnóstico da integração com o sistema acadêmico.
 *
 * Existe porque "o site não mostra curso nenhum" tem três causas muito diferentes —
 * token ausente, API fora do ar e loja sem curso publicado — e da tela do site as três
 * são idênticas. Aqui elas se separam em uma requisição.
 *
 * NÃO devolve o token nem nada derivado dele; só o que já é público na loja.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const inicio = Date.now();

  if (!gsdTokenConfigurado()) {
    return NextResponse.json(
      {
        ok: false,
        diagnostico: "TOKEN_AUSENTE",
        mensagem:
          "GSD_API_TOKEN não está configurado no ambiente. Gere o token no painel da escola (Configurações › API do site) e defina a variável no deploy.",
        baseUrl: gsdBaseUrl(),
      },
      { status: 503 }
    );
  }

  const info = await fetchGsdInfo();

  if (!info) {
    return NextResponse.json(
      {
        ok: false,
        diagnostico: "SEM_RESPOSTA",
        mensagem:
          "A API não respondeu ou recusou o token. Confira se o token continua ativo e se a base configurada é a da escola.",
        baseUrl: gsdBaseUrl(),
      },
      { status: 502 }
    );
  }

  const vitrine = await fetchGsdCursos();

  return NextResponse.json({
    ok: true,
    diagnostico: vitrine.total > 0 ? "OK" : "VITRINE_VAZIA",
    mensagem:
      vitrine.total > 0
        ? "Integração ativa e com cursos publicados."
        : "Conexão certa, mas a loja da escola não tem nenhum curso publicado — por isso o site mostra os estados vazios.",
    instituicao: info.instituicao ?? null,
    baseUrl: gsdBaseUrl(),
    totalCursos: vitrine.total,
    tipos: vitrine.facetas.tipos,
    areas: vitrine.facetas.categorias.map((c) => c.nome),
    tempoMs: Date.now() - inicio,
  });
}
