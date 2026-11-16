---
name: coordenar
description: Roteiro do coordenador para levar uma story do rascunho ao gate com o squad do FORJA. Use ao começar ou retomar uma story.
---

# Coordenar uma story

Você (a sessão principal) não implementa: prepara, abre agentes, comita, mede e decide a próxima janela.

## Ciclo

1. **@sm** escreve a story → **@po** libera (Pronta). Story segurada não segue.
2. **Explore uma vez só**: você mesmo escreve `.forja/exploracao/<story>.md`
   (`${CLAUDE_PLUGIN_ROOT}/templates/exploracao.md`): arquivos, padrões com exemplo, como testar, gotchas que valem.
3. **Uma janela por vez**: abra um `forja:dev` NOVO por janela, passando só story, janela, notas e commit de
   partida. Ao voltar: comite o que ele entregou, anote a medição, e o próximo parte desse commit com o resumo do
   anterior. Não mande mais trabalho a um dev que já passou de ~150k.
   **Antes de disparar, meça o peso**: janela que passa de ~30 arquivos ou que precisa ler arquivo com mais de
   ~1.500 linhas é dividida antes, não depois. Nunca junte dois cortes numa janela só.
4. **Gate**: `forja:qa` com story, branch e commit, sem a sua opinião.
5. **Reprovada**: conserto sempre num `forja:dev` NOVO, com o gate e os achados. Nunca reaproveite a janela que errou.
6. **Gotcha na hora**: achado alto/médio que se repete → skill `forja:gotcha` antes de seguir.
7. **Publicar** só pelo `forja:devops`, com o ok do dono do projeto.

## Higiene

- Ao fechar cada janela: `pgrep -lf vitest` vazio.
- Paralelo só entre janelas que não tocam os mesmos arquivos. Na mesma cópia do repo, o brief de cada dev diz:
  a área dele, sem `git add/rm/mv/stash/checkout` (apaga com `rm`), sem editar story nem `.forja/` (devolve o texto
  do diário pronto) e testes só por lista explícita dos arquivos dele.
- Antes de cada commit seu: stage vazio (`git diff --cached --quiet`) e `git add` só dos caminhos da janela.
- Perto de ~250k de contexto na sua sessão, ao fechar uma parte: skill `forja:passagem` e peça o `/clear`.

## Medição (`.forja/medicao.md`, molde `${CLAUDE_PLUGIN_ROOT}/templates/medicao.md`)

Por janela: modelo, tarefas, pico de contexto, chamadas, US$ equivalente. Por story: 1ª revisão
(veredito e alto/médio/baixo), voltas de conserto, total. Regra (modelo, teto, tamanho da janela) só muda com
medida antes e depois.
