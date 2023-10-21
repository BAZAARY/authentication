import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

// Credenciales supabase
export const supabaseUrl = "https://woloirkcggmgeyfzbylf.supabase.co";
export const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
