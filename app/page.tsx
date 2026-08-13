"use client";

import { useMemo, useState } from "react";

type Sector = "GEOS" | "Administracao" | "GESU" | "TI" | "PCP" | "RH" | "Manutencao";
type Status = "Em analise" | "Aguardando setor" | "Em execucao" | "Risco" | "Concluido";

const sectors: Array<{ id: Sector; label: string; scope: string }> = [
  { id: "GEOS", label: "GEOS / GO / GEU", scope: "Validacao tecnica e plano operacional" },
  { id: "Administracao", label: "Administracao", scope: "Minuta, CNAE, filial e dados do cliente" },
  { id: "GESU", label: "GESU", scope: "Suprimentos e compras aprovadas" },
  { id: "TI", label: "TI", scope: "Infra, equipamentos e conectividade" },
  { id: "PCP", label: "PCP", scope: "Cardapio, producao e abastecimento inicial" },
  { id: "RH", label: "RH", scope: "Quadro, admissao e exames" },
  { id: "Manutencao", label: "Manutencao", scope: "Estrutura, eletrica e ponto zero" },
];

const tasks: Array<{
  id: number;
  title: string;
  sector: Sector;
  status: Status;
  due: string;
  risk: "baixo" | "medio" | "alto";
  note: string;
}> = [
  {
    id: 1,
    title: "Analisar minuta e liberar frente administrativa",
    sector: "Administracao",
    status: "Em execucao",
    due: "D-28",
    risk: "medio",
    note: "Atividade permitida antes do contrato assinado.",
  },
  {
    id: 2,
    title: "Validar item a item da CAP base",
    sector: "GEOS",
    status: "Em analise",
    due: "D-24",
    risk: "alto",
    note: "Define comprar, substituir, reparar, remover ou justificar excecao.",
  },
  {
    id: 3,
    title: "Confirmar computadores, rede e impressoras",
    sector: "TI",
    status: "Risco",
    due: "D-18",
    risk: "alto",
    note: "Demora de resposta aciona risco do projeto.",
  },
  {
    id: 4,
    title: "Abrir RM dos itens aprovados",
    sector: "GESU",
    status: "Aguardando setor",
    due: "D-16",
    risk: "medio",
    note: "GESU enxerga somente a fatia de suprimentos, nao a CAP completa.",
  },
  {
    id: 5,
    title: "Definir quadro e exames admissionais",
    sector: "RH",
    status: "Aguardando setor",
    due: "D-15",
    risk: "medio",
    note: "Aumento de quadro vira excecao do RH.",
  },
  {
    id: 6,
    title: "Vistoria de estrutura e ponto zero",
    sector: "Manutencao",
    status: "Em execucao",
    due: "D-14",
    risk: "baixo",
    note: "Energia, cabos, acesso, agua, gordura e equipamentos existentes.",
  },
  {
    id: 7,
    title: "Planejar abastecimento e arranque",
    sector: "PCP",
    status: "Aguardando setor",
    due: "D-10",
    risk: "baixo",
    note: "Insumos e cardapio inicial dependem da filial liberada.",
  },
  {
    id: 8,
    title: "Checklist de inauguracao",
    sector: "GEOS",
    status: "Concluido",
    due: "D-2",
    risk: "baixo",
    note: "Estrutura, equipe, materiais, POPs e operacao funcional.",
  },
];

const capItems = [
  { item: "Computadores PDV", sector: "TI", cap: "R$ 18.400", decision: "Confirmar compra", state: "Risco" },
  { item: "Freezer vertical", sector: "GESU", cap: "R$ 12.900", decision: "Substituir por similar", state: "Excecao" },
  { item: "Adequacao eletrica", sector: "Manutencao", cap: "R$ 22.000", decision: "Executar", state: "OK" },
  { item: "Equipe inicial", sector: "RH", cap: "14 vagas", decision: "Aprovar quadro", state: "Pendente" },
  { item: "Primeiro abastecimento", sector: "PCP", cap: "R$ 31.600", decision: "Aguardando filial", state: "Pendente" },
];

const approvals = [
  "Cada setor aprova sua propria excecao e assume responsabilidade.",
  "Orcamento pode ser redistribuido entre categorias sem criar nova CAP.",
  "Uma unica CAP vira base imutavel do projeto.",
  "Perfil de setor ve apenas sua fatia da CAP.",
];

function statusLabel(status: Status) {
  return status;
}

