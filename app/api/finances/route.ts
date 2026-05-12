import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) return null;
  return session;
}

const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const now          = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOf12M   = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [allInvoices, quotesThisMonth, recentPaid] = await Promise.all([
    prisma.invoice.findMany({
      select: { amount: true, status: true, createdAt: true, services: true },
    }),
    prisma.quote.findMany({
      where: { createdAt: { gte: startOfMonth } },
      select: { status: true },
    }),
    prisma.invoice.findMany({
      where: { status: "paid" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, number: true, client: true, amount: true, createdAt: true },
    }),
  ]);

  const paid    = allInvoices.filter((i) => i.status === "paid");
  const pending = allInvoices.filter((i) => i.status === "pending");

  const totalPaid        = paid.reduce((s, i) => s + i.amount, 0);
  const totalPending     = pending.reduce((s, i) => s + i.amount, 0);
  const thisMonthRevenue = paid
    .filter((i) => i.createdAt >= startOfMonth)
    .reduce((s, i) => s + i.amount, 0);
  const avgAmount =
    allInvoices.length > 0
      ? allInvoices.reduce((s, i) => s + i.amount, 0) / allInvoices.length
      : 0;

  // Revenus mensuels (12 derniers mois)
  const monthMap: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthMap[`${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`] = 0;
  }
  paid
    .filter((i) => i.createdAt >= startOf12M)
    .forEach((i) => {
      const d   = new Date(i.createdAt);
      const key = `${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
      if (key in monthMap) monthMap[key] += i.amount;
    });
  const revenueChart = Object.entries(monthMap).map(([month, amount]) => ({ month, amount }));

  // Devis ce mois
  const sentCount     = quotesThisMonth.filter((q) => ["sent","accepted","refused"].includes(q.status)).length;
  const acceptedCount = quotesThisMonth.filter((q) => q.status === "accepted").length;
  const refusedCount  = quotesThisMonth.filter((q) => q.status === "refused").length;
  const conversionRate = sentCount > 0 ? Math.round((acceptedCount / sentCount) * 100) : 0;

  // Top services (toutes factures)
  const svcCount: Record<string, number> = {};
  allInvoices.forEach((inv) =>
    inv.services.forEach((s) => { svcCount[s] = (svcCount[s] ?? 0) + 1; }),
  );
  const topServices = Object.entries(svcCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({
    totalPaid,
    totalPending,
    thisMonthRevenue,
    conversionRate,
    sentCount,
    acceptedCount,
    refusedCount,
    avgAmount,
    revenueChart,
    topServices,
    recentPaid,
  });
}
