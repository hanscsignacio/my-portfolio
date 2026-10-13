
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Check that the required environment variables exist
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

// Reusable Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
