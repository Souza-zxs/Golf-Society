import { Resend } from 'npm:resend@6';

function requiredEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

const resend = new Resend(requiredEnv('RESEND_API_KEY'));
const emailFrom = Deno.env.get('EMAIL_FROM') || 'Sellers Society Golf <onboarding@resend.dev>';
const emailReplyTo = Deno.env.get('EMAIL_REPLY_TO') || undefined;

type ApprovalEmailType = 'membership' | 'sponsorship';

interface SendApprovalEmailParams {
  to: string;
  name: string;
  type: ApprovalEmailType;
  company?: string;
}

interface ApprovalCopy {
  subject: string;
  kicker: string;
  heading: (firstName: string) => string;
  intro: (firstName: string, company?: string) => string;
  steps: string[];
}

const COPY: Record<ApprovalEmailType, ApprovalCopy> = {
  membership: {
    subject: 'Bem-vindo à Sellers Society Golf',
    kicker: 'Candidatura aprovada',
    heading: (firstName) => `Bem-vindo, ${firstName}.`,
    intro: () =>
      'Sua candidatura para membro foi aprovada. A partir de agora você faz parte da comunidade de empresários e executivos que constrói relações de negócio através do golfe.',
    steps: [
      'Nosso time entra em contato por telefone em até 2 dias úteis para as boas-vindas.',
      'Você recebe o calendário dos próximos encontros e como confirmar presença.',
      'Apresentação pessoal no seu primeiro evento com o grupo.',
    ],
  },
  sponsorship: {
    subject: 'Patrocínio confirmado — Sellers Society Golf',
    kicker: 'Patrocínio confirmado',
    heading: () => 'Parceria confirmada.',
    intro: (_firstName, company) =>
      `${company ? `A ${company} está` : 'Sua empresa está'} oficialmente confirmada como parceira da Sellers Society Golf. Em breve alinhamos os detalhes de ativação da marca junto à nossa comunidade de executivos.`,
    steps: [
      'Nosso time entra em contato para alinhar formato e visibilidade da marca.',
      'Você recebe o media kit e o calendário dos próximos eventos.',
      'Ativação da marca já no próximo encontro do grupo.',
    ],
  },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

function buildStepsRows(steps: string[]): string {
  return steps
    .map(
      (step, index) => `
        <tr>
          <td style="padding:0 0 16px;width:32px;vertical-align:top;font-family:'Courier New',monospace;font-size:13px;color:#b08d3e;">
            0${index + 1}
          </td>
          <td style="padding:0 0 16px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#141a17;">
            ${escapeHtml(step)}
          </td>
        </tr>
      `
    )
    .join('');
}

function buildHtml(params: { kicker: string; heading: string; intro: string; steps: string[] }): string {
  const { kicker, heading, intro, steps } = params;

  return `
    <div style="background:#f6f3ea;padding:40px 20px;font-family:Georgia,'Times New Roman',serif;">
      <table role="presentation" width="100%" style="max-width:540px;margin:0 auto;background:#ffffff;border-collapse:collapse;">
        <tr>
          <td style="background:#0b1f1a;padding:26px 40px;">
            <span style="font-family:Georgia,serif;color:#f6f3ea;font-size:14px;letter-spacing:1.5px;">
              Sellers Society Golf
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:44px 40px 4px;">
            <span style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b08d3e;">
              ${escapeHtml(kicker)}
            </span>
            <h1 style="margin:10px 0 0;font-family:Georgia,serif;font-size:26px;line-height:1.3;color:#0e1210;">
              ${escapeHtml(heading)}
            </h1>
            <div style="width:48px;height:2px;background:#b08d3e;margin:20px 0 24px;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#141a17;">
            <p style="margin:0 0 28px;">${escapeHtml(intro)}</p>
            <p style="margin:0 0 14px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8579;">
              O que vem a seguir
            </p>
            <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 28px;">
              ${buildStepsRows(steps)}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 36px;border-top:1px solid rgba(14,18,16,0.1);">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#8a8579;">
              Alguma dúvida antes disso? É só responder este e-mail.<br />
              Sellers Society Golf — networking empresarial via golfe.
            </p>
          </td>
        </tr>
      </table>
      <p style="max-width:540px;margin:16px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#b9bdb6;text-align:center;">
        Você recebeu este e-mail porque enviou uma candidatura em sellerssocietygolf.com.
      </p>
    </div>
  `;
}

export async function sendApprovalEmail({ to, name, type, company }: SendApprovalEmailParams): Promise<void> {
  const copy = COPY[type];
  const firstName = firstNameOf(name);

  const html = buildHtml({
    kicker: copy.kicker,
    heading: copy.heading(firstName),
    intro: copy.intro(firstName, company),
    steps: copy.steps,
  });

  const { error } = await resend.emails.send({
    from: emailFrom,
    to,
    replyTo: emailReplyTo,
    subject: copy.subject,
    html,
  });

  if (error) {
    console.error(`Erro ao enviar e-mail de aprovação (${type}) para ${to}:`, error);
  }
}
