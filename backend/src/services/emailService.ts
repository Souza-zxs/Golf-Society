import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.resendApiKey);

type ApprovalEmailType = 'membership' | 'sponsorship';

interface SendApprovalEmailParams {
  to: string;
  name: string;
  type: ApprovalEmailType;
}

const COPY: Record<ApprovalEmailType, { subject: string; heading: string; body: string }> = {
  membership: {
    subject: 'Sua candidatura foi aprovada — Sellers Society Golf',
    heading: 'Bem-vindo à Sellers Society Golf',
    body: 'Sua candidatura para membro foi aprovada. Em breve nossa equipe entrará em contato com os próximos passos.',
  },
  sponsorship: {
    subject: 'Patrocínio aprovado — Sellers Society Golf',
    heading: 'Patrocínio aprovado',
    body: 'Sua candidatura de patrocínio foi aprovada. Em breve nossa equipe entrará em contato para alinhar os detalhes.',
  },
};

function buildHtml(name: string, heading: string, body: string): string {
  return `
    <div style="background:#f6f3ea;padding:40px 20px;font-family:Georgia,'Times New Roman',serif;">
      <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#ffffff;border-collapse:collapse;">
        <tr>
          <td style="background:#0b1f1a;padding:28px 36px;">
            <span style="font-family:Georgia,serif;color:#d9c08a;font-size:13px;letter-spacing:2px;text-transform:uppercase;">
              Sellers Society Golf
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 36px 8px;">
            <h1 style="margin:0 0 4px;font-family:Georgia,serif;font-size:24px;color:#0e1210;">
              ${heading}
            </h1>
            <div style="width:48px;height:2px;background:#b08d3e;margin:16px 0 24px;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#141a17;">
            <p style="margin:0 0 16px;">Olá, ${name},</p>
            <p style="margin:0 0 16px;">${body}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px 40px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#8a8579;">
            Sellers Society Golf
          </td>
        </tr>
      </table>
    </div>
  `;
}

export async function sendApprovalEmail({ to, name, type }: SendApprovalEmailParams): Promise<void> {
  const copy = COPY[type];

  const { error } = await resend.emails.send({
    from: env.emailFrom,
    to,
    replyTo: env.emailReplyTo,
    subject: copy.subject,
    html: buildHtml(name, copy.heading, copy.body),
  });

  if (error) {
    console.error(`Erro ao enviar e-mail de aprovação (${type}) para ${to}:`, error);
  }
}
