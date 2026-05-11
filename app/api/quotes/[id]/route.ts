import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return null;
  }
  return session;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const { status, notes, amount, client, email, phone, project, services, prices, discountType, discountValue } = body;

  const data: Record<string, unknown> = {};
  if (status !== undefined)   data.status   = status;
  if (notes !== undefined)    data.notes    = notes;
  if (amount !== undefined)   data.amount   = parseFloat(amount);
  if (client !== undefined)   data.client   = client;
  if (email !== undefined)    data.email    = email;
  if (phone !== undefined)    data.phone    = phone;
  if (project !== undefined)  data.project  = project;
  if (services !== undefined) data.services = services;
  if (prices !== undefined)        data.prices        = prices;
  if (discountType !== undefined)  data.discountType  = discountType;
  if (discountValue !== undefined) data.discountValue = parseFloat(discountValue);

  try {
    const quote = await prisma.quote.update({ where: { id }, data });
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.quote.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }
}
