---
name: iniciar
description: Prepara um projeto para o FORJA (pastas de stories, gates e .forja/) sem tocar no código.
disable-model-invocation: true
---

# Iniciar o FORJA no projeto

Crie o que faltar, sem sobrescrever nada que existe:

- `docs/stories/` e `docs/qa/gates/`
- `.forja/gotchas.json` (de `${CLAUDE_PLUGIN_ROOT}/templates/gotchas.json`), `.forja/exploracao/`, `.forja/handoffs/`
- `.forja/medicao.md` (de `${CLAUDE_PLUGIN_ROOT}/templates/medicao.md`)

No `CLAUDE.md` do projeto, acrescente só (se não houver):

```
## Fluxo
FORJA: story por story com o squad `forja:*`. Ao começar ou retomar uma story, use a skill `forja:coordenar`.
Testes: um arquivo por vez, em primeiro plano, `--maxWorkers=1 --no-file-parallelism`. Push só pelo `forja:devops`.
```

Mostre o que criou.
