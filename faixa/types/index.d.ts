export type Janela = { agentId: string; atual: number; pico: number; estourou: boolean }
export type Story = { id: string; status: string }
export type Gate = { story: string; veredito: string }

declare module 'claude-code' {
  interface PluginState {
    'forja-faixa': {
      ativo: boolean
      dev: Janela | null
      story: Story | null
      gate: Gate | null
    }
  }
}
