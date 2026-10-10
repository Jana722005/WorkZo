import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cpibexkcpfrhwvzdpxsp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_yKrZFz7creJHy-OcNxYYbw_z32OMu-T';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
