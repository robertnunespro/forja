#!/bin/bash
# Worker do vitest que perdeu o pai (timeout da ferramenta) fica com ppid 1 segurando memória.
# Só mata o órfão: teste de outra sessão ainda tem pai e segue rodando. Nunca `pkill -f vitest`.
ps -Ao pid=,ppid=,command= | awk '$2 == 1 && /vitest/ {print $1}' | xargs kill 2>/dev/null
exit 0
