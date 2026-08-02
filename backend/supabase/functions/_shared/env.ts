// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetadas automaticamente pelo
// runtime das Edge Functions — não podem (nem precisam) ser definidas via
// `supabase secrets set` (prefixo SUPABASE_ é reservado pela plataforma).
function required(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  galleryBucket: Deno.env.get('GALLERY_BUCKET') || 'gallery',
  adminApiKey: required('ADMIN_API_KEY'),
  corsOrigins: (Deno.env.get('CORS_ORIGIN') || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim()),
};
