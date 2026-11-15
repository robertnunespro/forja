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
   anterior. Não mande mais trabalho a um dev que já passou de ~180k.
4. **Gate**: `forja:qa` com story, branch e commit, sem a sua opinião.
5. **Reprovada**: conserto sempre num `forja:dev` NOVO, com o gate e os achados. Nunca reaproveite a janela que errou.
6. **Gotcha na hora**: achado alto/médio que se repete → skill `forja:gotcha` antes de seguir.
7. **Publicar** só pelo `forja:devops`, com o ok do dono do projeto.

## Higiene

- Ao fechar cada janela: `pgrep -lf vitest` vazio.
- Paralelo só entre janelas que não tocam os mesmos arquivos.
- Perto de ~250k de contexto na sua sessão, ao fechar uma parte: skill `forja:passagem` e peça o `/clear`.

## Medição (`.forja/medicao.md`, molde `${CLAUDE_PLUGIN_ROOT}/templates/medicao.md`)

Por janela: modelo, tarefas, pico de contexto, chamadas, US$ equivalente. Por story: 1ª revisão
(veredito e alto/médio/baixo), voltas de conserto, total. Regra (modelo, teto, tamanho da janela) só muda com
medida antes e depois.
