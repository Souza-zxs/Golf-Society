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
  preheader: string;
  kicker: string;
  heading: (firstName: string, company?: string) => string;
  paragraphs: (firstName: string, company?: string) => string[];
  closing: (firstName: string, company?: string) => string;
  steps: string[];
}

const TAGLINE = 'Grandes negócios começam com grandes conexões.';

const COPY: Record<ApprovalEmailType, ApprovalCopy> = {
  membership: {
    subject: '🎉 Você foi aprovado — Sellers Society Golf',
    preheader: 'Sua candidatura foi aprovada. Bem-vindo à primeira sociedade de golf para sellers e executivos.',
    kicker: 'Candidatura aprovada',
    heading: (firstName) => `Parabéns, ${firstName}. Você foi aprovado.`,
    paragraphs: () => [
      'Após passar pela curadoria oficial da Sellers Society Golf, nosso time avaliou com atenção o seu perfil, sua trajetória e sua atuação empresarial.',
      'Temos o prazer de confirmar: você foi selecionado para participar da primeira sociedade de golf exclusiva para sellers, empresários e executivos do mercado digital.',
      'A Sellers Society Golf nasce com o propósito de conectar grandes empreendedores, gestores de marcas, líderes e executivos do e-commerce em uma experiência única de relacionamento, networking estratégico e troca de experiências.',
      'Sua aprovação é o reconhecimento de que você faz parte de um ecossistema seleto de empresários e executivos que constroem negócios, lideram equipes e transformam o mercado digital.',
      'Prepare-se para conexões de alto nível, oportunidades estratégicas e relacionamentos que podem gerar novos negócios.',
    ],
    closing: () => 'Seja muito bem-vindo à Sellers Society Golf. ⛳',
    steps: [
      'Nosso time entra em contato por telefone em até 2 dias úteis para as boas-vindas.',
      'Você recebe o calendário dos próximos encontros e como confirmar presença.',
      'Apresentação pessoal no seu primeiro evento com o grupo.',
    ],
  },
  sponsorship: {
    subject: '🎉 Parceria aprovada — Sellers Society Golf',
    preheader: 'Sua empresa foi aprovada como parceira. Bem-vindo à primeira sociedade de golf para sellers e executivos.',
    kicker: 'Patrocínio aprovado',
    heading: (_firstName, company) => `Parabéns${company ? `, ${company}` : ''}. Parceria aprovada.`,
    paragraphs: (_firstName, company) => [
      `Após passar pela curadoria oficial da Sellers Society Golf, nosso time avaliou com atenção ${company ? `o perfil da ${company}` : 'o perfil da sua empresa'}, sua atuação e seu posicionamento de marca.`,
      `Temos o prazer de confirmar: ${company ? `a ${company} foi selecionada` : 'sua empresa foi selecionada'} como parceira oficial da primeira sociedade de golf exclusiva para sellers, empresários e executivos do mercado digital.`,
      'A Sellers Society Golf nasce com o propósito de conectar grandes marcas a empreendedores, gestores, líderes e executivos do e-commerce em uma experiência única de relacionamento, networking estratégico e visibilidade.',
      `Sua aprovação é o reconhecimento de que ${company ? `a ${company} passa` : 'sua empresa passa'} a fazer parte de um ecossistema seleto, ao lado de empresários e executivos que constroem negócios e transformam o mercado digital.`,
      'Prepare-se para ativações de marca de alto nível, conexões estratégicas e oportunidades de negócio junto à nossa comunidade.',
    ],
    closing: (_firstName, company) => `Seja muito bem-vindo à Sellers Society Golf${company ? `, em nome da ${company}` : ''}. ⛳`,
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

function buildParagraphs(paragraphs: string[]): string {
  return paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#141a17;">${escapeHtml(
          paragraph
        )}</p>`
    )
    .join('');
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

function buildFlagDivider(): string {
  return `
    <table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 28px;">
      <tr>
        <td style="padding:0;">
          <table role="presentation" width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="padding:0;border-top:1px solid rgba(176,141,62,0.25);" width="45%"></td>
              <td style="padding:0 10px;width:20px;text-align:center;color:#b08d3e;font-family:Arial,sans-serif;font-size:14px;line-height:1;">⛳</td>
              <td style="padding:0;border-top:1px solid rgba(176,141,62,0.25);" width="45%"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function buildHtml(params: {
  preheader: string;
  kicker: string;
  heading: string;
  paragraphs: string[];
  closing: string;
  steps: string[];
}): string {
  const { preheader, kicker, heading, paragraphs, closing, steps } = params;

  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:#f6f3ea;">
      ${escapeHtml(preheader)}
    </div>
    <div style="background:#f6f3ea;padding:40px 20px;font-family:Georgia,'Times New Roman',serif;">
      <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-collapse:collapse;">
        <tr>
          <td style="background:#0b1f1a;padding:26px 40px;">
            <table role="presentation" width="100%" style="border-collapse:collapse;">
              <tr>
                <td style="font-family:Georgia,serif;color:#f6f3ea;font-size:14px;letter-spacing:1.5px;">
                  Sellers Society Golf
                </td>
                <td style="text-align:right;font-size:16px;color:#b08d3e;">⛳</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:44px 40px 4px;">
            <span style="display:inline-block;padding:5px 12px;border:1px solid rgba(176,141,62,0.4);border-radius:999px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b08d3e;">
              🎉 ${escapeHtml(kicker)}
            </span>
            <h1 style="margin:18px 0 0;font-family:Georgia,serif;font-size:27px;line-height:1.32;color:#0e1210;">
              ${escapeHtml(heading)}
            </h1>
            <div style="width:48px;height:2px;background:#b08d3e;margin:20px 0 24px;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            ${buildParagraphs(paragraphs)}
            <p style="margin:24px 0 28px;padding:16px 20px;background:#f6f3ea;border-left:2px solid #b08d3e;font-family:Georgia,serif;font-style:italic;font-size:15px;line-height:1.6;color:#0e1210;">
              ${escapeHtml(closing)}
            </p>
            ${buildFlagDivider()}
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
            <p style="margin:0 0 6px;font-family:Georgia,serif;font-style:italic;font-size:13px;line-height:1.6;color:#0e1210;">
              ${escapeHtml(TAGLINE)}
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#8a8579;">
              Alguma dúvida antes disso? É só responder este e-mail.<br />
              Sellers Society Golf — networking empresarial via golfe.
            </p>
          </td>
        </tr>
      </table>
      <p style="max-width:560px;margin:16px auto 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#b9bdb6;text-align:center;">
        Você recebeu este e-mail porque enviou uma candidatura em sellerssocietygolf.com.
      </p>
    </div>
  `;
}

export async function sendApprovalEmail({ to, name, type, company }: SendApprovalEmailParams): Promise<void> {
  const copy = COPY[type];
  const firstName = firstNameOf(name);

  const html = buildHtml({
    preheader: copy.preheader,
    kicker: copy.kicker,
    heading: copy.heading(firstName, company),
    paragraphs: copy.paragraphs(firstName, company),
    closing: copy.closing(firstName, company),
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
