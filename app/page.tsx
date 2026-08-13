"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

type Sector = "GEOS" | "Administracao" | "GESU" | "TI" | "PCP" | "RH" | "Manutencao";
type Status = "Em analise" | "Aguardando setor" | "Em execucao" | "Risco" | "Concluido";
type Role = Sector | "Comercial";
type CapItem = { id: string; item: string; sector: Sector; cap: string; decision: string; state: string; quantity: number; unitPrice: number; total: number; source: string };
type CapBlock = { quantityIndex: number; descriptionIndex: number; unitIndex: number; totalIndex: number };

const profiles: Array<{ role: Role; email: string; scope: "completo" | Sector }> = [
  { role: "GEOS", email: "geos@lemospassos.com", scope: "completo" },
  { role: "Comercial", email: "a definir", scope: "completo" },
  { role: "Administracao", email: "adm@lemospassos.com", scope: "completo" },
  { role: "GESU", email: "gesu@lemospassos.com", scope: "GESU" },
  { role: "RH", email: "rh@lemospassos.com", scope: "RH" },
  { role: "TI", email: "info@lemospassos.com", scope: "TI" },
  { role: "Manutencao", email: "manutencao@lemospassos.com", scope: "Manutencao" },
  { role: "PCP", email: "a definir", scope: "PCP" },
];

const sectors: Array<{ id: Sector; label: string; scope: string }> = [
  { id: "GEOS", label: "GEOS / GO / GEU", scope: "Validacao tecnica e plano operacional" },
  { id: "Administracao", label: "Administracao", scope: "Minuta, CNAE, filial e dados do cliente" },
  { id: "GESU", label: "GESU", scope: "Suprimentos e compras aprovadas" },
  { id: "TI", label: "TI", scope: "Infra, equipamentos e conectividade" },
  { id: "PCP", label: "PCP", scope: "Cardapio, producao e abastecimento inicial" },
  { id: "RH", label: "RH", scope: "Quadro, admissao e exames" },
  { id: "Manutencao", label: "Manutencao", scope: "Estrutura, eletrica e ponto zero" },
];

const initialTasks: Array<{
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

const fallbackCapItems: CapItem[] = [
  { id: "fallback-ti", item: "Computadores PDV", sector: "TI", cap: "R$ 18.400", decision: "Confirmar compra", state: "Risco", quantity: 1, unitPrice: 18400, total: 18400, source: "Demonstração" },
  { id: "fallback-gesu", item: "Freezer vertical", sector: "GESU", cap: "R$ 12.900", decision: "Substituir por similar", state: "Excecao", quantity: 1, unitPrice: 12900, total: 12900, source: "Demonstração" },
  { id: "fallback-manutencao", item: "Adequacao eletrica", sector: "Manutencao", cap: "R$ 22.000", decision: "Executar", state: "OK", quantity: 1, unitPrice: 22000, total: 22000, source: "Demonstração" },
  { id: "fallback-rh", item: "Equipe inicial", sector: "RH", cap: "14 vagas", decision: "Aprovar quadro", state: "Pendente", quantity: 14, unitPrice: 0, total: 0, source: "Demonstração" },
  { id: "fallback-pcp", item: "Primeiro abastecimento", sector: "PCP", cap: "R$ 31.600", decision: "Aguardando filial", state: "Pendente", quantity: 1, unitPrice: 31600, total: 31600, source: "Demonstração" },
];

const approvals = [
  "Cada setor aprova sua propria excecao e assume responsabilidade.",
  "Orcamento pode ser redistribuido entre categorias sem criar nova CAP.",
  "Uma unica CAP vira base imutavel do projeto.",
  "Perfil de setor ve apenas sua fatia da CAP.",
];

const boardStatuses: Status[] = ["Em analise", "Aguardando setor", "Em execucao", "Risco", "Concluido"];

function statusLabel(status: Status) {
  return status;
}

function clean(value: unknown) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
}

function numberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value ?? "").replace(/R\$\s?/gi, "").replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isQuantityHeader(label: string) {
  return label === "QTD" || label === "QTD." || label.includes("QUANTIDADE") || label.includes("QTD NECESSARIA") || label === "ESCOLHER";
}

function isUnitHeader(label: string) {
  return label.includes("VALOR UNIT") || label.includes("PRECO UNIT") || label.includes("CUSTO TOTAL");
}

