# {N.M} — {título curto}

**Status:** Rascunho · @sm · {dd/mm/aaaa}
**Vem de:** {PRD/épico, seção} · **parte de:** `{branch}@{sha7}`

## Por quê

{Quem precisa, o que precisa e o que ganha com isso, em duas ou três frases.}

## Pronto quando

1. **Dado** {situação}, **quando** {ação}, **então** {resultado que dá pra conferir}.
2. 

## Não entra

- 

## Precisa antes

- 

## Regras que esta story respeita

- 

## Mapa do terreno

> Conferido por quem escreveu. Quem implementa parte daqui e não sai procurando de novo.

| Onde | O que tem lá | O que muda |
|---|---|---|
| `{arquivo}` | {função, rota, tabela} | {mudança} |

Notas de exploração: `.forja/exploracao/{N.M}.md`.

## Riscos

- {risco} → {proteção}

## Janelas de trabalho

> Cada janela é um @dev novo, com **uma tarefa pesada** e teto de ~180k de contexto.

### Janela A — {nome}

- [ ] A1 {tarefa} → critério {n}

### Janela B — {nome}

- [ ] B1 {tarefa} → critério {n}

## Como provar

- Onde observar o comportamento (interface pública): {…}
- Teste um arquivo por vez, em primeiro plano: `{comando} {arquivo} --maxWorkers=1 --no-file-parallelism`
- Fecha com: tipos, lint, testes da story, build.

## Diário das janelas

### Janela A — @dev — {data}

- Arquivos:
- Criei e quem deve usar:
- Decidi sozinho: `[DECIDI SOZINHO] {dúvida} → {escolha} (motivo)`
- Testes:
- Contexto no fim da janela: ~{k}

## Revisão

Gate: `docs/qa/gates/{N.M}-{slug}.yml` · veredito: {…}

## Histórico

- {data} · @sm · rascunho
