---
name: tdd
description: Laço teste-primeiro do @dev (vermelho, verde, um passo por vez) com teste na interface pública. Use ao implementar ou consertar.
---

# Teste primeiro

1. **Escolha a costura**: o ponto público onde o comportamento aparece (rota, função exportada, tela). Teste ali,
   nunca nas entranhas. Anote qual é e o que ela não pega.
2. **Vermelho**: um teste, de um comportamento, que falha pelo motivo certo.
3. **Verde**: o mínimo de código pra passar. Nada adiantado.
4. Repita. Arrumar o código fica pra depois do verde e pra revisão, não no meio do laço.

## Teste que presta

- Lê como especificação ("aluno não vê nota de outra turma").
- O valor esperado vem de fora do código (exemplo trabalhado, literal conhecido), nunca recalculado do mesmo jeito.
- Não quebra quando você refatora sem mudar comportamento. Mock só na fronteira com o mundo (rede, relógio, fila).
- Não confere pelo banco o que dá pra conferir pela interface.

## Rodar

Um arquivo por vez, em primeiro plano, `--maxWorkers=1 --no-file-parallelism`, `pgrep -lf vitest` depois.