function isTotalHeader(label: string) {
  return label === "TOTAL" || label.startsWith("TOTAL ") || label.includes("TOTAL R");
}

function isDescriptionHeader(label: string) {
  if (!label || isQuantityHeader(label) || isUnitHeader(label) || isTotalHeader(label)) return false;
  return !["RESPON.", "RESPONSABILIDADE", "Nº ESCOLAS", "N ESCOLAS", "RATEIO", "OBS.", "OBS"].includes(label);
}

function detectBlock(labels: string[]): CapBlock | null {
  const quantityIndex = labels.findIndex(isQuantityHeader);
  const unitIndex = labels.findIndex(isUnitHeader);
  const totalIndex = labels.findIndex(isTotalHeader);
  if (unitIndex < 0 || totalIndex < 0) return null;

  const descriptionIndex = labels.findIndex((label, index) => {
    if (!isDescriptionHeader(label)) return false;
    return index < unitIndex || (quantityIndex >= 0 && index < quantityIndex);
  });

  if (descriptionIndex < 0) return null;
  return { quantityIndex, descriptionIndex, unitIndex, totalIndex };
}

function sectorForSheet(sheetName: string): Sector | null {
  const name = clean(sheetName);
  if (name === "INFORMATICA") return "TI";
  if (name === "MAO DE OBRA") return "RH";
  if (["EQUIPAMENTOS", "UTENSILIOS"].includes(name)) return "GESU";
  if (name === "MARKETING") return "RH";
  if (name === "DESPESAS OPERACIONAIS") return "Administracao";
  return null;
}

function makeItem(sheetName: string, rowNumber: number, description: unknown, quantity: unknown, unitPrice: unknown, total: unknown): CapItem | null {
  const item = String(description ?? "").trim();
  const qty = numberValue(quantity);
  const unit = numberValue(unitPrice);
  const amount = numberValue(total) || qty * unit;
  if (!item || numberValue(item) || clean(item).startsWith("TOTAL") || (!qty && !amount)) return null;
  return {
    id: `${clean(sheetName).toLowerCase()}-${rowNumber}-${clean(item).slice(0, 24)}`,
    item,
    sector: sectorForSheet(sheetName) ?? "GESU",
    cap: amount ? `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${qty} un.`,
    decision: "Aguardando validação GEOS",
    state: "Pendente",
    quantity: qty || 1,
    unitPrice: unit,
    total: amount,
    source: sheetName,
  };
}

function parseCapWorkbook(data: ArrayBuffer): CapItem[] {
  const workbook = XLSX.read(data, { type: "array", cellDates: true, cellFormula: false });
  const items: CapItem[] = [];
  const supportedSheets = workbook.SheetNames.filter((sheetName) => sectorForSheet(sheetName));

  for (const sheetName of supportedSheets) {
    const rows = XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[sheetName], { header: 1, defval: null, raw: true });
    const sheet = clean(sheetName);
    if (sheet === "MAO DE OBRA") {
      const headerIndex = rows.findIndex((row) => row.some((cell) => clean(cell).includes("QUADRO DE PESSOAL")));
      if (headerIndex >= 0) {
        const header = rows[headerIndex];
        const qtyIndex = header.findIndex((cell) => clean(cell) === "QTD");
        const descriptionIndex = header.findIndex((cell) => clean(cell).includes("QUADRO DE PESSOAL"));
        const unitIndex = header.findIndex((cell) => clean(cell) === "SALARIO");
        const totalIndex = header.findIndex((cell) => clean(cell).startsWith("TOTAL GERAL"));
        rows.slice(headerIndex + 1).forEach((row, index) => {
          const parsed = makeItem(sheetName, headerIndex + index + 2, row[descriptionIndex], row[qtyIndex], row[unitIndex], row[totalIndex]);
          if (parsed) items.push(parsed);
        });
      }
      continue;
    }

    let block: CapBlock | null = null;
    rows.forEach((row, rowIndex) => {
      const labels = row.map((cell) => clean(cell));
      const detectedBlock = detectBlock(labels);

      // Each operational tab is made of repeated blocks. Once a block header
      // is found, its column layout applies to the following item rows.
      if (detectedBlock) {
        block = detectedBlock;
        return;
      }

      if (!block) return;
      const description = row[block.descriptionIndex];
      const normalizedDescription = clean(description);
      if (!normalizedDescription || normalizedDescription.startsWith("TOTAL") || normalizedDescription.includes("TAXA") || normalizedDescription.includes("NUMERO DE PARCELAS")) return;

      const parsed = makeItem(sheetName, rowIndex + 1, description, block.quantityIndex >= 0 ? row[block.quantityIndex] : 1, row[block.unitIndex], row[block.totalIndex]);
      if (parsed) items.push(parsed);
    });
  }

  return items.filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index);
}

