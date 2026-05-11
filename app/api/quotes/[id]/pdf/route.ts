import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";

type Params = Promise<{ id: string }>;

// ── Couleurs ─────────────────────────────────────────────────────────────────
const PURPLE    = "#7c3aed";
const PURPLE_BG = "#ede9fe";
const BLACK     = "#111111";
const DARK      = "#444444";
const MUTED     = "#999999";
const LINE      = "#e5e5e5";

// ── Prix par défaut (fallback pour anciens devis sans prix stockés) ───────────
const DEFAULT_PRICES: Record<string, number> = {
  // Design
  "Conception UX/UI":             350,
  "Maquettes Figma":              300,
  "Charte graphique":             450,
  "Logo & identité visuelle":     400,
  // Front-end
  "Landing page":                 450,
  "Site vitrine (≤ 5 pages)":     900,
  "Blog / CMS":                   650,
  "E-commerce":                   1500,
  "Développement React / Next.js":500,
  "Intégration HTML / CSS":       200,
  // Back-end
  "API REST":                     600,
  "Base de données":              300,
  "Authentification & Sécurité":  300,
  "Tableau de bord admin":        500,
  // SEO
  "Optimisation SEO":             200,
  "Audit SEO complet":            250,
  "Core Web Vitals":              150,
  // Prod & maintenance
  "Mise en production":           149,
  "Config. hébergement & DNS":    99,
  "Maintenance mensuelle":        80,
  "Formation / prise en main":    150,
  "Maintenance offerte":          0,
  // Legacy
  "Conception & Design":          250,
  "Développement & Intégration":  250,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate   = (d: Date)   => d.toLocaleDateString("fr-FR");
const fmtAmount = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) return null;
  return session;
}

// ── Route ─────────────────────────────────────────────────────────────────────
export async function GET(_req: Request, { params }: { params: Params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });

  // Prix personnalisés stockés (fallback sur DEFAULT_PRICES)
  const stored = (
    typeof quote.prices === "object" && quote.prices !== null && !Array.isArray(quote.prices)
      ? quote.prices
      : {}
  ) as Record<string, number>;
  const getPrice = (service: string): number =>
    (stored[service] as number | undefined) ?? DEFAULT_PRICES[service] ?? 0;

  // Numéro DEV-YYYYMM-XXX
  const y = quote.createdAt.getFullYear();
  const m = String(quote.createdAt.getMonth() + 1).padStart(2, "0");
  const seq = await prisma.quote.count({
    where: { createdAt: { gte: new Date(y, quote.createdAt.getMonth(), 1), lte: quote.createdAt } },
  });
  const quoteNumber = `DEV-${y}${m}-${String(seq).padStart(3, "0")}`;

  const validUntil = new Date(quote.createdAt);
  validUntil.setDate(validUntil.getDate() + 15);

  // Calcul remise
  const subtotal   = quote.services.reduce((sum, s) => sum + getPrice(s), 0);
  const discountAmt =
    quote.discountValue > 0
      ? quote.discountType === "%"
        ? (subtotal * quote.discountValue) / 100
        : quote.discountValue
      : 0;
  const hasDiscount = discountAmt > 0;

  // ── Mise en page ──────────────────────────────────────────────────────────
  const M   = 50;
  const W   = 495.28;
  const C1  = W * 0.65;
  const C2  = W * 0.35;
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
       .text("DEVIS", M, 42, { width: W, align: "right" });
    doc.font("Helvetica").fontSize(9).fillColor(MUTED)
       .text(quoteNumber, M, 80, { width: W, align: "right" });

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
       .text(quote.client, RX, IY + 14, { width: IW, lineBreak: false, ellipsis: true });
    doc.font("Helvetica").fontSize(9).fillColor(DARK);
    doc.text(quote.email, RX, IY + 27, { width: IW, lineBreak: false, ellipsis: true });
    let nextY = IY + 39;
    if (quote.phone) {
      doc.text(quote.phone, RX, nextY, { width: IW, lineBreak: false });
      nextY += 12;
    }
    doc.text(quote.project, RX, nextY, { width: IW, lineBreak: false, ellipsis: true });

    // ── DATES ──────────────────────────────────────────────────────────────
    const DY = 204;
    doc.moveTo(M, DY - 6).lineTo(M + W, DY - 6).strokeColor(LINE).lineWidth(0.5).stroke();
    doc.font("Helvetica").fontSize(9).fillColor(DARK);
    doc.text(`Date d'émission : ${fmtDate(quote.createdAt)}`,        M, DY);
    doc.text(`Date de validité : ${fmtDate(validUntil)} (15 jours)`, M, DY + 13);

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

    quote.services.forEach((service, i) => {
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

    // ── TOTAUX ────────────────────────────────────────────────────────────
    TY += 12;
    doc.font("Helvetica").fontSize(9).fillColor(DARK)
       .text(hasDiscount ? "Sous-total HT" : "Total HT", M, TY);
    doc.font("Helvetica").fontSize(9).fillColor(BLACK)
       .text(fmtAmount(subtotal), C2X, TY, { width: C2 - 10, align: "right" });

    if (hasDiscount) {
      TY += 12;
      const discLabel = quote.discountType === "%"
        ? `Remise (${quote.discountValue} %)`
        : "Remise";
      doc.font("Helvetica").fontSize(9).fillColor(PURPLE)
         .text(discLabel, M, TY);
      doc.text(`− ${fmtAmount(discountAmt)}`, C2X, TY, { width: C2 - 10, align: "right" });

      TY += 12;
      doc.font("Helvetica-Bold").fontSize(9).fillColor(BLACK)
         .text("Total HT", M, TY);
      doc.text(fmtAmount(quote.amount), C2X, TY, { width: C2 - 10, align: "right" });
    }

    TY += 15;
    doc.font("Helvetica").fontSize(7.5).fillColor(MUTED)
       .text("TVA non applicable – Art. 293 B du CGI", M, TY);

    TY += 14;
    doc.rect(M, TY, W, 28).fill(PURPLE_BG);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(PURPLE);
    doc.text("Total TTC", M + 10, TY + 8);
    doc.text(fmtAmount(quote.amount), C2X, TY + 8, { width: C2 - 10, align: "right" });

    // ── CONDITIONS DE PAIEMENT ────────────────────────────────────────────
    TY += 44;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(BLACK)
       .text("CONDITIONS DE PAIEMENT", M, TY);
    doc.font("Helvetica").fontSize(9).fillColor(DARK);
    doc.text(`• Acompte 30 % à la commande : ${fmtAmount(quote.amount * 0.3)}`, M, TY + 13);
    doc.text(`• Solde 70 % à la livraison : ${fmtAmount(quote.amount * 0.7)}`,  M, TY + 26);

    // ── SIGNATURES ────────────────────────────────────────────────────────
    TY += 58;
    const SIG_W = W / 2 - 20;
    const RX2   = M + W / 2 + 20;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(BLACK);
    doc.text("Signature prestataire", M,   TY);
    doc.text("Signature client",      RX2, TY);
    doc.rect(M,   TY + 14, SIG_W, 46).strokeColor("#cccccc").lineWidth(0.5).stroke();
    doc.rect(RX2, TY + 14, SIG_W, 46).strokeColor("#cccccc").lineWidth(0.5).stroke();

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
      "Content-Disposition": `attachment; filename="${quoteNumber}.pdf"`,
    },
  });
}
