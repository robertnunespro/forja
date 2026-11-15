# Exploração da story {N.M}

> Escrita UMA vez pelo coordenador antes do primeiro @dev. O @dev lê isto e não varre o repo de novo.
> Busca que faltar: UM comando (`rg -n 'padrão1|padrão2|padrão3' caminho/`), nunca dezenas de grep/cat soltos.

## Arquivos que a story toca

| Arquivo | O que tem | O que muda |
|---|---|---|
| `{caminho}` | {função/rota/tabela} | {mudança} |

## Padrões a seguir (com exemplo no repo)

- {padrão} → exemplo em `{arquivo}:{linha}`

## Criei e quem deve usar

> Cada @dev acrescenta aqui o que criou e quem deve usar, para o grupo seguinte não reinventar.

| Janela | Criei | Quem deve usar |
|---|---|---|
| A | `{helper}` em `{arquivo}` | {grupos/rotas que devem chamar} |

## Como testar

- Comando: `{comando} {arquivo} --maxWorkers=1 --no-file-parallelism` (primeiro plano, timeout maior que o teste)
- Depois de cada rodada: `pgrep -lf vitest` vazio
- Build: `{comando de build}`

## Gotchas que valem aqui

- `{id}`: {resumo}
