# FORJA

**Fluxo Orquestrado de Revisão, Janela e Aprendizado.** Plugin do Claude Code com um squad de agentes que leva
cada story do rascunho ao gate: o @dev trabalha em janelas curtas, o @qa prova o que aponta, e todo erro que pode
voltar vira gotcha.

**Princípio:** funcional, compacto, seguro e econômico. Nada é carregado em toda mensagem; prompts curtos; regra
mecânica vira gancho, não texto.

## Regras que o FORJA impõe

1. **@dev no Sonnet (esforço alto), @qa no Opus.**
2. **Uma tarefa pesada por janela do @dev**, teto de ~180k de contexto. Acima de ~500k a taxa de acerto de primeira
   despencou nas medições que originaram o FORJA; com janelas pequenas, a maioria passou no 1º gate.
3. **Exploração uma vez só**, pelo coordenador, em notas que o @dev lê. Busca que faltar: um comando só.
4. **Conserto de revisão sempre num @dev novo.**
5. **Achado alto/médio que se repete vira gotcha na hora**, e o @dev lê os gotchas antes de começar.
6. **Teste um arquivo por vez**, em primeiro plano, sem processo órfão (gancho `limpa-vitest-orfao`).
7. **O gate roda o build.**
8. **Só o @devops publica** (gancho `trava-push`).
9. **Mede-se tudo:** pico de contexto, chamadas e custo por janela, resultado do 1º gate. Regra só muda com medida.

## O que vem no plugin

| Tipo | Itens |
|---|---|
| Agentes | `analista`, `pm`, `arquiteto`, `ux`, `sm`, `po`, `dev`, `qa`, `devops` |
| Skills | `coordenar`, `fatiar`, `tdd`, `revisar`, `gotcha`, `retro`, `passagem`, `iniciar` |
| Ganchos | `trava-push` (PreToolUse/Bash), `limpa-vitest-orfao` (PostToolUse/Bash, SubagentStop, Stop) |
| Moldes | story, gate, exploração, medição, passagem, gotchas |
| Faixa (plugin `forja-faixa`) | em todo projeto: sessão e semana da assinatura, memória, custo e agentes rodando; em projeto com `.forja/`, mais uma linha: `FORJA · 1.3 Em dev · @dev 142k/180k · gate 1.2 APROVADA`; avisa quando o @dev passa do teto |

Ciclo da story: **Rascunho** (@sm) → **Pronta** (@po) → **Em dev** (@dev, janela a janela) → **Em revisão** →
**Feita** (@qa) → publicação (@devops).

## Instalar

```bash
claude plugin marketplace add robertnunespro/forja
claude plugin install forja@forja
claude plugin install forja-faixa@forja
```

Ou num projeto, em `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": { "forja": { "source": { "source": "github", "repo": "robertnunespro/forja" } } },
  "enabledPlugins": { "forja@forja": true, "forja-faixa@forja": true }
}
```

Depois, no projeto: `/forja:iniciar`. Pra cada story: peça ao Claude pra coordenar com `forja:coordenar`.

## Licença

MIT — veja [LICENSE](LICENSE).
