---
name: retro
description: Retrospectiva de uma story ou sessão que transforma erro em checagem, gotcha ou ajuste de regra.
disable-model-invocation: true
---

# Retro

Leia a story, o gate, a medição e os diários das janelas. Procure, em ordem de peso:

1. **Erro que uma checagem pegaria** (lint, tipo, teste, hook, CI): proponha a checagem. Erro mecânico vira
   checagem, não texto.
2. **Erro de julgamento que se repete**: vira gotcha (`forja:gotcha`).
3. **Gasto**: janela acima do teto, busca repetida, ferramenta cara. O que mudar no mapa do terreno ou nas notas.
4. **Informação que faltou** ao agente: onde ela deveria estar.
5. **Instrução que não muda nada**: proponha cortar. Texto carregado à toa custa token em toda sessão.

Apresente como lista curta com a ação proposta; não aplique sem o ok do dono do projeto.
