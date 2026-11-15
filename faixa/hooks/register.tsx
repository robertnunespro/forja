import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionRateLimit, TurnUsage } from 'claude-code'

import type { Cota, Gate, Janela, Medida, Story } from '../types'

const TETO = 180_000
const ALERTA = 150_000

const ativo = atom({ plugin: 'forja-faixa', key: 'ativo' } as const, false)
const dev = atom({ plugin: 'forja-faixa', key: 'dev' } as const, null)
const story = atom({ plugin: 'forja-faixa', key: 'story' } as const, null)
const gate = atom({ plugin: 'forja-faixa', key: 'gate' } as const, null)
const medida = atom({ plugin: 'forja-faixa', key: 'medida' } as const, {
  sessao: null,
  semana: null,
  memoria: null,
  custo: null,
} as Medida)
const agentes = atom({ plugin: 'forja-faixa', key: 'agentes' } as const, 0)
const plano = atom({ plugin: 'forja-faixa', key: 'plano' } as const, null)

type Conta = { planDisplayName?: string; organizationType?: string; organizationRateLimitTier?: string }

const nomeDoPlano = (c: Conta) => {
  const nome = c.planDisplayName ?? c.organizationType?.replace(/^claude_/, '').replace(/^\w/, l => l.toUpperCase())
  const multiplo = c.organizationRateLimitTier?.match(/(\d+x)$/)?.[1]
  if (!nome) return null
  return multiplo && !nome.includes(multiplo) && /max/i.test(nome) ? `Claude ${nome} ${multiplo}` : `Claude ${nome}`
}

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const emBrasilia = (iso: string) => new Date(new Date(iso).getTime() - 3 * 3600_000)
const dois = (n: number) => String(n).padStart(2, '0')
const hora = (iso: string) => {
  const d = emBrasilia(iso)
  return `${dois(d.getUTCHours())}:${dois(d.getUTCMinutes())}`
}
const diaEHora = (iso: string) => `${DIAS[emBrasilia(iso).getUTCDay()]} ${hora(iso)}`
const cota = (limites: SessionRateLimit[], tipo: string): Cota | null => {
  const l = limites.find(x => x.kind === tipo)
  return l ? { usado: l.percentUsed, renova: l.resetsAt } : null
}
const corDoPercentual = (p: number | null | undefined) =>
  p == null ? 'subtle' : p >= 85 ? 'error' : p >= 60 ? 'warning' : 'success'

async function contarAgentes($: EngineInterface) {
  const lista = await $.agent.list()
  const rodando = lista.filter(a => a.status === 'running').length
  await update($, agentes, () => rodando)
}

const ehDev = (tipo: string) => /(^|:)dev$/.test(tipo)
const contexto = (u: TurnUsage) =>
  u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens + u.output_tokens
const mil = (n: number) => `${Math.round(n / 1000)}k`

async function maisRecente($: EngineInterface, pasta: string, sufixo: RegExp) {
  if (!(await $.fs.exists(pasta))) return []
  const itens = await $.fs.list(pasta)
  return itens
    .filter(i => i.kind === 'file' && sufixo.test(i.name))
    .sort((a, b) => b.mtimeMs - a.mtimeMs)
    .map(i => `${pasta}/${i.name}`)
}

