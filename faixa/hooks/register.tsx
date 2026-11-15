import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, TurnUsage } from 'claude-code'

import type { Gate, Janela, Story } from '../types'

const TETO = 180_000
const ALERTA = 150_000

const ativo = atom({ plugin: 'forja-faixa', key: 'ativo' } as const, false)
const dev = atom({ plugin: 'forja-faixa', key: 'dev' } as const, null)
const story = atom({ plugin: 'forja-faixa', key: 'story' } as const, null)
const gate = atom({ plugin: 'forja-faixa', key: 'gate' } as const, null)

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

export const register: Register = on => {
  const devs = new Set<string>()

  on('session.start', async ($, e, next) => {
    const r = await next(e)
    await relerArquivos($)
    return r
  })

  on('agent.spawn', async ($, e, next) => {
    const r = await next(e)
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
    await relerArquivos($)
    return r
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || !(await read($, ativo))) return next(e)

    const [s, d, g] = await Promise.all([read($, story), read($, dev), read($, gate)])
    const { Box, Text } = $.ui.resolve(e)
    const corDev = !d ? 'subtle' : d.atual > TETO ? 'error' : d.atual > ALERTA ? 'warning' : 'success'
    const corGate = !g ? 'subtle' : /REPROVADA/.test(g.veredito) ? 'error' : /RESSALVAS|RISCO/.test(g.veredito) ? 'warning' : 'success'

    return (
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
    )
  })
}