export default function Home() {
  const [activeSector, setActiveSector] = useState<Sector | "Todos">("Todos");

  const visibleTasks = useMemo(
    () => tasks.filter((task) => activeSector === "Todos" || task.sector === activeSector),
    [activeSector],
  );

  const riskCount = tasks.filter((task) => task.status === "Risco" || task.risk === "alto").length;
  const doneCount = tasks.filter((task) => task.status === "Concluido").length;

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Navegacao do prototipo">
        <div className="brand">
          <span>LP</span>
          <div>
            <strong>LP Gestao</strong>
            <small>Implantacao pos-CAP</small>
          </div>
        </div>
        <nav>
          <a className="active" href="#painel">Painel</a>
          <a href="#cap">CAP setorizada</a>
          <a href="#fluxo">Fluxo</a>
          <a href="#regras">Regras</a>
        </nav>
        <div className="sidebar-card">
          <small>Data alvo</small>
          <strong>25/09/2026</strong>
          <span>{riskCount} pontos exigem atencao</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topline" id="painel">
          <div>
            <p className="eyebrow">Unidade em implantacao</p>
            <h1>Cozinha Central Lisboa</h1>
            <p>
              Controle unico para transformar a CAP aprovada em tarefas, aprovacoes,
              compras e riscos por setor.
            </p>
          </div>
          <button type="button">Nova tarefa</button>
        </header>

        <section className="metrics" aria-label="Indicadores do projeto">
          <article>
            <small>CAP base</small>
            <strong>R$ 284.700</strong>
            <span>versao unica bloqueada</span>
          </article>
          <article>
            <small>Prazo ate inauguracao</small>
            <strong>43 dias</strong>
            <span>SLAs calculados pela data alvo</span>
          </article>
          <article>
            <small>Tarefas concluidas</small>
            <strong>{doneCount}/{tasks.length}</strong>
            <span>controle por evidencias</span>
          </article>
          <article>
            <small>Risco atual</small>
            <strong>Alto</strong>
            <span>TI sem resposta no prazo</span>
          </article>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Responsaveis</p>
              <h2>Visao por setor</h2>
            </div>
            <div className="filters" role="tablist" aria-label="Filtrar tarefas por setor">
              <button
                className={activeSector === "Todos" ? "selected" : ""}
                onClick={() => setActiveSector("Todos")}
                type="button"
              >
                Todos
              </button>
              {sectors.map((sector) => (
                <button
                  className={activeSector === sector.id ? "selected" : ""}
                  key={sector.id}
                  onClick={() => setActiveSector(sector.id)}
                  type="button"
                >
                  {sector.id}
                </button>
              ))}
            </div>
          </div>

          <div className="sector-grid">
            {sectors.map((sector) => (
              <article key={sector.id} className={activeSector === sector.id ? "sector selected" : "sector"}>
                <strong>{sector.label}</strong>
                <small>{sector.scope}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="board" aria-label="Quadro de tarefas">
          {["Em analise", "Aguardando setor", "Em execucao", "Risco", "Concluido"].map((status) => (
            <article className="column" key={status}>
              <h3>{status}</h3>
              {visibleTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div className={`task risk-${task.risk}`} key={task.id}>
                    <div>
                      <span>{task.sector}</span>
                      <b>{task.due}</b>
                    </div>
                    <strong>{task.title}</strong>
                    <p>{task.note}</p>
                    <small>{statusLabel(task.status)}</small>
                  </div>
                ))}
            </article>
          ))}
        </section>

        <section className="split" id="cap">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">CAP setorizada</p>
                <h2>Itens visiveis por perfil</h2>
              </div>
              <span className="badge">base unica</span>
            </div>
            <div className="cap-list">
              {capItems.map((item) => (
                <div className="cap-row" key={item.item}>
                  <span>{item.sector}</span>
                  <strong>{item.item}</strong>
                  <small>{item.cap}</small>
                  <em>{item.decision}</em>
                  <b>{item.state}</b>
                </div>
              ))}
            </div>
          </article>

          <article className="panel" id="regras">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Aprovacoes</p>
                <h2>Regras fechadas</h2>
              </div>
            </div>
            <ul className="rules">
              {approvals.map((approval) => (
                <li key={approval}>{approval}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="timeline panel" id="fluxo">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Caminho critico</p>
              <h2>Contrato primeiro, operacao depois</h2>
            </div>
          </div>
          <div className="steps">
            <span>CAP aceita</span>
            <span>Administracao inicia</span>
            <span>Contrato assinado</span>
            <span>GEOS valida CAP</span>
            <span>Setores executam</span>
            <span>Inauguracao</span>
            <span>Estabilizacao</span>
          </div>
        </section>
      </section>
    </main>
  );
}
