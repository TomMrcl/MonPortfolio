"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  BarChart2, FileText, Receipt, Plus, Trash2, Download, Eye,
  TrendingUp, Smartphone, ChevronRight, X, ChevronDown,
  Clock, CalendarDays, Percent, FolderOpen,
  Wrench, CreditCard, ArrowRight, CheckCircle2,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Invoice = {
  id: string;
  number: string;
  client: string;
  email: string;
  phone: string | null;
  project: string;
  services: string[];
  prices: Record<string, number> | null;
  amount: number;
  status: string;
  quoteId: string | null;
  notes: string | null;
  dueDate: string | null;
  createdAt: string;
};

type InvoiceFormState = {
  client: string;
  email: string;
  phone: string;
  project: string;
  services: string[];
  prices: Record<string, number>;
  customServices: CustomService[];
  notes: string;
  dueDate: string;
  quoteId: string;
};

type FinancesData = {
  totalPaid: number;
  totalPending: number;
  thisMonthRevenue: number;
  conversionRate: number;
  sentCount: number;
  acceptedCount: number;
  refusedCount: number;
  avgAmount: number;
  revenueChart: { month: string; amount: number }[];
  topServices: { name: string; count: number }[];
  recentPaid: { id: string; number: string; client: string; amount: number; createdAt: string }[];
};

type Project = {
  id: string;
  name: string;
  client: string;
  description: string | null;
  status: string;
  progress: number;
  quoteId: string | null;
  invoiceId: string | null;
  quoteStatus: string | null;
  paid: boolean;
  maintenance: boolean;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
};

type ProjectFormState = {
  name: string;
  client: string;
  description: string;
  quoteId: string;
  invoiceId: string;
  quoteStatus: string;
  paid: boolean;
  maintenance: boolean;
  startDate: string;
  endDate: string;
  notes: string;
};

type AnalyticsData = {
  total: number;
  byPath: { path: string; count: number }[];
  byDevice: { device: string; count: number }[];
  last30Days: number;
  dailyChart: { date: string; count: number }[];
};

type Quote = {
  id: string;
  client: string;
  email: string;
  phone: string | null;
  project: string;
  services: string[];
  prices: Record<string, number> | null;
  discountType: string;
  discountValue: number;
  amount: number;
  status: string;
  notes: string | null;
  createdAt: string;
};

type CustomService = { id: string; label: string; price: number };

