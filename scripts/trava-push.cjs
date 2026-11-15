#!/usr/bin/env node
'use strict';

// Só o @devops publica. Trava de governança (evita push acidental), não de segurança.

const PUBLICA = [
  { nome: 'git push', casa: (palavras) => palavras[0] === 'git' && palavras.includes('push') },
  { nome: 'gh pr create/merge', casa: (palavras) => palavras[0] === 'gh' && palavras.includes('pr') && (palavras.includes('create') || palavras.includes('merge')) },
];

function trechos(comando) {
  return comando
    .split(/&&|\|\||[;|\n]/)
    .map((t) => t.trim().split(/\s+/).filter((p) => !/^[A-Z_][A-Z0-9_]*=/.test(p)))
    .filter((p) => p.length);
}

function liberado(entrada, comando) {
  const agente = String(entrada.agent_type || process.env.FORJA_AGENTE || '');
  return agente === 'devops' || agente.endsWith(':devops') || /\bFORJA_AGENTE=['"]?devops\b/.test(comando);
}

let texto = '';
process.stdin.on('data', (c) => { texto += c; });
process.stdin.on('end', () => {
  let entrada;
  try { entrada = JSON.parse(texto); } catch { return; }
  const comando = String(entrada?.tool_input?.command || '');
  const regra = trechos(comando).map((p) => PUBLICA.find((r) => r.casa(p))).find(Boolean);
  if (!regra || liberado(entrada, comando)) return;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `${regra.nome} é só do @devops (forja:devops). Peça a ele, ou, com autorização do dono do projeto nesta conversa, prefixe o comando com FORJA_AGENTE=devops.`,
    },
  }));
});