function extractUnitName(data: ArrayBuffer) {
  const workbook = XLSX.read(data, { type: "array", cellDates: true, cellFormula: false });
  const sheet = workbook.Sheets[workbook.SheetNames.find((name) => clean(name) === "INFORMACOES INICIAIS") ?? ""];
  if (!sheet) return "";
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: true });
  for (const row of rows) {
    const labelIndex = row.findIndex((cell) => clean(cell) === "NOME FANTASIA");
    if (labelIndex >= 0 && row[labelIndex + 1]) {
      const fantasyName = String(row[labelIndex + 1]).trim();
      if (clean(fantasyName).includes("RBEM") || clean(fantasyName).includes("RESTAURANTE DO BEM")) {
        return "Restaurante do Bem Quirinópolis";
      }
      return fantasyName;
    }
  }
  return "";
}

export default function Home() {
  const [activeSector, setActiveSector] = useState<Sector | "Todos">("Todos");
  const [role, setRole] = useState<Role>("GEOS");
  const [evidenceIds, setEvidenceIds] = useState<number[]>([6, 8]);
  const [imported, setImported] = useState(false);
  const [importedCapItems, setImportedCapItems] = useState<CapItem[]>([]);
  const [importedFileName, setImportedFileName] = useState("");
  const [importError, setImportError] = useState("");
  const [unitName, setUnitName] = useState("Cozinha Central Lisboa");
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<Status | null>(null);

  const profile = profiles.find((item) => item.role === role) ?? profiles[0];
  const canSee = (sector: Sector) => profile.scope === "completo" || profile.scope === sector;
  const allowedSectors = sectors.filter((sector) => canSee(sector.id)).map((sector) => sector.id);

  const visibleTasks = useMemo(
    () => tasks.filter((task) => canSee(task.sector) && (activeSector === "Todos" || task.sector === activeSector)),
    [activeSector, profile.scope, tasks],
  );

  const capItems = importedCapItems.length ? importedCapItems : fallbackCapItems;
  const visibleCapItems = capItems.filter((item) => {
    const profileAllowsItem = allowedSectors.includes(item.sector);
    const activeSectorAllowsItem = activeSector === "Todos" || item.sector === activeSector;
    return profileAllowsItem && activeSectorAllowsItem;
  });
  const importedTotal = capItems.reduce((sum, item) => sum + item.total, 0);

  async function importCap(file: File) {
    setImportError("");
    try {
      const parsedItems = parseCapWorkbook(await file.arrayBuffer());
      if (!parsedItems.length) throw new Error("Nenhum item previsto foi encontrado nas abas conhecidas.");
      setImportedCapItems(parsedItems);
      setImportedFileName(file.name);
      const detectedUnitName = extractUnitName(await file.arrayBuffer());
      if (detectedUnitName) setUnitName(detectedUnitName);
      setImported(true);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Não foi possível ler esta CAP.");
      setImported(false);
    }
  }

  const riskCount = tasks.filter((task) => task.status === "Risco" || task.risk === "alto").length;
  const doneCount = visibleTasks.filter((task) => task.status === "Concluido").length;

  function moveTask(taskId: number, status: Status) {
    setTasks((currentTasks) => currentTasks.map((task) => task.id === taskId ? { ...task, status } : task));
    setDraggedTaskId(null);
    setDragOverStatus(null);
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Navegacao do prototipo">
        <div className="brand">
          <img src="/brand/logo-lemospassos-badge.png" alt="Grupo LemosPassos" />
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
        <label className="profile-switcher">
          <small>Perfil de demonstracao</small>
          <select value={role} onChange={(event) => { setRole(event.target.value as Role); setActiveSector("Todos"); }}>
            {profiles.map((item) => <option key={item.role} value={item.role}>{item.role}</option>)}
          </select>
          <span>{profile.email} · {profile.scope === "completo" ? "visao completa" : `somente ${profile.scope}`}</span>
        </label>
      </aside>

      <section className="workspace">
        <header className="topline" id="painel">
          <div>
            <p className="eyebrow">Unidade em implantacao</p>
            <input className="unit-name-input" aria-label="Nome da unidade" value={unitName} onChange={(event) => setUnitName(event.target.value)} />
            <p>
              Acompanhamento pos-CAP com responsabilidade clara, evidencias e
              riscos visiveis ate a inauguracao.
            </p>
          </div>
          <label className="upload-button">
            <input type="file" accept=".xlsm,.xlsx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importCap(file); }} />
            {imported ? "Trocar CAP" : "Importar CAP XLSM"}
          </label>
        </header>

        <section className="metrics" aria-label="Indicadores do projeto">
          <article>
            <small>CAP base</small>
            <strong>{imported ? `R$ ${importedTotal.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}` : "R$ 284.700"}</strong>
            <span>{imported ? `${capItems.length} itens importados` : "versao unica bloqueada"}</span>
          </article>
          <article>
            <small>Prazo ate inauguracao</small>
            <strong>43 dias</strong>
            <span>SLAs calculados pela data alvo</span>
          </article>
          <article>
            <small>Tarefas concluidas</small>
            <strong>{doneCount}/{visibleTasks.length}</strong>
            <span>{evidenceIds.length} evidencias registradas</span>
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
            {sectors.filter((sector) => canSee(sector.id)).map((sector) => (
              <article key={sector.id} className={activeSector === sector.id ? "sector selected" : "sector"}>
                <strong>{sector.label}</strong>
                <small>{sector.scope}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="board" aria-label="Quadro de tarefas">
          {boardStatuses.map((status) => (
            <article
              className={dragOverStatus === status ? "column drag-over" : "column"}
              key={status}
              onDragOver={(event) => { event.preventDefault(); setDragOverStatus(status); }}
              onDragLeave={() => setDragOverStatus((current) => current === status ? null : current)}
              onDrop={(event) => { event.preventDefault(); const taskId = Number(event.dataTransfer.getData("text/plain")); if (taskId) moveTask(taskId, status); }}
            >
              <h3>{status}</h3>
              <small className="drop-hint">{dragOverStatus === status ? "Solte para mover" : "Arraste tarefas para cá"}</small>
              {visibleTasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <div
                    className={draggedTaskId === task.id ? `task risk-${task.risk} is-dragging` : `task risk-${task.risk}`}
                    draggable
                    key={task.id}
                    onDragStart={(event) => { event.dataTransfer.setData("text/plain", String(task.id)); event.dataTransfer.effectAllowed = "move"; setDraggedTaskId(task.id); }}
                    onDragEnd={() => { setDraggedTaskId(null); setDragOverStatus(null); }}
                  >
                    <div>
                      <span>{task.sector}</span>
                      <b>{task.due}</b>
                    </div>
                    <strong>{task.title}</strong>
                    <p>{task.note}</p>
                    <small>{evidenceIds.includes(task.id) ? "Evidencia registrada" : "Evidencia pendente"}</small>
                    {task.status !== "Concluido" && (
                      <button className="evidence-button" type="button" onClick={() => setEvidenceIds((ids) => ids.includes(task.id) ? ids : [...ids, task.id])}>
                        Registrar evidencia
                      </button>
                    )}
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
              <h2>Itens visiveis para {profile.role}</h2>
              </div>
              <span className="badge">{visibleCapItems.length} itens · base unica</span>
            </div>
            <div className="cap-list">
              {visibleCapItems.map((item) => (
                <div className="cap-row" key={item.item}>
                  <span>{item.sector}</span>
                  <strong>{item.item}</strong>
                  <small>{item.quantity} un. · R$ {item.unitPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</small>
                  <em>{item.decision}</em>
                  <b>R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                </div>
              ))}
            </div>
            <p className="panel-footnote">{imported ? `CAP importada: ${importedFileName}. Abas reconhecidas: Informática, Mão de obra, Equipamentos, Utensílios, Marketing e Despesas Operacionais.` : "Nenhum arquivo enviado. O importador aceita o padrão CAP Lemos Passos em XLSM/XLSX."}</p>
            {importError && <p className="import-error" role="alert">{importError}</p>}
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