async function storyAtual($: EngineInterface): Promise<Story | null> {
  for (const arq of await maisRecente($, 'docs/stories', /\.md$/)) {
    const texto = await $.fs.read(arq)
    const status = texto.match(/\*\*Status:\*\*\s*([^·\n]+)/)?.[1]?.trim()
    if (!status || /^feita/i.test(status)) continue
    const id = texto.match(/^#\s+([\w.]+)/m)?.[1] ?? arq.split('/').pop()!.replace(/\.md$/, '')
    return { id, status }
  }
  return null
}

async function ultimoGate($: EngineInterface): Promise<Gate | null> {
  const [arq] = await maisRecente($, 'docs/qa/gates', /\.ya?ml$/)
  if (!arq) return null
  const texto = await $.fs.read(arq)
  const campo = (nome: string) => texto.match(new RegExp(`^${nome}:\\s*'?([^'#\\n]+)`, 'm'))?.[1]?.trim()
  const veredito = campo('veredito')
  return veredito ? { story: campo('story') ?? '?', veredito } : null
}

async function relerArquivos($: EngineInterface) {
  const temForja = await $.fs.exists('.forja')
  await update($, ativo, () => temForja)
  if (!temForja) return
  const [s, g] = await Promise.all([storyAtual($), ultimoGate($)])
  await update($, story, () => s)
  await update($, gate, () => g)
}

let configLidaEm = 0

async function lerPlano($: EngineInterface) {
  const dir = (await $.env.get('CLAUDE_CONFIG_DIR')) ?? (await $.env.get('HOME'))
  if (!dir) return
  const arq = `${dir}/.claude.json`
  if (!(await $.fs.exists(arq))) return
  const { mtimeMs } = await $.fs.stat(arq)
  if (mtimeMs === configLidaEm) return
  configLidaEm = mtimeMs
  const conta: Conta = JSON.parse(await $.fs.read(arq)).oauthAccount ?? {}
  const nome = nomeDoPlano(conta)
  await update($, plano, () => nome)
}

export const register: Register = on => {
  const devs = new Set<string>()

  on('session.start', async ($, e, next) => {
    const r = await next(e)
    await Promise.all([relerArquivos($), lerPlano($)])
    return r
  })

  on('session.measure', async ($, e, next) => {
    const r = await next(e)
    const m: Medida = {
      sessao: cota(e.rateLimits, 'five_hour'),
      semana: cota(e.rateLimits, 'seven_day'),
      memoria: e.context.percent ?? null,
      custo: e.cost?.usd ?? null,
    }
    await update($, medida, () => m)
    return r
  })

  on('agent.spawn', async ($, e, next) => {
    const r = await next(e)
    await contarAgentes($)
    if (ehDev(e.subagentType) && r.agentId) {
      devs.add(r.agentId)
      const janela: Janela = { agentId: r.agentId, atual: 0, pico: 0, estourou: false }
      await update($, dev, () => janela)
    }
    return r
  })

  on('turn.step', async function* ($, e, next) {
    const r = yield* next(e)
    if (e.agentId && devs.has(e.agentId) && r.usage) {
      const atual = contexto(r.usage)
      const antes = await read($, dev)
      const base = antes?.agentId === e.agentId ? antes : { agentId: e.agentId, atual: 0, pico: 0, estourou: false }
      const estourou = base.estourou || atual > TETO
      if (estourou && !base.estourou) $.ui.toast(`FORJA: @dev passou do teto (${mil(atual)} de ${mil(TETO)})`)
      await update($, dev, () => ({ ...base, atual, pico: Math.max(base.pico, atual), estourou }))
    }
    return r
  })

  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    await Promise.all([relerArquivos($), contarAgentes($), lerPlano($)])
    return r
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)

    const [m, n, temForja, p] = await Promise.all([read($, medida), read($, agentes), read($, ativo), read($, plano)])
    const [s, d, g] = temForja
      ? await Promise.all([read($, story), read($, dev), read($, gate)])
      : [null, null, null]
    const { Box, Text } = $.ui.resolve(e)
    const corDev = !d ? 'subtle' : d.atual > TETO ? 'error' : d.atual > ALERTA ? 'warning' : 'success'
    const corGate = !g ? 'subtle' : /REPROVADA/.test(g.veredito) ? 'error' : /RESSALVAS|RISCO/.test(g.veredito) ? 'warning' : 'success'

    return (
      <Box flexDirection="column">
        <Box>
          {p ? <Text bold color="claude">{`${p} `}</Text> : null}
          {p ? <Text dimColor>· </Text> : null}
          {m.sessao ? <Text dimColor>Sessão </Text> : null}
          {m.sessao ? <Text color={corDoPercentual(m.sessao.usado)}>{`${m.sessao.usado}%`}</Text> : null}
          {m.sessao?.renova ? <Text dimColor>{` ↻${hora(m.sessao.renova)}`}</Text> : null}
          <Text dimColor>{m.sessao ? ' · Semana ' : 'Semana '}</Text>
          <Text color={corDoPercentual(m.semana?.usado)}>{m.semana ? `${m.semana.usado}%` : '—'}</Text>
          {m.semana?.renova ? <Text dimColor>{` ↻${diaEHora(m.semana.renova)}`}</Text> : null}
          <Text dimColor> · Memória </Text>
          <Text color={corDoPercentual(m.memoria)}>{m.memoria != null ? `${Math.round(m.memoria)}%` : '—'}</Text>
          {m.custo != null ? <Text dimColor>{` · US$ ${m.custo.toFixed(2).replace('.', ',')}`}</Text> : null}
          {n > 0 ? <Text dimColor>{` · ${n} ${n === 1 ? 'agente' : 'agentes'} rodando`}</Text> : null}
        </Box>
        {temForja ? (
          <Box>
            <Text bold>FORJA </Text>
            <Text dimColor>· </Text>
            <Text>{s ? `${s.id} ${s.status}` : 'sem story aberta'}</Text>
            <Text dimColor> · @dev </Text>
            <Text color={corDev}>{d ? `${mil(d.atual)}/${mil(TETO)}` : '—'}</Text>
            {d && d.pico > d.atual ? <Text dimColor>{` (pico ${mil(d.pico)})`}</Text> : null}
            <Text dimColor> · gate </Text>
            <Text color={corGate}>{g ? `${g.story} ${g.veredito}` : '—'}</Text>
          </Box>
        ) : null}
      </Box>
    )
  })
}
