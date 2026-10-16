/**
 * Depoimentos de alunos.
 *
 * PROPOSITALMENTE VAZIO. Depoimento é declaração atribuída a uma pessoa real: inventar
 * um é propaganda enganosa e, se o nome existir, uso indevido de imagem. A seção da home
 * só aparece quando este arquivo tem entradas — então nada quebra enquanto ela está vazia.
 *
 * Para publicar, colete a autorização por escrito (basta uma mensagem do aluno dizendo
 * que autoriza o uso do depoimento e do primeiro nome) e acrescente:
 *
 *   {
 *     nome: "Ana Paula",              // primeiro nome basta; sobrenome só com autorização
 *     cargo: "Analista de Dados",     // onde ela chegou / o que faz hoje
 *     curso: "Pós-Graduação em Ciência de Dados",
 *     texto: "…",                     // palavras da pessoa, sem reescrever
 *     foto: "/imagens/depoimentos/ana.jpg", // opcional — sem foto usa a inicial
 *     nota: 5,                        // opcional, 1 a 5
 *   }
 */
export const DEPOIMENTOS = [];

export const TEM_DEPOIMENTOS = DEPOIMENTOS.length > 0;
