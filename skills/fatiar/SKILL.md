---
name: fatiar
description: Corta um requisito em fatias verticais pequenas, cada uma conferível sozinha e do tamanho de uma janela. Use ao escrever story ou épico.
---

# Fatiar

- **Vertical**: cada fatia passa por todas as camadas que precisa (dado, regra, interface, teste) e entrega algo que
  dá pra ver funcionando. Fatia horizontal ("todas as migrações", "todas as telas") não vale.
- **Do tamanho de uma janela**: uma tarefa pesada, ~180k de contexto. Maior que isso, corte de novo.
- **Arrume antes de mudar**: se o código atual dificulta, a primeira fatia é a arrumação, sem mudar comportamento.
- **Ordem por bloqueio**: diga o que cada fatia precisa pronto antes. Sem bloqueio = pode começar já.
- **Mudança que espalha** (renomear coluna usada em tudo): três passos — acrescenta o novo ao lado do velho, migra
  os usos em lotes, remove o velho quando ninguém mais usa. Cada passo deixa tudo verde.

Mostre a lista (título, precisa de, o que entrega) antes de escrever e ajuste com quem pediu.
