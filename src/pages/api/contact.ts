import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// On-demand (server) route — runs on Vercel, never in the browser.
export const prerender = false;

// Where contact submissions are delivered.
const TO_EMAIL = 'info@mrmoises.es';
// Must be an address on a domain verified in Resend (see .env.example).
const FROM_EMAIL = 'Formulario web <formulario@mrmoises.es>';

const MOTIVOS: Record<string, string> = {
  First: 'Proponer un proyecto',
  Second: 'Realizar una entrevista',
  Third: 'Concertar una mentoría',
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return json({ error: 'Servicio de email no configurado.' }, 500);
  }

  let data: Record<string, string>;
  try {
    const form = await request.formData();
    data = Object.fromEntries(
      Array.from(form.entries(), ([k, v]) => [k, String(v).trim()])
    );
  } catch {
    return json({ error: 'Solicitud no válida.' }, 400);
  }

  // Honeypot: bots fill hidden fields, humans don't. Pretend success.
  if (data.company) {
    return json({ ok: true }, 200);
  }

  const { name, apellidos, email, telefono, field } = data;

  // Server-side validation (never trust the client).
  const errors: string[] = [];
  if (!name) errors.push('nombre');
  if (!apellidos) errors.push('apellidos');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  if (!telefono) errors.push('teléfono');
  if (errors.length) {
    return json(
      { error: `Revisa estos campos: ${errors.join(', ')}.` },
      400
    );
  }

  const fullName = `${name} ${apellidos}`.trim();
  const motivo = MOTIVOS[field] ?? 'No especificado';

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: `Nuevo contacto web: ${fullName} — ${motivo}`,
      html: `
        <h2>Nuevo mensaje del formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(telefono)}</p>
        <p><strong>Motivo:</strong> ${escapeHtml(motivo)}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return json({ error: 'No se pudo enviar el email.' }, 502);
    }

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    return json({ error: 'No se pudo enviar el email.' }, 500);
  }
};
