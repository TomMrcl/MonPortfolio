import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }
  return session;
}

function detectDevice(userAgent: string): "mobile" | "desktop" {
  return /mobile|android|iphone|ipad|tablet/i.test(userAgent) ? "mobile" : "desktop";
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { path } = await req.json();
  if (!path) return NextResponse.json({ error: "path requis" }, { status: 400 });

  const device = detectDevice(req.headers.get("user-agent") ?? "");

  const view = await prisma.pageView.create({ data: { path, device } });
  return NextResponse.json(view, { status: 201 });
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const now = new Date();

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [total, byPath, byDevice, last30Days, recentViews] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
    }),
    prisma.pageView.groupBy({
      by: ["device"],
      _count: { _all: true },
    }),
    prisma.pageView.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Aggregation JS — Prisma n'a pas de "group by day" natif
  const dailyChart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    return {
      date: dateStr,
      count: recentViews.filter(
        (v) => v.createdAt.toISOString().split("T")[0] === dateStr
      ).length,
    };
  });

  return NextResponse.json({
    total,
    byPath: byPath.map((p) => ({ path: p.path, count: p._count._all })),
    byDevice: byDevice.map((d) => ({ device: d.device ?? "unknown", count: d._count._all })),
    last30Days,
    dailyChart,
  });
}
