import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

type Params = Promise<{ id: string }>;

const PURPLE    = "#7c3aed";
const PURPLE_BG = "#ede9fe";
const BLACK     = "#111111";
const DARK      = "#444444";
const MUTED     = "#999999";
const LINE      = "#e5e5e5";

const DEFAULT_PRICES: Record<string, number> = {
  "Conception UX/UI": 300, "Maquettes Figma": 150, "Charte graphique": 250,
  "Logo & identité visuelle": 200, "Landing page": 400,
  "Site vitrine (≤ 5 pages)": 800, "Blog / CMS": 600, "E-commerce": 1500,
  "Développement React / Next.js": 400, "Intégration HTML / CSS": 200,
  "API REST": 300, "Base de données": 400, "Authentification & Sécurité": 300,
  "Tableau de bord admin": 400, "Optimisation SEO": 150, "Audit SEO complet": 200,
  "Core Web Vitals": 150, "Mise en production": 200, "Config. hébergement & DNS": 100,
  "Maintenance mensuelle": 30, "Formation / prise en main": 150,
  "1er mois Maintenance offerte": 0,
};

const INVOICE_STATUS: Record<string, string> = {
  pending:   "En attente de paiement",
  paid:      "Payée",
  cancelled: "Annulée",
};

const fmtDate   = (d: Date)   => d.toLocaleDateString("fr-FR");
const fmtAmount = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) return null;
  return session;
}

