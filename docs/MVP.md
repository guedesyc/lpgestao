# LP Gestao — especificacao do MVP

## Objetivo

Transformar uma CAP aprovada em uma implantacao controlada, com uma base unica
de dados, responsabilidades por setor, evidencias, excecoes e riscos ate a
inauguracao.

## Perfis e permissoes

| Perfil | Email | Visao |
| --- | --- | --- |
| GEOS / GO / GEU | geos@lemospassos.com | Projeto completo; inicia e valida tecnicamente a CAP |
| Comercial | a definir | Projeto completo |
| Administracao | adm@lemospassos.com | Projeto completo; pode iniciar antes do contrato |
| GESU | gesu@lemospassos.com | Equipamentos, utensilios e compras |
| RH | rh@lemospassos.com | Mao de obra, quadro, admissao e exames |
| TI | info@lemospassos.com | Informatica e conectividade |
| Manutencao | manutencao@lemospassos.com | Infraestrutura e manutencao |
| PCP | a definir | Abastecimento, cardapio e operacao |

O backend deve aplicar a mesma regra da interface: um perfil setorial nunca
recebe itens, tarefas ou campos de outro setor.

## Regras da CAP e fluxo

- A importacao inicial aceita o padrao conhecido de CAP Lemos Passos, por abas.
- A CAP aprovada e congelada como versao unica; redistribuicoes orcamentarias
  ficam registradas como decisoes, sem criar outra CAP.
- As abas `INFORMACOES INICIAIS`, `INFORMATICA`, `MAO DE OBRA`, `EQUIPAMENTOS`,
  `UTENSILIOS`, `MARKETING`, `DESPESAS OPERACIONAIS` e `RELACAO DAS ESCOLAS`
  alimentam os recortes de cada setor.
- GEOS/GO/GEU valida item a item e encaminha as frentes. Administracao pode
  comecar antes do contrato; os demais setores dependem de seus gatilhos.
- Excecoes sao aprovadas pelo proprio setor responsavel.
- Atraso gera risco e escalonamento, mas nao bloqueia automaticamente a tarefa.
- Toda tarefa concluida exige uma evidencia (arquivo, link ou registro).

## Modelo de dados inicial

`users(id, email, role)`, `projects(id, name, client, target_date, status)`,
`caps(id, project_id, source_file, imported_at, locked_at, total)`,
`cap_items(id, cap_id, tab, category, description, amount, sector, decision,
state)`, `tasks(id, project_id, cap_item_id, sector, title, status, due_date,
risk, assignee)`, `evidences(id, task_id, type, url, note, created_by,
created_at)`, `exceptions(id, task_id, reason, status, approved_by,
approved_at)`, `audit_events(id, project_id, actor_id, action, payload,
created_at)`.

## Backlog priorizado

1. Autenticacao e autorizacao por perfil, com allowlist de emails.
2. Cadastro do projeto e data de inauguracao.
3. Upload da CAP XLSM e parser especifico por abas/blocos.
4. Geracao dos itens e tarefas setorizados, com gatilhos do fluxo.
5. Painel filtrado por permissao, status e risco.
6. Evidencias obrigatorias, anexos e aprovacao de excecoes.
7. Historico/auditoria de decisoes e redistribuicoes.
8. Alertas de prazo e risco ate a inauguracao.

## Decisoes fora do MVP inicial

PCP e Comercial ainda aguardam email definido. Marketing entra inicialmente
como responsabilidade do GESU ou Administracao. A regra final de classificacao
de itens de PCP deve ser refinada com uma CAP real antes do parser ser fechado.
