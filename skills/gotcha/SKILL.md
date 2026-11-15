---
name: gotcha
description: Registra em .forja/gotchas.json um erro que pode se repetir, para o @dev ler antes de começar. Use quando a revisão achar alto/médio que é padrão.
---

# Registrar gotcha

Acrescente em `.forja/gotchas.json` (crie a partir de `${CLAUDE_PLUGIN_ROOT}/templates/gotchas.json` se faltar):

```json
{
  "id": "g-<story>-<palavra-chave>",
  "titulo": "regra em uma linha, no imperativo",
  "aconteceu": "onde e como (story, achado, data); acrescente se repetir",
  "como_evitar": "o que fazer em vez disso, concreto",
  "onde": ["caminhos ou pastas onde costuma aparecer"],
  "peso": "alto | medio"
}
```

- Já existe parecido? Atualize `aconteceu` em vez de duplicar.
- Se dá pra virar checagem automática (lint, teste, hook), anote em `como_evitar` e proponha a checagem: ela vale
  mais que o texto.
- Mantenha o arquivo curto: gotcha que nunca mais apareceu em 10 stories pode sair.
