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

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotes);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { client, email, phone, project, services, prices, discountType, discountValue, amount, notes } = await req.json();

  if (!client || !email || !project || !Array.isArray(services) || amount === undefined) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  const quote = await prisma.quote.create({
    data: {
      client,
      email,
      phone: phone ?? null,
      project,
      services,
      prices: prices ?? {},
      discountType: discountType ?? "€",
      discountValue: parseFloat(discountValue ?? 0),
      amount: parseFloat(amount),
      notes: notes ?? null,
    },
  });

  return NextResponse.json(quote, { status: 201 });
}