export async function GET(_req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });

  const stored = (
    typeof invoice.prices === "object" && invoice.prices !== null && !Array.isArray(invoice.prices)
      ? invoice.prices
      : {}
  ) as Record<string, number>;
  const getPrice = (service: string): number =>
    (stored[service] as number | undefined) ?? DEFAULT_PRICES[service] ?? 0;

  const M  = 50;
  const W  = 495.28;
  const C1 = W * 0.65;
  const C2 = W * 0.35;
  const C2X = M + C1;
  const IW  = W / 2 - 10;
  const RX  = M + W / 2 + 10;

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: M, bufferPages: false });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ── EN-TÊTE ────────────────────────────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(18).fillColor(BLACK).text("Tom MARCHAL", M, 50);
    doc.font("Helvetica-Bold").fontSize(28).fillColor(PURPLE)
       .text("FACTURE", M, 42, { width: W, align: "right" });
    doc.font("Helvetica").fontSize(9).fillColor(MUTED)
       .text(invoice.number, M, 80, { width: W, align: "right" });

    doc.moveTo(M, 97).lineTo(M + W, 97).strokeColor(LINE).lineWidth(0.5).stroke();

    // ── BLOCS INFO ─────────────────────────────────────────────────────────
    const IY = 107;

    doc.font("Helvetica-Bold").fontSize(8).fillColor(MUTED).text("PRESTATAIRE", M, IY);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(BLACK).text("Tom MARCHAL", M, IY + 14);
    doc.font("Helvetica").fontSize(9).fillColor(DARK);
    doc.text("1375 chemin du Breil",   M, IY + 27);
    doc.text("SIRET : 94058882500015", M, IY + 39);
    doc.text("tomarchal02@gmail.com",  M, IY + 51);
    doc.text("07 84 43 05 97",         M, IY + 63);
    doc.text("tomarchal.fr",           M, IY + 75);

    doc.font("Helvetica-Bold").fontSize(8).fillColor(MUTED).text("CLIENT", RX, IY);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(BLACK)
       .text(invoice.client, RX, IY + 14, { width: IW, lineBreak: false, ellipsis: true });
    doc.font("Helvetica").fontSize(9).fillColor(DARK);
    doc.text(invoice.email, RX, IY + 27, { width: IW, lineBreak: false, ellipsis: true });
    let nextY = IY + 39;
    if (invoice.phone) {
      doc.text(invoice.phone, RX, nextY, { width: IW, lineBreak: false });
      nextY += 12;
    }
    doc.text(invoice.project, RX, nextY, { width: IW, lineBreak: false, ellipsis: true });

    // ── DATES & STATUT ─────────────────────────────────────────────────────
    const DY = 204;
    doc.moveTo(M, DY - 6).lineTo(M + W, DY - 6).strokeColor(LINE).lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(9).fillColor(DARK);
    doc.text(`Date d'émission : ${fmtDate(invoice.createdAt)}`, M, DY);
    if (invoice.dueDate) {
      doc.text(`Date d'échéance : ${fmtDate(invoice.dueDate)}`, M, DY + 13);
    }
    const statusLabel = INVOICE_STATUS[invoice.status] ?? invoice.status;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(invoice.status === "paid" ? "#059669" : invoice.status === "cancelled" ? "#dc2626" : PURPLE)
       .text(`Statut : ${statusLabel}`, M + W - 180, DY, { width: 180, align: "right" });

    // ── TABLEAU DES PRESTATIONS ────────────────────────────────────────────
    let TY = 232;
    const TABLE_Y = TY;
    const ROW_H   = 22;
    const HDR_H   = 22;

    doc.rect(M, TY, W, HDR_H).fill(PURPLE_BG);
    doc.font("Helvetica-Bold").fontSize(9).fillColor(PURPLE);
    doc.text("PRESTATION",  M + 10, TY + 7);
    doc.text("MONTANT HT",  C2X, TY + 7, { width: C2 - 10, align: "right" });
    TY += HDR_H;

    invoice.services.forEach((service, i) => {
      const price = getPrice(service);
      if (i % 2 === 0) doc.rect(M, TY, W, ROW_H).fill("#f8f6ff");
      doc.font("Helvetica").fontSize(9).fillColor("#1a1a1a");
      doc.text(service, M + 10, TY + 7, { width: C1 - 20, lineBreak: false });
      doc.text(
        price === 0 ? "Offert" : fmtAmount(price),
        C2X, TY + 7, { width: C2 - 10, align: "right" },
      );
      TY += ROW_H;
    });

    doc.rect(M, TABLE_Y, W, TY - TABLE_Y).strokeColor("#d8d0f7").lineWidth(0.5).stroke();
    doc.moveTo(C2X, TABLE_Y).lineTo(C2X, TY).strokeColor("#d8d0f7").lineWidth(0.5).stroke();

    // ── TOTAUX ─────────────────────────────────────────────────────────────
    TY += 12;
    doc.font("Helvetica").fontSize(9).fillColor(DARK).text("Total HT", M, TY);
    doc.font("Helvetica").fontSize(9).fillColor(BLACK)
       .text(fmtAmount(invoice.amount), C2X, TY, { width: C2 - 10, align: "right" });

    TY += 15;
    doc.font("Helvetica").fontSize(7.5).fillColor(MUTED)
       .text("TVA non applicable – Art. 293 B du CGI", M, TY);

    TY += 14;
    doc.rect(M, TY, W, 28).fill(PURPLE_BG);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(PURPLE);
    doc.text("Total TTC", M + 10, TY + 8);
    doc.text(fmtAmount(invoice.amount), C2X, TY + 8, { width: C2 - 10, align: "right" });

    // ── CONDITIONS DE RÈGLEMENT ────────────────────────────────────────────
    TY += 44;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(BLACK)
       .text("CONDITIONS DE RÈGLEMENT", M, TY);
    doc.font("Helvetica").fontSize(9).fillColor(DARK);
    doc.text("• Paiement par virement bancaire à réception de la facture", M, TY + 13);
    doc.text("• IBAN : FR76 XXXX XXXX XXXX XXXX XXXX XXX", M, TY + 26);
    if (invoice.dueDate) {
      doc.font("Helvetica-Bold").fontSize(9).fillColor(BLACK)
         .text(`Date limite de paiement : ${fmtDate(invoice.dueDate)}`, M, TY + 43);
    } else {
      doc.text("• Paiement à réception", M, TY + 39);
    }

    // ── MENTIONS LÉGALES ──────────────────────────────────────────────────
    TY += invoice.dueDate ? 65 : 60;
    doc.moveTo(M, TY).lineTo(M + W, TY).strokeColor(LINE).lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(8).fillColor(MUTED);
    doc.text(
      "En cas de retard de paiement, des pénalités de retard au taux légal en vigueur seront appliquées, " +
      "ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 €.",
      M, TY + 8, { width: W },
    );

    // ── FOOTER ────────────────────────────────────────────────────────────
    const FY = 762;
    doc.moveTo(M, FY - 8).lineTo(M + W, FY - 8).strokeColor(LINE).lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(7).fillColor(MUTED);
    doc.text("Tom MARCHAL – Auto-entrepreneur – SIRET 94058882500015", M, FY, {
      width: W, align: "center", lineBreak: false,
    });
    doc.text("TVA non applicable, Art. 293 B du CGI – Non soumis à la TVA", M, FY + 9, {
      width: W, align: "center", lineBreak: false,
    });

    doc.end();
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`,
    },
  });
}
