---
name: passagem
description: Escreve a passagem de turno do coordenador antes de limpar o contexto (~250k), para a próxima sessão seguir sem perder nada.
disable-model-invocation: true
---

# Passagem de turno

1. Espere os agentes em andamento terminarem, ou anote onde conferir cada um (branch, worktree, gate).
2. Escreva `.forja/handoffs/<aaaa-mm-dd>-<assunto>.md` a partir de `${CLAUDE_PLUGIN_ROOT}/templates/handoff.md`.
3. Diga ao dono do projeto a frase de início da próxima sessão e peça o `/clear`. Não se zere sozinho.
