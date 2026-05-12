import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { client, email, phone, project, services, prices, amount, notes, dueDate, quoteId } =
    await req.json();

  if (!client || !email || !project || !Array.isArray(services) || amount === undefined) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const count = await prisma.invoice.count({
    where: { createdAt: { gte: new Date(y, now.getMonth(), 1) } },
  });
  const number = `FAC-${y}${m}-${String(count + 1).padStart(3, "0")}`;

  const invoice = await prisma.invoice.create({
    data: {
      number,
      client,
      email,
      phone: phone ?? null,
      project,
      services,
      prices: prices ?? {},
      amount: parseFloat(amount),
      notes: notes ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
      quoteId: quoteId ?? null,
    },
  });

  return NextResponse.json(invoice, { status: 201 });
}
