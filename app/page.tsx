"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import * as XLSX from "xlsx";

type Sector = "GEOS" | "Administracao" | "GESU" | "TI" | "PCP" | "RH" | "Manutencao";
type Status = "Em analise" | "Aguardando setor" | "Risco" | "Concluido";
type Role = Sector | "Comercial";
type CapItem = { id: string; item: string; sector: Sector; cap: string; decision: string; state: string; quantity: number; unitPrice: number; total: number; source: string };
type CapBlock = { quantityIndex: number; descriptionIndex: number; unitIndex: number; totalIndex: number };
type AuthRole = "TI" | "GEOS" | "Comercial";
type DecisionStatus = "Pendente setor" | "Aguardando GEOS" | "Aprovado GEOS" | "Rejeitado GEOS";
type ItemDecision = {
  status: DecisionStatus;
  kind: "confirmacao" | "substituicao";
  proposalName?: string;
  proposalDetails?: string;
  proposalUnitPrice?: number;
  submittedAt: string;
  rejectionNote?: string;
};
type CapRegistryEntry = { id: string; unitName: string; fileName: string; status: "REALIZADA" | "PENDENTE"; items: CapItem[] };

const localUsers: Array<{ username: string; password: string; role: AuthRole; label: string }> = [
  { username: "ti", password: process.env.NEXT_PUBLIC_LP_TI_PASSWORD ?? "", role: "TI", label: "Tecnologia da Informação" },
  { username: "geos", password: process.env.NEXT_PUBLIC_LP_GEOS_PASSWORD ?? "", role: "GEOS", label: "GEOS / GO / GEU" },
  { username: "comercial", password: process.env.NEXT_PUBLIC_LP_COMERCIAL_PASSWORD ?? "", role: "Comercial", label: "Comercial" },
];

const profiles: Array<{ role: Role; email: string; scope: "completo" | Sector }> = [
  { role: "GEOS", email: "geos@lemospassos.com", scope: "completo" },
  { role: "Comercial", email: "a definir", scope: "completo" },
  { role: "Administracao", email: "adm@lemospassos.com", scope: "Administracao" },
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
    status: "Em analise",
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
    status: "Em analise",
    due: "D-18",
    risk: "alto",
    note: "Demora de resposta aciona risco do projeto.",
  },
  {
    id: 4,
    title: "Abrir RM dos itens aprovados",
    sector: "GESU",
    status: "Em analise",
    due: "D-16",
    risk: "medio",
    note: "GESU enxerga somente a fatia de suprimentos, nao a CAP completa.",
  },
  {
    id: 5,
    title: "Definir quadro e exames admissionais",
    sector: "RH",
    status: "Em analise",
    due: "D-15",
    risk: "medio",
    note: "Aumento de quadro vira excecao do RH.",
  },
  {
    id: 6,
    title: "Vistoria de estrutura e ponto zero",
    sector: "Manutencao",
    status: "Em analise",
    due: "D-14",
    risk: "baixo",
    note: "Energia, cabos, acesso, agua, gordura e equipamentos existentes.",
  },
  {
    id: 7,
    title: "Planejar abastecimento e arranque",
    sector: "PCP",
    status: "Em analise",
    due: "D-10",
    risk: "baixo",
    note: "Insumos e cardapio inicial dependem da filial liberada.",
  },
  {
    id: 8,
    title: "Checklist de inauguracao",
    sector: "GEOS",
    status: "Em analise",
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

const boardStatuses: Status[] = ["Em analise", "Aguardando setor", "Risco", "Concluido"];

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
  if (quantityIndex < 0 || unitIndex < 0 || totalIndex < 0) return null;

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
  return null;
}

