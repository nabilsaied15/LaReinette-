import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kmxtbcgsjjeuswwqjvst.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PHjCHgzdVfBQySglzyS8ow_5LBbAeK_';

// Utilisation des valeurs hardcodées si les variables d'environnement sont absentes (cas de Vercel sans secrets configurés)
const safeUrl = supabaseUrl;
const safeKey = supabaseAnonKey;

export const supabase = createClient(safeUrl, safeKey);
