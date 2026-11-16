# Changelog

## 0.4.2 — 2026-11-16

- Teto da janela do `@dev` cai de ~180k para ~150k (`coordenar`, `fatiar`, `dev`). Medido na story F1.0a do WL
  analista: N-b com ~195k de pico (374k tokens), E-b ~190k, E ~180k, por escopo grande e leitura repetida de arquivos
  de 5–6 mil linhas, mais uma janela refeita por corte por intervalo de linhas.
- `coordenar`: medir o peso antes de disparar (mais de ~30 arquivos ou arquivo acima de ~1.500 linhas → dividir antes);
  nunca dois cortes numa janela; regras de paralelo na mesma cópia do repo; stage vazio e `git add` por caminho antes
  de cada commit do coordenador (um commit de docs levou exclusões de outra janela).
- `dev`: arquivo grande só por `rg` e trecho; saída de teste/tsc/lint filtrada; edição trecho a trecho, nunca por
  intervalo de linhas.

## 0.4.1 — 2026-11-15

- `forja-faixa` 0.3.1: "Sessão" só aparece quando a conta tem limite de 5h (Max e Pro); no Ultra some.

## 0.4.0 — 2026-11-15

- `forja-faixa` 0.3.0: mostra o plano da assinatura (Claude Ultra, Claude Max 20x, Pro…) no começo da linha; relê quando
  a conta muda.

## 0.3.0 — 2026-11-15

- `forja-faixa` 0.2.0: linha em todo projeto com sessão (5h) e semana da assinatura com a hora que renovam
  (Brasília), memória da conversa, custo da sessão e agentes rodando; a linha do FORJA segue só com `.forja/`.

## 0.2.0 — 2026-11-15

- Plugin `forja-faixa`: linha acima do prompt com a story em andamento, o contexto da janela do @dev contra o teto
  de 180k (aviso quando passa) e o último gate. Só aparece em projeto com `.forja/`.

## 0.1.0 — 2026-11-15

- Primeira versão: 9 agentes, 8 skills, ganchos `trava-push` e `limpa-vitest-orfao`, moldes de story, gate,
  exploração, medição, passagem e gotchas.