function makeItem(sheetName: string, rowNumber: number, description: unknown, quantity: unknown, unitPrice: unknown, total: unknown): CapItem | null {
  const item = String(description ?? "").trim();
  const qty = numberValue(quantity);
  const hasQuantity = typeof quantity === "number" ? quantity > 0 : String(quantity ?? "").trim().length > 0;
  const unit = numberValue(unitPrice);
  const amount = numberValue(total) || qty * unit;
  // A quantidade pode estar preenchida, mas somente itens orçados entram na
  // CAP setorizada. Linhas de catálogo com total zero não são compras previstas.
  if (!item || !hasQuantity || amount <= 0 || numberValue(item) || clean(item).startsWith("TOTAL")) return null;
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
        for (let rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex += 1) {
          const row = rows[rowIndex];
          const description = row[descriptionIndex];
          if (clean(description).startsWith("TOTAL")) break;
          const parsed = makeItem(sheetName, rowIndex + 1, description, row[qtyIndex], row[unitIndex], row[totalIndex]);
          if (parsed) items.push(parsed);
        }
      }
      continue;
    }

    // A primeira parte de Marketing é o orçamento selecionado. Depois do total
    // geral, a planilha contém tabelas de composição por faixa de refeições;
    // elas servem de referência e não devem virar itens da implantação.
    const marketingEnd = sheet === "MARKETING"
      ? rows.findIndex((row) => row.some((cell) => clean(cell).startsWith("TOTAL GERAL MARKETING")))
      : -1;
    const rowsToImport = marketingEnd >= 0 ? rows.slice(0, marketingEnd + 1) : rows;

    let block: CapBlock | null = null;
    rowsToImport.forEach((row, rowIndex) => {
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
  const [loggedUser, setLoggedUser] = useState<{ username: string; role: AuthRole; label: string } | null>(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [unitConfirmed, setUnitConfirmed] = useState(false);
  const [unitDraft, setUnitDraft] = useState("Cozinha Central Lisboa");
  const [decisions, setDecisions] = useState<Record<string, ItemDecision>>({});
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [proposalName, setProposalName] = useState("");
  const [proposalDetails, setProposalDetails] = useState("");
  const [proposalUnitPrice, setProposalUnitPrice] = useState("");
  const [workflowStorageReady, setWorkflowStorageReady] = useState(false);
  const [capRegistry, setCapRegistry] = useState<CapRegistryEntry[]>([]);
  const [evidenceIds, setEvidenceIds] = useState<number[]>([6, 8]);
  const [imported, setImported] = useState(false);
  const [importedCapItems, setImportedCapItems] = useState<CapItem[]>([]);
  const [importedFileName, setImportedFileName] = useState("");
  const [importError, setImportError] = useState("");
  const [unitName, setUnitName] = useState("Cozinha Central Lisboa");
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<Status | null>(null);
  const [profileFilterReady, setProfileFilterReady] = useState(false);

  // Avoid a native select change before React finishes activating the page.
  // Without this guard, the label can say RH while the CAP still has GEOS state.
  useEffect(() => {
    setProfileFilterReady(true);
  }, []);

  useEffect(() => {
    try {
      const storedDecisions = window.localStorage.getItem("lpgestao:ti-decisions");
      const storedCap = window.localStorage.getItem("lpgestao:cap-items");
      const storedRegistry = window.localStorage.getItem("lpgestao:cap-registry");
      if (storedDecisions) setDecisions(JSON.parse(storedDecisions) as Record<string, ItemDecision>);
      const parsedCap = storedCap ? JSON.parse(storedCap) as CapItem[] : [];
      if (storedRegistry) {
        const parsedRegistry = JSON.parse(storedRegistry) as CapRegistryEntry[];
        const realRegistry = parsedRegistry.filter((entry) => entry.fileName !== "CAP de demonstração" && entry.id !== "demo-cap");
        if (realRegistry.length) {
          setCapRegistry(realRegistry);
          const registeredItems = realRegistry[0].items;
          // Migrate a legacy full CAP only when it is larger than the registry.
          // A sector selection must never replace the registered full CAP.
          const sourceItems = parsedCap.length > registeredItems.length ? parsedCap : registeredItems;
          setImportedCapItems(sourceItems);
          setImported(true);
        } else if (parsedCap.length > 5) {
          // Migrate an older full CAP, but never revive the five-item demo CAP.
          setImportedCapItems(parsedCap);
          setImported(true);
          setCapRegistry([{ id: "migrated-cap", unitName: "Cozinha Central Lisboa", fileName: "CAP migrada", status: "PENDENTE", items: parsedCap }]);
        } else {
          setCapRegistry([]);
        }
      } else if (parsedCap.length > 5) {
        setImportedCapItems(parsedCap);
        setImported(true);
        setCapRegistry([{ id: "migrated-cap", unitName: "Cozinha Central Lisboa", fileName: "CAP migrada", status: "PENDENTE", items: parsedCap }]);
      } else {
        setCapRegistry([]);
      }
    } catch {
      // A sessão local corrompida não impede o usuário de iniciar uma nova.
    } finally {
      setWorkflowStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!workflowStorageReady) return;
    window.localStorage.setItem("lpgestao:ti-decisions", JSON.stringify(decisions));
  }, [decisions, workflowStorageReady]);

  useEffect(() => {
    if (!workflowStorageReady) return;
    window.localStorage.setItem("lpgestao:cap-registry", JSON.stringify(capRegistry));
  }, [capRegistry, workflowStorageReady]);

  const profile = profiles.find((item) => item.role === role) ?? profiles[0];
  // GEOS e Comercial são os únicos perfis com visão completa. Os demais só
  // passam pela barreira quando o setor do item é exatamente o seu setor.
  const canSee = (sector: Sector) => profile.scope === "completo" || profile.scope === sector;

  const visibleTasks = useMemo(
    () => tasks.filter((task) => canSee(task.sector) && (activeSector === "Todos" || task.sector === activeSector)),
    [activeSector, profile.scope, tasks],
  );

  const capItems = importedCapItems.length ? importedCapItems : fallbackCapItems;
  const hasFullCapAccess = role === "GEOS" || role === "Comercial";
  const visibleCapItems = capItems.filter((item) => {
    // This is deliberately keyed to the selected profile (not only to the
    // descriptive profile scope): a sector profile can never receive an item
    // tagged with another sector. GEOS and Comercial are the sole exceptions.
    const profileAllowsItem = hasFullCapAccess || item.sector === role;
    const activeSectorAllowsItem = activeSector === "Todos" || item.sector === activeSector;
    return profileAllowsItem && activeSectorAllowsItem;
  });
  const importedTotal = capItems.reduce((sum, item) => sum + item.total, 0);

  async function importCap(file: File) {
    setImportError("");
    try {
      const parsedItems = parseCapWorkbook(await file.arrayBuffer());
      if (!parsedItems.length) throw new Error("Nenhum item previsto foi encontrado nas abas conhecidas.");
      const detectedUnitName = extractUnitName(await file.arrayBuffer());
      setImportedCapItems(parsedItems);
      setDecisions({});
      setImportedFileName(file.name);
      const registeredUnit = detectedUnitName || unitDraft.trim() || "Unidade sem nome";
      setCapRegistry((current) => {
        const nextEntry: CapRegistryEntry = { id: `cap-${Date.now()}`, unitName: registeredUnit, fileName: file.name, status: "PENDENTE", items: parsedItems };
        return [...current.filter((entry) => entry.unitName !== registeredUnit), nextEntry];
      });
      if (detectedUnitName) setUnitName(detectedUnitName);
      setImported(true);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Não foi possível ler esta CAP.");
      setImported(false);
    }
  }

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = localUsers.find((user) => user.username === loginUser.trim().toLowerCase() && user.password === loginPassword);
    if (!found) {
      setLoginError("Usuário ou senha inválidos.");
      return;
    }
    setLoggedUser({ username: found.username, role: found.role, label: found.label });
    setRole(found.role);
    setLoginError("");
    setLoginPassword("");
    setUnitConfirmed(false);
  }

  function signOut() {
    setLoggedUser(null);
    setUnitConfirmed(false);
    setLoginUser("");
    setLoginPassword("");
  }

  function confirmCapItem(itemId: string) {
    setDecisions((current) => ({
      ...current,
      [itemId]: { status: "Aguardando GEOS", kind: "confirmacao", submittedAt: new Date().toISOString() },
    }));
  }

  function openProposal(item: CapItem) {
    setEditingProposalId(item.id);
    setProposalName(item.item);
    setProposalDetails("");
    setProposalUnitPrice(String(item.unitPrice));
  }

  function submitProposal(item: CapItem) {
    const parsedPrice = numberValue(proposalUnitPrice);
    if (!proposalName.trim() || parsedPrice <= 0) return;
    setDecisions((current) => ({
      ...current,
      [item.id]: {
        status: "Aguardando GEOS",
        kind: "substituicao",
        proposalName: proposalName.trim(),
        proposalDetails: proposalDetails.trim(),
        proposalUnitPrice: parsedPrice,
        submittedAt: new Date().toISOString(),
      },
    }));
    setEditingProposalId(null);
  }

  function approveDecision(itemId: string) {
    setDecisions((current) => ({ ...current, [itemId]: { ...current[itemId], status: "Aprovado GEOS" } }));
  }

  function rejectDecision(itemId: string) {
    setDecisions((current) => ({ ...current, [itemId]: { ...current[itemId], status: "Rejeitado GEOS", rejectionNote: "A substituição foi devolvida para revisão do setor." } }));
  }

  const riskCount = tasks.filter((task) => task.status === "Risco" || task.risk === "alto").length;
  const doneCount = visibleTasks.filter((task) => task.status === "Concluido").length;

  function moveTask(taskId: number, status: Status) {
    if (!loggedUser || (loggedUser.role !== "GEOS" && loggedUser.role !== "Comercial")) return;
    setTasks((currentTasks) => currentTasks.map((task) => task.id === taskId ? { ...task, status } : task));
    setDraggedTaskId(null);
    setDragOverStatus(null);
  }

  const tiWorkflowItems = capItems.filter((item) => item.sector === "TI");
  const workflowItems = tiWorkflowItems;
  const workflowComplete = tiWorkflowItems.length > 0 && tiWorkflowItems.every((item) => decisions[item.id]?.status === "Aprovado GEOS");
  const availableCaps = capRegistry;
  const statusForCap = (cap: CapRegistryEntry) => {
    const sectorItems = cap.items.filter((item) => item.sector === "TI");
    return sectorItems.length > 0 && sectorItems.every((item) => decisions[item.id]?.status === "Aprovado GEOS") ? "REALIZADA" : cap.status;
  };

  if (!loggedUser) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <div className="brand auth-brand">
            <img src="/brand/logo-lemospassos-badge.png" alt="Grupo LemosPassos" />
            <div><strong>LP Gestao</strong><small>Implantacao pos-CAP</small></div>
          </div>
          <p className="eyebrow">Acesso ao projeto</p>
          <h1>Entrar no LP Gestão</h1>
          <p className="auth-copy">Use seu acesso para acompanhar e validar os itens da unidade.</p>
          <form className="auth-form" onSubmit={signIn}>
            <label>Usuário<input value={loginUser} onChange={(event) => setLoginUser(event.target.value)} autoComplete="username" /></label>
            <label>Senha<input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} autoComplete="current-password" /></label>
            {loginError && <p className="import-error" role="alert">{loginError}</p>}
            <button className="primary-button" type="submit">Entrar</button>
          </form>
          <small className="auth-hint">Acesso TI criado para teste: usuário <b>ti</b>.</small>
        </section>
      </main>
    );
  }

  if (!unitConfirmed) {
    return (
      <main className="auth-shell">
        <section className="unit-card">
          <div className="unit-card-heading"><div><p className="eyebrow">Primeiro passo</p><h1>Qual unidade vamos tratar?</h1></div><button className="text-button" type="button" onClick={signOut}>Sair</button></div>
          <p className="auth-copy">Olá, {loggedUser.label}. Selecione a unidade e carregue a CAP base para iniciar a validação.</p>
          <div className="cap-registry-list">
            <p className="eyebrow">CAPs disponíveis</p>
            {!availableCaps.length && <p className="empty-registry">Nenhuma CAP real cadastrada para esta unidade. GEOS/Comercial devem cadastrar a CAP base.</p>}
            {availableCaps.map((cap) => (
              <button className="cap-registry-card" type="button" key={cap.id} onClick={() => { setImportedCapItems(cap.items); setImportedFileName(cap.fileName); setImported(true); setUnitDraft(cap.unitName); setUnitName(cap.unitName); setUnitConfirmed(true); }}>
                <span><b>CAP - {cap.unitName}</b><small>{cap.fileName}</small></span>
                <strong className={statusForCap(cap) === "REALIZADA" ? "registry-done" : "registry-pending"}>{statusForCap(cap)}</strong>
              </button>
            ))}
          </div>
          <label className="field-label">Unidade<input className="unit-select-input" value={unitDraft} onChange={(event) => setUnitDraft(event.target.value)} /></label>
          {(loggedUser.role === "GEOS" || loggedUser.role === "Comercial") && <label className="upload-dropzone"><input type="file" accept=".xlsm,.xlsx" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importCap(file); }} /><strong>{imported ? "Trocar CAP da unidade" : "Cadastrar CAP da unidade"}</strong><span>{imported ? `${capItems.length} itens encontrados na CAP.` : "Disponível somente para GEOS/Comercial."}</span></label>}
          <div className="unit-actions"><button className="primary-button" type="button" disabled={!imported} onClick={() => { setUnitName(unitDraft.trim() || "Unidade sem nome"); setUnitConfirmed(true); }}>Continuar para os itens</button></div>
          {importError && <p className="import-error" role="alert">{importError}</p>}
        </section>
      </main>
    );
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
        </nav>
        <div className="sidebar-card">
          <small>Data alvo</small>
          <strong>25/09/2026</strong>
          <span>{riskCount} pontos exigem atencao</span>
        </div>
        <div className="profile-switcher">
          <small>Usuário conectado</small>
          <strong>{loggedUser.username} · {loggedUser.role}</strong>
          <span>{loggedUser.label}</span>
          {false && <select
            aria-label="Perfil de demonstracao"
            disabled={!profileFilterReady}
            value={role}
            onChange={(event) => {
              setRole(event.target.value as Role);
              setActiveSector("Todos");
            }}
          >
            {profiles.map((item) => <option key={item.role} value={item.role}>{item.role}</option>)}
          </select>}
          <span>{profile.email} · {profile.scope === "completo" ? "visao completa" : `somente ${profile.scope}`}</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topline" id="painel">
          <div>
            <p className="eyebrow">Unidade em implantacao</p>
            <input className="unit-name-input" aria-label="Nome da unidade" value={unitName} onChange={(event) => setUnitName(event.target.value)} />
            <p className="active-role">Perfil ativo: {loggedUser.role} · {loggedUser.label}</p>
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

        <section className="panel workflow-panel" id="cap">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Validação setorial · {loggedUser.role}</p>
              <h2>{loggedUser.role === "TI" ? "Itens de TI da unidade" : "Aprovações recebidas do TI"}</h2>
            </div>
            <span className="badge">{workflowItems.length} itens TI</span>
          </div>
          {loggedUser.role === "TI" && workflowComplete && <div className="success-banner">Tudo OK: a GEOS aprovou todos os itens de TI desta unidade.</div>}
          {loggedUser.role === "TI" && !workflowComplete && <p className="workflow-intro">Confirme o item original ou proponha uma substituição. Toda alteração fica destacada e só passa a valer após aprovação da GEOS.</p>}
          <div className="workflow-list">
            {workflowItems.map((item) => {
              const decision = decisions[item.id];
              const isProposal = decision?.kind === "substituicao";
              const currentName = isProposal ? decision?.proposalName : item.item;
              const currentPrice = isProposal ? decision?.proposalUnitPrice : item.unitPrice;
              return (
                <article className={`workflow-item ${isProposal ? "has-substitution" : ""}`} key={item.id}>
                  <div className="workflow-item-main">
                    <div><span className="item-sector">{item.sector}</span><strong>{item.item}</strong></div>
                    <small>CAP: {item.quantity} un. · R$ {item.unitPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} · Total R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</small>
                  </div>
                  {isProposal && <div className="substitution-callout"><b>Substituição proposta:</b> {currentName} · R$ {currentPrice?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}<span>{decision?.proposalDetails || "Sem justificativa adicional."}</span></div>}
                  <span className={`workflow-status status-${(decision?.status ?? "Pendente setor").toLowerCase().replaceAll(" ", "-")}`}>{decision?.status ?? "Pendente setor"}</span>
                  {loggedUser.role === "TI" && (!decision || decision.status === "Rejeitado GEOS") && <div className="workflow-actions"><button className="secondary-button" type="button" onClick={() => confirmCapItem(item.id)}>Confirmar item</button><button className="evidence-button" type="button" onClick={() => openProposal(item)}>Propor substituição</button></div>}
                  {loggedUser.role === "TI" && decision?.status === "Aguardando GEOS" && <small className="pending-note">Enviado para análise da GEOS. A alteração ainda não está efetivada.</small>}
                  {loggedUser.role === "TI" && decision?.status === "Rejeitado GEOS" && <small className="rejection-note">{decision.rejectionNote} Faça uma nova confirmação ou proponha outra opção.</small>}
                  {loggedUser.role !== "TI" && decision?.status === "Aguardando GEOS" && <div className="workflow-actions"><button className="primary-button compact-button" type="button" onClick={() => approveDecision(item.id)}>Aprovar {isProposal ? "substituição" : "item"}</button>{isProposal && <button className="reject-button" type="button" onClick={() => rejectDecision(item.id)}>Rejeitar substituição</button>}</div>}
                  {editingProposalId === item.id && <div className="proposal-form"><label>Novo item / modelo<input value={proposalName} onChange={(event) => setProposalName(event.target.value)} /></label><label>Configuração ou justificativa<textarea value={proposalDetails} onChange={(event) => setProposalDetails(event.target.value)} /></label><label>Valor unitário<input inputMode="decimal" value={proposalUnitPrice} onChange={(event) => setProposalUnitPrice(event.target.value)} /></label><div className="workflow-actions"><button className="primary-button compact-button" type="button" onClick={() => submitProposal(item)}>Enviar para GEOS</button><button className="text-button" type="button" onClick={() => setEditingProposalId(null)}>Cancelar</button></div></div>}
                </article>
              );
            })}
          </div>
        </section>

        <section className="split" id="cap-base">
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
                <div className="cap-row" key={item.id}>
                  <span>{item.sector}</span>
                  <strong>{item.item}</strong>
                  <small>{item.quantity} un. · R$ {item.unitPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</small>
                  <em>{item.decision}</em>
                  <b>R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
                </div>
              ))}
            </div>
            <p className="panel-footnote">{imported ? `CAP importada: ${importedFileName}. Abas reconhecidas: Informática, Mão de obra, Equipamentos, Utensílios e Marketing.` : "Nenhum arquivo enviado. O importador aceita o padrão CAP Lemos Passos em XLSM/XLSX."}</p>
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
