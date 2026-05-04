import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
      to: process.env.RESEND_TO ?? "tomarchal02@gmail.com",
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
          <div style="background:#8927ff;padding:24px 32px;border-radius:8px 8px 0 0">
            <h1 style="color:#fff;margin:0;font-size:20px">Nouveau message de contact</h1>
          </div>
          <div style="background:#f9f9f9;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e5e5e5;border-top:none">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:8px 0;font-weight:600;width:80px;vertical-align:top">Nom</td>
                <td style="padding:8px 0">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:600;vertical-align:top">Email</td>
                <td style="padding:8px 0">
                  <a href="mailto:${email}" style="color:#8927ff">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:600;vertical-align:top">Message</td>
                <td style="padding:8px 0;white-space:pre-line">${message}</td>
              </tr>
            </table>
            <p style="margin-top:24px;font-size:13px;color:#888">
              Réponds directement à cet email pour contacter ${name}.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend]", error);
      return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact route]", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
