import { createClient } from 'npm:@supabase/supabase-js@2';
import { env } from './env.ts';

export const supabase = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
