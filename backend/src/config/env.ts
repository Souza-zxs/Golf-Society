import dotenv from 'dotenv';
dotenv.config({ quiet: true });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: required('SUPABASE_URL'),
  supabaseKey: required('SUPABASE_SERVICE_KEY'),
  galleryBucket: process.env.SUPABASE_GALLERY_BUCKET || 'gallery',
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
  port: Number(process.env.PORT) || 3333,
  nodeEnv: process.env.NODE_ENV || 'development',
  resendApiKey: required('RESEND_API_KEY'),
  emailFrom: process.env.EMAIL_FROM || 'Sellers Society Golf <onboarding@resend.dev>',
  emailReplyTo: process.env.EMAIL_REPLY_TO || undefined,
};
