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

  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { name, client, description, quoteId, invoiceId, quoteStatus, paid, maintenance, startDate, endDate, notes } =
    await req.json();

  if (!name || !client) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      client,
      description: description ?? null,
      quoteId: quoteId ?? null,
      invoiceId: invoiceId ?? null,
      quoteStatus: quoteStatus ?? null,
      paid: paid ?? false,
      maintenance: maintenance ?? false,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      notes: notes ?? null,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