type FormState = {
  client: string;
  email: string;
  phone: string;
  project: string;
  services: string[];
  prices: Record<string, number>;
  customServices: CustomService[];
  discount: { type: "€" | "%"; value: number };
  notes: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const SERVICE_GROUPS = [
  {
    category: "Design",
    items: [
      { label: "Conception UX/UI",              price: 300 },
      { label: "Maquettes Figma",               price: 150 },
      { label: "Charte graphique",              price: 250 },
      { label: "Logo & identité visuelle",      price: 200 },
    ],
  },
  {
    category: "Développement Front-end",
    items: [
      { label: "Landing page",                  price: 400 },
      { label: "Site vitrine (≤ 5 pages)",      price: 800 },
      { label: "Blog / CMS",                    price: 600 },
      { label: "E-commerce",                    price: 1500 },
      { label: "Développement React / Next.js", price: 400 },
      { label: "Intégration HTML / CSS",        price: 200 },
    ],
  },
  {
    category: "Développement Back-end",
    items: [
      { label: "API REST",                      price: 300 },
      { label: "Base de données",               price: 400 },
      { label: "Authentification & Sécurité",   price: 300 },
      { label: "Tableau de bord admin",         price: 400 },
    ],
  },
  {
    category: "SEO & Performance",
    items: [
      { label: "Optimisation SEO",              price: 150 },
      { label: "Audit SEO complet",             price: 200 },
      { label: "Core Web Vitals",               price: 150 },
    ],
  },
  {
    category: "Production & Maintenance",
    items: [
      { label: "Mise en production",            price: 200 },
      { label: "Config. hébergement & DNS",     price: 100  },
      { label: "Maintenance mensuelle",         price: 30  },
      { label: "Formation / prise en main",     price: 150 },
      { label: "1er mois Maintenance offerte",           price: 0   },
    ],
  },
] satisfies { category: string; items: { label: string; price: number }[] }[];

const SERVICES = SERVICE_GROUPS.flatMap((g) => g.items);

const STATUS = {
  draft:    { label: "Brouillon", cls: "bg-neutral-600 text-neutral-200" },
  sent:     { label: "Envoyé",    cls: "bg-blue-500/20 text-blue-300" },
  accepted: { label: "Accepté",   cls: "bg-emerald-500/20 text-emerald-300" },
  refused:  { label: "Refusé",    cls: "bg-red-500/20 text-red-300" },
} as const;

const EMPTY_FORM: FormState = {
  client: "", email: "", phone: "", project: "",
  services: [], prices: {}, customServices: [],
  discount: { type: "€", value: 0 },
  notes: "",
};

const INV_STATUS = {
  pending:   { label: "En attente", cls: "bg-orange-500/20 text-orange-300" },
  paid:      { label: "Payée",      cls: "bg-emerald-500/20 text-emerald-300" },
  cancelled: { label: "Annulée",   cls: "bg-red-500/20 text-red-300" },
} as const;

const EMPTY_INV_FORM: InvoiceFormState = {
  client: "", email: "", phone: "", project: "",
  services: [], prices: {}, customServices: [],
  notes: "", dueDate: "", quoteId: "",
};

const PIE_COLORS = ["#7c3aed", "#a78bfa", "#5b21b6", "#8b5cf6", "#6d28d9", "#c4b5fd"];

const PROJ_STATUS: Record<string, { label: string; cls: string; nextStatus: string | null; nextLabel: string | null }> = {
  incoming:    { label: "À venir",  cls: "bg-blue-500/20 text-blue-300",       nextStatus: "in_progress", nextLabel: "→ En cours" },
  in_progress: { label: "En cours", cls: "bg-amber-500/20 text-amber-300",     nextStatus: "completed",   nextLabel: "→ Terminé"  },
  completed:   { label: "Terminé",  cls: "bg-emerald-500/20 text-emerald-300", nextStatus: null,           nextLabel: null          },
};

const PROJ_QUOTE_BADGE: Record<string, { label: string; cls: string }> = {
  draft:    { label: "Devis brouillon",  cls: "bg-neutral-600/40 text-neutral-400" },
  sent:     { label: "Devis envoyé",     cls: "bg-blue-500/20 text-blue-300"       },
  accepted: { label: "Devis accepté",    cls: "bg-emerald-500/20 text-emerald-300" },
  refused:  { label: "Devis refusé",     cls: "bg-red-500/20 text-red-300"         },
};

const EMPTY_PROJ_FORM: ProjectFormState = {
  name: "", client: "", description: "",
  quoteId: "", invoiceId: "", quoteStatus: "",
  paid: false, maintenance: false,
  startDate: "", endDate: "", notes: "",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon,
}: {
  label: string; value: string | number; sub?: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 flex flex-col gap-3">
      <div className="text-purple-400">{icon}</div>
      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-semibold text-white mt-0.5 truncate">{value}</p>
        {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status as keyof typeof STATUS] ?? STATUS.draft;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function QuoteRow({
  quote, onStatus, onDelete, onPdf,
}: {
  quote: Quote;
  onStatus: (id: string, s: string) => void;
  onDelete: (id: string) => void;
  onPdf: (id: string, client: string) => void;
}) {
  type Action = { label: string; next: string; color: string };
  const actions: Action[] = [];
  if (quote.status === "draft")
    actions.push({ label: "Marquer envoyé", next: "sent",     color: "text-blue-400 hover:text-blue-300" });
  if (quote.status === "sent")
    actions.push(
      { label: "Accepter", next: "accepted", color: "text-emerald-400 hover:text-emerald-300" },
      { label: "Refuser",  next: "refused",  color: "text-red-400 hover:text-red-300" },
    );
  if (quote.status === "accepted" || quote.status === "refused")
    actions.push({ label: "↩ Brouillon", next: "draft", color: "text-neutral-400 hover:text-neutral-300" });

  return (
    <tr className="border-b border-neutral-700/50 last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-5 py-4">
        <p className="text-sm text-white font-medium">{quote.client}</p>
        <p className="text-xs text-neutral-500">{quote.email}</p>
      </td>
      <td className="px-5 py-4 hidden md:table-cell text-sm text-neutral-300 max-w-[180px] truncate">
        {quote.project}
      </td>
      <td className="px-5 py-4 text-sm font-semibold text-white whitespace-nowrap">
        {quote.amount.toLocaleString("fr-FR")} €
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={quote.status} />
      </td>
      <td className="px-5 py-4 hidden sm:table-cell text-xs text-neutral-500">
        {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1 flex-wrap">
          {actions.map((a) => (
            <button
              key={a.next}
              onClick={() => onStatus(quote.id, a.next)}
              className={`text-xs ${a.color} px-2 py-1 rounded hover:bg-neutral-700 transition-colors`}
            >
              {a.label}
            </button>
          ))}
          <button
            onClick={() => onPdf(quote.id, quote.client)}
            title="Télécharger PDF"
            className="p-1.5 rounded text-neutral-400 hover:text-purple-400 hover:bg-neutral-700 transition-colors"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => onDelete(quote.id)}
            title="Supprimer"
            className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function InvoiceRow({
  invoice, onStatus, onDelete, onPdf,
}: {
  invoice: Invoice;
  onStatus: (id: string, s: string) => void;
  onDelete: (id: string) => void;
  onPdf: (id: string, number: string) => void;
}) {
  const s = INV_STATUS[invoice.status as keyof typeof INV_STATUS] ?? INV_STATUS.pending;
  type Action = { label: string; next: string; color: string };
  const actions: Action[] = [];
  if (invoice.status === "pending")
    actions.push(
      { label: "Marquer payée",   next: "paid",      color: "text-emerald-400 hover:text-emerald-300" },
      { label: "Annuler",         next: "cancelled", color: "text-red-400 hover:text-red-300" },
    );
  if (invoice.status !== "pending")
    actions.push({ label: "↩ En attente", next: "pending", color: "text-neutral-400 hover:text-neutral-300" });

  return (
    <tr className="border-b border-neutral-700/50 last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-5 py-4">
        <p className="text-xs font-mono text-neutral-500">{invoice.number}</p>
        <p className="text-sm text-white font-medium">{invoice.client}</p>
      </td>
      <td className="px-5 py-4 hidden md:table-cell text-sm text-neutral-300 max-w-[180px] truncate">
        {invoice.project}
      </td>
      <td className="px-5 py-4 text-sm font-semibold text-white whitespace-nowrap">
        {invoice.amount.toLocaleString("fr-FR")} €
      </td>
      <td className="px-5 py-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>
      </td>
      <td className="px-5 py-4 hidden sm:table-cell text-xs text-neutral-500">
        {invoice.dueDate
          ? new Date(invoice.dueDate).toLocaleDateString("fr-FR")
          : new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1 flex-wrap">
          {actions.map((a) => (
            <button
              key={a.next}
              onClick={() => onStatus(invoice.id, a.next)}
              className={`text-xs ${a.color} px-2 py-1 rounded hover:bg-neutral-700 transition-colors`}
            >
              {a.label}
            </button>
          ))}
          <button
            onClick={() => onPdf(invoice.id, invoice.number)}
            title="Télécharger PDF"
            className="p-1.5 rounded text-neutral-400 hover:text-purple-400 hover:bg-neutral-700 transition-colors"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => onDelete(invoice.id)}
            title="Supprimer"
            className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ProjectCard({
  project,
  onProgressChange,
  onProgressSave,
  onMove,
  onDelete,
}: {
  project: Project;
  onProgressChange: (id: string, val: number) => void;
  onProgressSave: (id: string, val: number) => void;
  onMove: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}) {
  const ps = PROJ_STATUS[project.status] ?? PROJ_STATUS.incoming;
  const qb = project.quoteStatus ? PROJ_QUOTE_BADGE[project.quoteStatus] : null;
  const { nextStatus, nextLabel } = ps;

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 space-y-3 hover:border-neutral-600 transition-colors">
      <div>
        <p className="text-sm font-semibold text-white leading-tight">{project.name}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{project.client}</p>
        {project.description && (
          <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{project.description}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-neutral-500">Progression</span>
          <span className="text-xs font-medium text-white">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-neutral-700 rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <input
          type="range"
          min={0} max={100}
          value={project.progress}
          onChange={(e) => onProgressChange(project.id, parseInt(e.target.value))}
          onPointerUp={(e) => onProgressSave(project.id, parseInt((e.target as HTMLInputElement).value))}
          className="w-full h-1 accent-purple-500 cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {qb && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${qb.cls}`}>{qb.label}</span>
        )}
        <span className={`flex items-center gap-1 text-xs ${project.paid ? "text-emerald-400" : "text-neutral-600"}`}>
          <CreditCard size={10} />
          {project.paid ? "Payé" : "Non payé"}
        </span>
        <span className={`flex items-center gap-1 text-xs ${project.maintenance ? "text-purple-400" : "text-neutral-600"}`}>
          <Wrench size={10} />
          {project.maintenance ? "Maintenance" : "Sans maint."}
        </span>
      </div>

      {(project.startDate || project.endDate) && (
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          {project.startDate && <span>{new Date(project.startDate).toLocaleDateString("fr-FR")}</span>}
          {project.startDate && project.endDate && <ArrowRight size={10} className="shrink-0" />}
          {project.endDate && <span>{new Date(project.endDate).toLocaleDateString("fr-FR")}</span>}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-neutral-700/50">
        {nextStatus ? (
          <button
            onClick={() => onMove(project.id, nextStatus)}
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowRight size={12} />
            {nextLabel}
          </button>
        ) : (
          <span className="flex items-center gap-1 text-xs text-emerald-500/70">
            <CheckCircle2 size={11} /> Terminé
          </span>
        )}
        <button
          onClick={() => onDelete(project.id)}
          className="p-1 text-neutral-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [tab, setTab]           = useState<"analytics" | "quotes" | "invoices" | "finances" | "projects">("analytics");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [quotes, setQuotes]     = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [finances, setFinances] = useState<FinancesData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjForm, setShowProjForm] = useState(false);
  const [projForm, setProjForm]         = useState<ProjectFormState>(EMPTY_PROJ_FORM);
  const [projSaving, setProjSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(SERVICE_GROUPS.map((g) => g.category)),
  );
  const toggleGroupOpen = (cat: string) =>
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const [showInvForm, setShowInvForm] = useState(false);
  const [invForm, setInvForm]         = useState<InvoiceFormState>(EMPTY_INV_FORM);
  const [invSaving, setInvSaving]     = useState(false);
  const [invOpenGroups, setInvOpenGroups] = useState<Set<string>>(
    () => new Set(SERVICE_GROUPS.map((g) => g.category)),
  );
  const toggleInvGroupOpen = (cat: string) =>
    setInvOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setAnalytics).catch(() => {});
    fetch("/api/quotes").then((r) => r.json()).then(setQuotes).catch(() => {});
    fetch("/api/invoices").then((r) => r.json()).then(setInvoices).catch(() => {});
    fetch("/api/finances").then((r) => r.json()).then(setFinances).catch(() => {});
    fetch("/api/projects").then((r) => r.json()).then(setProjects).catch(() => {});
  }, []);

  // ── Computed ────────────────────────────────────────────────────────────────

  const formSubtotal =
    form.services.reduce(
      (sum, lbl) => sum + (form.prices[lbl] ?? SERVICES.find((s) => s.label === lbl)?.price ?? 0),
      0,
    ) + form.customServices.reduce((sum, cs) => sum + (cs.price || 0), 0);

  const discountAmount =
    form.discount.value > 0
      ? form.discount.type === "%"
        ? (formSubtotal * form.discount.value) / 100
        : form.discount.value
      : 0;

  const formTotal = Math.max(0, formSubtotal - discountAmount);

  const mobile     = analytics?.byDevice.find((d) => d.device === "mobile")?.count ?? 0;
  const desktop    = analytics?.byDevice.find((d) => d.device === "desktop")?.count ?? 0;
  const topPage    = analytics?.byPath[0]?.path ?? "—";
  const mobileRatio = analytics
    ? `${Math.round((mobile / Math.max(analytics.total, 1)) * 100)}% mobile`
    : "—";

  const completedRevenue = projects
    .filter((p) => p.status === "completed" && p.invoiceId)
    .reduce((sum, p) => sum + (invoices.find((i) => i.id === p.invoiceId)?.amount ?? 0), 0);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleService = (lbl: string) =>
    setForm((p) => {
      if (p.services.includes(lbl)) {
        const newPrices = { ...p.prices };
        delete newPrices[lbl];
        return { ...p, services: p.services.filter((s) => s !== lbl), prices: newPrices };
      }
      const defaultPrice = SERVICES.find((s) => s.label === lbl)?.price ?? 0;
      return { ...p, services: [...p.services, lbl], prices: { ...p.prices, [lbl]: defaultPrice } };
    });

  const addCustomService = () =>
    setForm((p) => ({
      ...p,
      customServices: [
        ...p.customServices,
        { id: crypto.randomUUID(), label: "", price: 0 },
      ],
    }));

  const updateCustomService = (id: string, field: "label" | "price", val: string) =>
    setForm((p) => ({
      ...p,
      customServices: p.customServices.map((cs) =>
        cs.id === id
          ? { ...cs, [field]: field === "price" ? parseFloat(val) || 0 : val }
          : cs,
      ),
    }));

  const removeCustomService = (id: string) =>
    setForm((p) => ({
      ...p,
      customServices: p.customServices.filter((cs) => cs.id !== id),
    }));

  const createQuote = async () => {
    if (!form.client || !form.email || !form.project || !form.services.length) return;
    setSaving(true);
    try {
      const allServices = [
        ...form.services,
        ...form.customServices.filter((cs) => cs.label.trim()).map((cs) => cs.label.trim()),
      ];
      const allPrices = {
        ...form.prices,
        ...Object.fromEntries(
          form.customServices
            .filter((cs) => cs.label.trim())
            .map((cs) => [cs.label.trim(), cs.price]),
        ),
      };
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          services: allServices,
          prices: allPrices,
          discountType: form.discount.type,
          discountValue: form.discount.value,
          amount: formTotal,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setQuotes((p) => [created, ...p]);
        setShowForm(false);
        setForm(EMPTY_FORM);
      }
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setQuotes((p) => p.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Supprimer ce devis définitivement ?")) return;
    const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) setQuotes((p) => p.filter((q) => q.id !== id));
  };

  const downloadPdf = async (id: string, client: string) => {
    const res = await fetch(`/api/quotes/${id}/pdf`);
    if (!res.ok) return;
    const url = URL.createObjectURL(await res.blob());
    Object.assign(document.createElement("a"), {
      href: url,
      download: `devis-${client.toLowerCase().replace(/\s+/g, "-")}.pdf`,
    }).click();
    URL.revokeObjectURL(url);
  };

  // ── Invoice handlers ─────────────────────────────────────────────────────────

  const invSubtotal =
    invForm.services.reduce(
      (sum, lbl) => sum + (invForm.prices[lbl] ?? SERVICES.find((s) => s.label === lbl)?.price ?? 0),
      0,
    ) + invForm.customServices.reduce((sum, cs) => sum + (cs.price || 0), 0);

  const fillFromQuote = (qid: string) => {
    const q = quotes.find((x) => x.id === qid);
    if (!q) { setInvForm((p) => ({ ...p, quoteId: qid })); return; }
    setInvForm((p) => ({
      ...p,
      quoteId: qid,
      client: q.client,
      email: q.email,
      phone: q.phone ?? "",
      project: q.project,
      services: q.services,
      prices: q.prices ?? {},
      customServices: [],
    }));
  };

  const toggleInvService = (lbl: string) =>
    setInvForm((p) => {
      if (p.services.includes(lbl)) {
        const newPrices = { ...p.prices };
        delete newPrices[lbl];
        return { ...p, services: p.services.filter((s) => s !== lbl), prices: newPrices };
      }
      const defaultPrice = SERVICES.find((s) => s.label === lbl)?.price ?? 0;
      return { ...p, services: [...p.services, lbl], prices: { ...p.prices, [lbl]: defaultPrice } };
    });

  const addInvCustomService = () =>
    setInvForm((p) => ({
      ...p,
      customServices: [...p.customServices, { id: crypto.randomUUID(), label: "", price: 0 }],
    }));

  const updateInvCustomService = (id: string, field: "label" | "price", val: string) =>
    setInvForm((p) => ({
      ...p,
      customServices: p.customServices.map((cs) =>
        cs.id === id ? { ...cs, [field]: field === "price" ? parseFloat(val) || 0 : val } : cs,
      ),
    }));

  const removeInvCustomService = (id: string) =>
    setInvForm((p) => ({ ...p, customServices: p.customServices.filter((cs) => cs.id !== id) }));

  const createInvoice = async () => {
    if (!invForm.client || !invForm.email || !invForm.project || !invForm.services.length) return;
    setInvSaving(true);
    try {
      const allServices = [
        ...invForm.services,
        ...invForm.customServices.filter((cs) => cs.label.trim()).map((cs) => cs.label.trim()),
      ];
      const allPrices = {
        ...invForm.prices,
        ...Object.fromEntries(
          invForm.customServices.filter((cs) => cs.label.trim()).map((cs) => [cs.label.trim(), cs.price]),
        ),
      };
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...invForm,
          services: allServices,
          prices: allPrices,
          amount: invSubtotal,
          quoteId: invForm.quoteId || null,
          dueDate: invForm.dueDate || null,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setInvoices((p) => [created, ...p]);
        setShowInvForm(false);
        setInvForm(EMPTY_INV_FORM);
      }
    } finally {
      setInvSaving(false);
    }
  };

  const changeInvStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setInvoices((p) => p.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Supprimer cette facture définitivement ?")) return;
    const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) setInvoices((p) => p.filter((inv) => inv.id !== id));
  };

  const downloadInvPdf = async (id: string, number: string) => {
    const res = await fetch(`/api/invoices/${id}/pdf`);
    if (!res.ok) return;
    const url = URL.createObjectURL(await res.blob());
    Object.assign(document.createElement("a"), { href: url, download: `${number}.pdf` }).click();
    URL.revokeObjectURL(url);
  };

  // ── Project handlers ─────────────────────────────────────────────────────────

  const fillProjFromQuote = (qid: string) => {
    const q = quotes.find((x) => x.id === qid);
    setProjForm((p) => ({
      ...p,
      quoteId: qid,
      ...(q ? { client: q.client, quoteStatus: q.status } : {}),
    }));
  };

  const createProject = async () => {
    if (!projForm.name || !projForm.client) return;
    setProjSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...projForm,
          quoteId:     projForm.quoteId     || null,
          invoiceId:   projForm.invoiceId   || null,
          quoteStatus: projForm.quoteStatus || null,
          startDate:   projForm.startDate   || null,
          endDate:     projForm.endDate     || null,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setProjects((p) => [created, ...p]);
        setShowProjForm(false);
        setProjForm(EMPTY_PROJ_FORM);
      }
    } finally {
      setProjSaving(false);
    }
  };

  const setProjectProgress = (id: string, progress: number) =>
    setProjects((p) => p.map((proj) => (proj.id === id ? { ...proj, progress } : proj)));

  const saveProjectProgress = async (id: string, progress: number) => {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress }),
    });
  };

  const moveProject = async (id: string, status: string) => {
    setProjects((p) => p.map((proj) => (proj.id === id ? { ...proj, status } : proj)));
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Supprimer ce projet définitivement ?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok || res.status === 204) setProjects((p) => p.filter((proj) => proj.id !== id));
  };

  // ── Shared styles ────────────────────────────────────────────────────────────

  const inputCls =
    "w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm " +
    "text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-500 transition-colors";

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-0.5">tomarchal.fr</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-neutral-800 border border-neutral-700 rounded-xl w-fit mb-8">
          {(
            [
              { key: "analytics", label: "Analytics", icon: <BarChart2 size={15} /> },
              { key: "quotes",    label: "Devis",     icon: <FileText size={15} /> },
              { key: "invoices",  label: "Factures",  icon: <Receipt size={15} /> },
              { key: "finances",  label: "Finances",  icon: <TrendingUp size={15} /> },
              { key: "projects",  label: "Projets",   icon: <FolderOpen size={15} /> },
            ] as const
          ).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key ? "bg-purple-600 text-white shadow" : "text-neutral-400 hover:text-white"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* ═══════════════════ ANALYTICS ═══════════════════ */}
        {tab === "analytics" && (
          <div className="space-y-6">

            {/* 4 stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total des vues"     value={analytics?.total ?? "—"}        icon={<Eye size={18} />} />
              <StatCard label="Vues ce mois"       value={analytics?.last30Days ?? "—"}   icon={<TrendingUp size={18} />} sub="30 derniers jours" />
              <StatCard label="Page la plus visitée" value={topPage}                      icon={<ChevronRight size={18} />} />
              <StatCard label="Mobile / Desktop"   value={mobileRatio}                    icon={<Smartphone size={18} />} sub={`${desktop} desktop · ${mobile} mobile`} />
            </div>

            {/* Bar chart */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-6">
                Visites — 7 derniers jours
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics?.dailyChart ?? []} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d: string) => d.slice(5)}
                    tick={{ fill: "#737373", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#737373", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    allowDecimals={false} width={28}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(124,58,237,0.08)" }}
                    contentStyle={{ background: "#1f1f1f", border: "1px solid #333", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#e5e5e5" }}
                    itemStyle={{ color: "#a78bfa" }}
                    formatter={(v: number) => [`${v} vue${v > 1 ? "s" : ""}`, ""]}
                  />
                  <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top pages table */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-700">
                <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                  Pages les plus visitées
                </h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-700/60">
                    <th className="text-left px-5 py-3 text-xs text-neutral-500 font-medium">Page</th>
                    <th className="text-right px-5 py-3 text-xs text-neutral-500 font-medium">Vues</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.byPath.map((p, i) => (
                    <tr key={i} className="border-b border-neutral-700/40 last:border-0 hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-mono text-sm text-neutral-300">{p.path}</td>
                      <td className="px-5 py-3 text-right font-semibold text-white">{p.count}</td>
                    </tr>
                  ))}
                  {!analytics && (
                    <tr>
                      <td colSpan={2} className="px-5 py-8 text-center text-neutral-600 text-sm">
                        Chargement…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══════════════════ DEVIS ═══════════════════════ */}
        {tab === "quotes" && (
          <div className="space-y-5">

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-400">{quotes.length} devis</p>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={15} />
                Nouveau devis
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-5">Créer un devis</h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Nom client *",           key: "client",  placeholder: "Jean Dupont",           type: "text"  },
                    { label: "Email *",                key: "email",   placeholder: "jean@exemple.fr",       type: "email" },
                    { label: "Téléphone",              key: "phone",   placeholder: "06 XX XX XX XX",        type: "text"  },
                    { label: "Description du projet *",key: "project", placeholder: "Site vitrine restaurant",type: "text"  },
                  ].map(({ label, key, placeholder, type }) => (
                    <div key={key}>
                      <label className="block text-xs text-neutral-500 mb-1.5">{label}</label>
                      <input
                        type={type}
                        className={inputCls}
                        placeholder={placeholder}
                        value={form[key as keyof FormState] as string}
                        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>

                {/* Services par groupes */}
                <div className="mb-4">
                  <label className="block text-xs text-neutral-500 mb-2">Services *</label>
                  <div className="space-y-2">
                    {SERVICE_GROUPS.map((group) => {
                      const isOpen = openGroups.has(group.category);
                      const selectedInGroup = group.items.filter((s) =>
                        form.services.includes(s.label),
                      ).length;
                      return (
                        <div key={group.category} className="border border-neutral-700 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleGroupOpen(group.category)}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
                          >
                            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                              {group.category}
                            </span>
                            <div className="flex items-center gap-2">
                              {selectedInGroup > 0 && (
                                <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full">
                                  {selectedInGroup} sélectionné{selectedInGroup > 1 ? "s" : ""}
                                </span>
                              )}
                              <ChevronDown
                                size={14}
                                className={`text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </div>
                          </button>
                          {isOpen && (
                            <div className="grid sm:grid-cols-2 gap-1.5 p-2 bg-neutral-900/40">
                              {group.items.map((s) => {
                                const checked = form.services.includes(s.label);
                                return (
                                  <label
                                    key={s.label}
                                    className={`flex items-center gap-3 bg-neutral-900 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                                      checked
                                        ? "border-purple-500"
                                        : "border-neutral-700 hover:border-neutral-600"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="accent-purple-500 shrink-0"
                                      checked={checked}
                                      onChange={() => toggleService(s.label)}
                                    />
                                    <span className="flex-1 text-sm text-neutral-200 leading-tight">
                                      {s.label}
                                    </span>
                                    {checked ? (
                                      <input
                                        type="number"
                                        min={0}
                                        className="w-20 bg-neutral-800 border border-neutral-600 rounded px-2 py-0.5 text-sm text-white text-right focus:outline-none focus:border-purple-500 transition-colors"
                                        value={form.prices[s.label] ?? s.price}
                                        onChange={(e) =>
                                          setForm((p) => ({
                                            ...p,
                                            prices: {
                                              ...p.prices,
                                              [s.label]: parseFloat(e.target.value) || 0,
                                            },
                                          }))
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      <span className="text-xs text-neutral-600 shrink-0">
                                        {s.price === 0 ? "Offert" : `${s.price} €`}
                                      </span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Services custom */}
                <div className="mb-4">
                  {form.customServices.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {form.customServices.map((cs) => (
                        <div key={cs.id} className="flex gap-2 items-center">
                          <input
                            className={`${inputCls} flex-1`}
                            placeholder="Nom du service…"
                            value={cs.label}
                            onChange={(e) => updateCustomService(cs.id, "label", e.target.value)}
                          />
                          <input
                            type="number"
                            min={0}
                            className="w-28 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                            placeholder="Prix €"
                            value={cs.price || ""}
                            onChange={(e) => updateCustomService(cs.id, "price", e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomService(cs.id)}
                            className="p-2 text-neutral-500 hover:text-red-400 transition-colors shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={addCustomService}
                    className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus size={14} />
                    Ajouter un service custom
                  </button>
                </div>

                {/* Remise */}
                <div className="mb-5">
                  <label className="block text-xs text-neutral-500 mb-1.5">Remise</label>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden shrink-0">
                      {(["€", "%"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, discount: { ...p.discount, type: t } }))
                          }
                          className={`px-3 py-2 text-sm font-medium transition-colors ${
                            form.discount.type === t
                              ? "bg-purple-600 text-white"
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={form.discount.type === "%" ? 100 : undefined}
                      className={inputCls}
                      placeholder="0"
                      value={form.discount.value || ""}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          discount: { ...p.discount, value: parseFloat(e.target.value) || 0 },
                        }))
                      }
                    />
                    {discountAmount > 0 && (
                      <span className="text-sm text-purple-400 whitespace-nowrap shrink-0">
                        − {discountAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-5">
                  <label className="block text-xs text-neutral-500 mb-1.5">Notes internes</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder="Contexte, priorités…"
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                {/* Footer form */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                  <div>
                    {discountAmount > 0 && (
                      <p className="text-xs text-neutral-500 mb-0.5">
                        Sous-total{" "}
                        <span className="text-neutral-400">
                          {formSubtotal.toLocaleString("fr-FR")} €
                        </span>
                        {"  "}·{"  "}
                        Remise{" "}
                        <span className="text-purple-400">
                          − {discountAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                        </span>
                      </p>
                    )}
                    <p className="text-sm text-neutral-400">
                      Total TTC :{" "}
                      <span className="text-lg font-semibold text-white">
                        {formTotal.toLocaleString("fr-FR")} €
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                      className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={createQuote}
                      disabled={saving}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {saving ? "Enregistrement…" : "Créer le devis"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quotes table */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
              {quotes.length === 0 ? (
                <p className="px-5 py-12 text-center text-neutral-600 text-sm">
                  Aucun devis pour l'instant
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        {["Client", "Projet", "Montant", "Statut", "Date", "Actions"].map((h, i) => (
                          <th
                            key={h}
                            className={`px-5 py-3 text-xs text-neutral-500 font-medium ${
                              i === 5 ? "text-right" : "text-left"
                            } ${i === 1 ? "hidden md:table-cell" : ""} ${i === 4 ? "hidden sm:table-cell" : ""}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((q) => (
                        <QuoteRow
                          key={q.id}
                          quote={q}
                          onStatus={changeStatus}
                          onDelete={deleteQuote}
                          onPdf={downloadPdf}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════ FINANCES ════════════════════ */}
        {tab === "finances" && (
          <div className="space-y-6">

            {/* 4 stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Revenus encaissés"
                value={finances ? `${Math.round(finances.totalPaid).toLocaleString("fr-FR")} €` : "—"}
                icon={<TrendingUp size={18} />}
              />
              <StatCard
                label="En attente"
                value={finances ? `${Math.round(finances.totalPending).toLocaleString("fr-FR")} €` : "—"}
                icon={<Clock size={18} />}
              />
              <StatCard
                label="Ce mois-ci"
                value={finances ? `${Math.round(finances.thisMonthRevenue).toLocaleString("fr-FR")} €` : "—"}
                icon={<CalendarDays size={18} />}
              />
              <StatCard
                label="Taux de conversion"
                value={finances ? `${finances.conversionRate} %` : "—"}
                icon={<Percent size={18} />}
                sub={finances ? `${finances.acceptedCount} acceptés / ${finances.sentCount} envoyés ce mois` : undefined}
              />
            </div>

            {/* Revenus par mois */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
              <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-6">
                Revenus encaissés — 12 derniers mois
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={finances?.revenueChart ?? []} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#737373", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)}
                    tick={{ fill: "#737373", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    allowDecimals={false} width={36}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(124,58,237,0.08)" }}
                    contentStyle={{ background: "#1f1f1f", border: "1px solid #333", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "#e5e5e5" }}
                    itemStyle={{ color: "#a78bfa" }}
                    formatter={(v: number) => [`${v.toLocaleString("fr-FR")} €`, ""]}
                  />
                  <Bar dataKey="amount" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Donut services + Dernières transactions */}
            <div className="grid lg:grid-cols-2 gap-4">

              {/* Top services */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">
                  Services les plus demandés
                </h2>
                {(finances?.topServices.length ?? 0) > 0 ? (
                  <ResponsiveContainer width="100%" height={230}>
                    <PieChart>
                      <Pie
                        data={finances!.topServices}
                        cx="50%" cy="45%"
                        innerRadius={55} outerRadius={85}
                        dataKey="count" nameKey="name"
                      >
                        {finances!.topServices.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#1f1f1f", border: "1px solid #333", borderRadius: 8, fontSize: 12 }}
                        formatter={(v: number) => [`${v}×`]}
                      />
                      <Legend
                        iconType="circle" iconSize={8}
                        wrapperStyle={{ fontSize: 11, color: "#a3a3a3", paddingTop: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-neutral-600 text-sm py-16">Aucune donnée</p>
                )}
              </div>

              {/* Dernières transactions */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-neutral-700">
                  <h2 className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Dernières transactions
                  </h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-700/60">
                      <th className="text-left px-5 py-3 text-xs text-neutral-500 font-medium">Numéro</th>
                      <th className="text-left px-5 py-3 text-xs text-neutral-500 font-medium">Client</th>
                      <th className="text-right px-5 py-3 text-xs text-neutral-500 font-medium">Montant</th>
                      <th className="text-right px-5 py-3 text-xs text-neutral-500 font-medium hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(finances?.recentPaid ?? []).map((inv) => (
                      <tr key={inv.id} className="border-b border-neutral-700/40 last:border-0 hover:bg-white/[0.02]">
                        <td className="px-5 py-3 font-mono text-xs text-purple-400">{inv.number}</td>
                        <td className="px-5 py-3 text-neutral-300 truncate max-w-[120px]">{inv.client}</td>
                        <td className="px-5 py-3 text-right font-semibold text-white whitespace-nowrap">
                          {inv.amount.toLocaleString("fr-FR")} €
                        </td>
                        <td className="px-5 py-3 text-right text-neutral-500 hidden sm:table-cell">
                          {new Date(inv.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                    {!finances && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-neutral-600 text-sm">Chargement…</td>
                      </tr>
                    )}
                    {finances && finances.recentPaid.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-neutral-600 text-sm">Aucune facture payée</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════ FACTURES ════════════════════ */}
        {tab === "invoices" && (
          <div className="space-y-5">

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-400">{invoices.length} facture{invoices.length > 1 ? "s" : ""}</p>
              <button
                onClick={() => setShowInvForm((v) => !v)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={15} />
                Nouvelle facture
              </button>
            </div>

            {/* Form */}
            {showInvForm && (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-5">Créer une facture</h3>

                {/* Lier à un devis */}
                <div className="mb-4">
                  <label className="block text-xs text-neutral-500 mb-1.5">Lier à un devis accepté (optionnel)</label>
                  <select
                    className={inputCls}
                    value={invForm.quoteId}
                    onChange={(e) => fillFromQuote(e.target.value)}
                  >
                    <option value="">— Aucun devis —</option>
                    {quotes.filter((q) => q.status === "accepted").map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.client} — {q.project} ({q.amount.toLocaleString("fr-FR")} €)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Nom client *",            key: "client",  placeholder: "Jean Dupont",            type: "text"  },
                    { label: "Email *",                 key: "email",   placeholder: "jean@exemple.fr",        type: "email" },
                    { label: "Téléphone",               key: "phone",   placeholder: "06 XX XX XX XX",         type: "text"  },
                    { label: "Description du projet *", key: "project", placeholder: "Site vitrine restaurant", type: "text"  },
                  ].map(({ label, key, placeholder, type }) => (
                    <div key={key}>
                      <label className="block text-xs text-neutral-500 mb-1.5">{label}</label>
                      <input
                        type={type}
                        className={inputCls}
                        placeholder={placeholder}
                        value={invForm[key as keyof InvoiceFormState] as string}
                        onChange={(e) => setInvForm((p) => ({ ...p, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Date d'échéance</label>
                    <input
                      type="date"
                      className={inputCls}
                      value={invForm.dueDate}
                      onChange={(e) => setInvForm((p) => ({ ...p, dueDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <label className="block text-xs text-neutral-500 mb-2">Services *</label>
                  <div className="space-y-2">
                    {SERVICE_GROUPS.map((group) => {
                      const isOpen = invOpenGroups.has(group.category);
                      const selectedInGroup = group.items.filter((s) => invForm.services.includes(s.label)).length;
                      return (
                        <div key={group.category} className="border border-neutral-700 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleInvGroupOpen(group.category)}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
                          >
                            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wide">{group.category}</span>
                            <div className="flex items-center gap-2">
                              {selectedInGroup > 0 && (
                                <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full">
                                  {selectedInGroup} sélectionné{selectedInGroup > 1 ? "s" : ""}
                                </span>
                              )}
                              <ChevronDown size={14} className={`text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </div>
                          </button>
                          {isOpen && (
                            <div className="grid sm:grid-cols-2 gap-1.5 p-2 bg-neutral-900/40">
                              {group.items.map((s) => {
                                const checked = invForm.services.includes(s.label);
                                return (
                                  <label
                                    key={s.label}
                                    className={`flex items-center gap-3 bg-neutral-900 border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${checked ? "border-purple-500" : "border-neutral-700 hover:border-neutral-600"}`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="accent-purple-500 shrink-0"
                                      checked={checked}
                                      onChange={() => toggleInvService(s.label)}
                                    />
                                    <span className="flex-1 text-sm text-neutral-200 leading-tight">{s.label}</span>
                                    {checked ? (
                                      <input
                                        type="number"
                                        min={0}
                                        className="w-20 bg-neutral-800 border border-neutral-600 rounded px-2 py-0.5 text-sm text-white text-right focus:outline-none focus:border-purple-500"
                                        value={invForm.prices[s.label] ?? s.price}
                                        onChange={(e) =>
                                          setInvForm((p) => ({ ...p, prices: { ...p.prices, [s.label]: parseFloat(e.target.value) || 0 } }))
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      <span className="text-xs text-neutral-600 shrink-0">
                                        {s.price === 0 ? "Offert" : `${s.price} €`}
                                      </span>
                                    )}
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Services custom */}
                <div className="mb-4">
                  {invForm.customServices.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {invForm.customServices.map((cs) => (
                        <div key={cs.id} className="flex gap-2 items-center">
                          <input
                            className={`${inputCls} flex-1`}
                            placeholder="Nom du service…"
                            value={cs.label}
                            onChange={(e) => updateInvCustomService(cs.id, "label", e.target.value)}
                          />
                          <input
                            type="number"
                            min={0}
                            className="w-28 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            placeholder="Prix €"
                            value={cs.price || ""}
                            onChange={(e) => updateInvCustomService(cs.id, "price", e.target.value)}
                          />
                          <button type="button" onClick={() => removeInvCustomService(cs.id)} className="p-2 text-neutral-500 hover:text-red-400 transition-colors shrink-0">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={addInvCustomService}
                    className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus size={14} />
                    Ajouter un service custom
                  </button>
                </div>

                {/* Notes */}
                <div className="mb-5">
                  <label className="block text-xs text-neutral-500 mb-1.5">Notes internes</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder="Contexte, priorités…"
                    value={invForm.notes}
                    onChange={(e) => setInvForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                {/* Footer form */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                  <p className="text-sm text-neutral-400">
                    Total TTC :{" "}
                    <span className="text-lg font-semibold text-white">
                      {invSubtotal.toLocaleString("fr-FR")} €
                    </span>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowInvForm(false); setInvForm(EMPTY_INV_FORM); }}
                      className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={createInvoice}
                      disabled={invSaving}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {invSaving ? "Enregistrement…" : "Créer la facture"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices table */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
              {invoices.length === 0 ? (
                <p className="px-5 py-12 text-center text-neutral-600 text-sm">
                  Aucune facture pour l'instant
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-700">
                        {["Client", "Projet", "Montant", "Statut", "Échéance", "Actions"].map((h, i) => (
                          <th
                            key={h}
                            className={`px-5 py-3 text-xs text-neutral-500 font-medium ${i === 5 ? "text-right" : "text-left"} ${i === 1 ? "hidden md:table-cell" : ""} ${i === 4 ? "hidden sm:table-cell" : ""}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <InvoiceRow
                          key={inv.id}
                          invoice={inv}
                          onStatus={changeInvStatus}
                          onDelete={deleteInvoice}
                          onPdf={downloadInvPdf}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════ PROJETS ════════════════════ */}
        {tab === "projects" && (
          <div className="space-y-6">

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="À venir"
                value={projects.filter((p) => p.status === "incoming").length}
                icon={<Clock size={18} />}
              />
              <StatCard
                label="En cours"
                value={projects.filter((p) => p.status === "in_progress").length}
                icon={<FolderOpen size={18} />}
              />
              <StatCard
                label="Terminés"
                value={projects.filter((p) => p.status === "completed").length}
                icon={<CheckCircle2 size={18} />}
              />
              <StatCard
                label="Revenus (terminés)"
                value={completedRevenue > 0 ? `${completedRevenue.toLocaleString("fr-FR")} €` : "—"}
                icon={<TrendingUp size={18} />}
                sub="Factures liées"
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-400">
                {projects.length} projet{projects.length > 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setShowProjForm((v) => !v)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={15} />
                Nouveau projet
              </button>
            </div>

            {/* Form */}
            {showProjForm && (
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-white mb-5">Créer un projet</h3>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Lier à un devis accepté (optionnel)</label>
                    <select
                      className={inputCls}
                      value={projForm.quoteId}
                      onChange={(e) => fillProjFromQuote(e.target.value)}
                    >
                      <option value="">— Aucun devis —</option>
                      {quotes.filter((q) => q.status === "accepted").map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.client} — {q.project} ({q.amount.toLocaleString("fr-FR")} €)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Lier à une facture (optionnel)</label>
                    <select
                      className={inputCls}
                      value={projForm.invoiceId}
                      onChange={(e) => setProjForm((p) => ({ ...p, invoiceId: e.target.value }))}
                    >
                      <option value="">— Aucune facture —</option>
                      {invoices.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.number} — {inv.client} ({inv.amount.toLocaleString("fr-FR")} €)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Nom du projet *</label>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="Site vitrine restaurant"
                      value={projForm.name}
                      onChange={(e) => setProjForm((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Client *</label>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="Jean Dupont"
                      value={projForm.client}
                      onChange={(e) => setProjForm((p) => ({ ...p, client: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Date de début</label>
                    <input
                      type="date"
                      className={inputCls}
                      value={projForm.startDate}
                      onChange={(e) => setProjForm((p) => ({ ...p, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 mb-1.5">Date de fin prévue</label>
                    <input
                      type="date"
                      className={inputCls}
                      value={projForm.endDate}
                      onChange={(e) => setProjForm((p) => ({ ...p, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-neutral-500 mb-1.5">Description</label>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="Courte description du projet…"
                    value={projForm.description}
                    onChange={(e) => setProjForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-xs text-neutral-500 mb-1.5">Statut du devis</label>
                  <select
                    className={inputCls}
                    value={projForm.quoteStatus}
                    onChange={(e) => setProjForm((p) => ({ ...p, quoteStatus: e.target.value }))}
                  >
                    <option value="">— Non renseigné —</option>
                    <option value="pending">En attente</option>
                    <option value="sent">Envoyé</option>
                    <option value="accepted">Accepté</option>
                    <option value="refused">Refusé</option>
                  </select>
                </div>

                <div className="flex gap-6 mb-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-500"
                      checked={projForm.paid}
                      onChange={(e) => setProjForm((p) => ({ ...p, paid: e.target.checked }))}
                    />
                    <span className="text-sm text-neutral-300">Facture payée</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-purple-500"
                      checked={projForm.maintenance}
                      onChange={(e) => setProjForm((p) => ({ ...p, maintenance: e.target.checked }))}
                    />
                    <span className="text-sm text-neutral-300">Maintenance active</span>
                  </label>
                </div>

                <div className="mb-5">
                  <label className="block text-xs text-neutral-500 mb-1.5">Notes</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder="Notes internes…"
                    value={projForm.notes}
                    onChange={(e) => setProjForm((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
                  <button
                    onClick={() => { setShowProjForm(false); setProjForm(EMPTY_PROJ_FORM); }}
                    className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={createProject}
                    disabled={projSaving}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {projSaving ? "Enregistrement…" : "Créer le projet"}
                  </button>
                </div>
              </div>
            )}

            {/* Kanban */}
            <div className="grid lg:grid-cols-3 gap-5">
              {(["incoming", "in_progress", "completed"] as const).map((status) => {
                const col = PROJ_STATUS[status];
                const colProjects = projects.filter((p) => p.status === status);
                return (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${col.cls}`}>
                        {col.label}
                      </span>
                      <span className="text-xs text-neutral-600">{colProjects.length}</span>
                    </div>
                    {colProjects.map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        project={proj}
                        onProgressChange={setProjectProgress}
                        onProgressSave={saveProjectProgress}
                        onMove={moveProject}
                        onDelete={deleteProject}
                      />
                    ))}
                    {colProjects.length === 0 && (
                      <div className="border border-dashed border-neutral-800 rounded-xl px-4 py-10 text-center">
                        <p className="text-xs text-neutral-700">Aucun projet</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
