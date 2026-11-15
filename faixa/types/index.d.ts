export type Janela = { agentId: string; atual: number; pico: number; estourou: boolean }
export type Story = { id: string; status: string }
export type Gate = { story: string; veredito: string }
export type Cota = { usado: number; renova?: string }
export type Medida = {
  sessao: Cota | null
  semana: Cota | null
  memoria: number | null
  custo: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'forja-faixa': {
      ativo: boolean
      dev: Janela | null
      story: Story | null
      gate: Gate | null
      medida: Medida
      agentes: number
    }
  }
}
