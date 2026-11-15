---
name: revisar
description: Roteiro da revisão do @qa em dois lados (story e padrões) que termina no gate. Use ao revisar uma story ou um diff.
---

# Revisar

1. **Fixe a base**: `git rev-parse <base>` e `git diff <base>...HEAD` não vazio. Base errada falha aqui.
2. **Contra a story**, item a item de "Pronto quando": feito e testado / parcial / errado / ausente. E o que
   apareceu sem ninguém pedir.
3. **Contra os padrões**: regra escrita do repo (CLAUDE.md, CONTRIBUTING, docs de padrão) quebrada = defeito.
   Cheiros = opinião, com nome: nome que engana, lógica repetida, função com inveja dos dados de outro módulo,
   generalização sem uso, intermediário que só repassa, mudança que obriga a mexer em muitos lugares.
4. **Mantenha os dois lados separados** no relatório: um não esconde o outro.
5. **Rode**: tipos, lint, testes da story (um arquivo por vez), build.
6. **Ataque**: vazio, repetido, concorrente, outro cliente, rede caindo, dado antigo.
7. **Grave o gate** (`${CLAUDE_PLUGIN_ROOT}/templates/gate.yml`) com o veredito.

Peso: **alto** = dado errado, vazamento, quebra, critério não atendido; **médio** = bug em caso real menos comum,
falta de teste num caminho importante; **baixo** = melhoria.
