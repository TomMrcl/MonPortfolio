"use client";

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  BarChart2, FileText, Plus, Trash2, Download, Eye,
  TrendingUp, Smartphone, ChevronRight, X, ChevronDown,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [tab, setTab]           = useState<"analytics" | "quotes">("analytics");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [quotes, setQuotes]     = useState<Quote[]>([]);
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

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setAnalytics).catch(() => {});
    fetch("/api/quotes").then((r) => r.json()).then(setQuotes).catch(() => {});
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
        <div className="flex gap-1 p-1 bg-neutral-800 border border-neutral-700 rounded-xl w-fit mb-8">
          {(["analytics", "quotes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-purple-600 text-white shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {t === "analytics" ? <BarChart2 size={15} /> : <FileText size={15} />}
              {t === "analytics" ? "Analytics" : "Devis"}
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
      </div>
    </div>
  );
}
