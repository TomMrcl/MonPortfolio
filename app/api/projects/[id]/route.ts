import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, client, description, status, progress, quoteId, invoiceId, quoteStatus, paid, maintenance, startDate, endDate, notes } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined)        data.name        = name;
  if (client !== undefined)      data.client      = client;
  if (description !== undefined) data.description = description;
  if (status !== undefined)      data.status      = status;
  if (progress !== undefined)    data.progress    = parseInt(progress);
  if (quoteId !== undefined)     data.quoteId     = quoteId;
  if (invoiceId !== undefined)   data.invoiceId   = invoiceId;
  if (quoteStatus !== undefined) data.quoteStatus = quoteStatus;
  if (paid !== undefined)        data.paid        = paid;
  if (maintenance !== undefined) data.maintenance = maintenance;
  if (startDate !== undefined)   data.startDate   = startDate ? new Date(startDate) : null;
  if (endDate !== undefined)     data.endDate     = endDate ? new Date(endDate) : null;
  if (notes !== undefined)       data.notes       = notes;

  try {
    const project = await prisma.project.update({ where: { id }, data });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.project.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
  }
}
