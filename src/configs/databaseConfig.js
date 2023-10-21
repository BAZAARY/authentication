import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

// Credenciales supabase
export const supabaseUrl = "https://woloirkcggmgeyfzbylf.supabase.co";
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbG9pcmtjZ2dtZ2V5ZnpieWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY3NDI3MTYsImV4cCI6MjAxMjMxODcxNn0.-0zicIyNb-e2j5QAje1wrpDf2wGpedLGrJsVp7iMD4Q";

export const supabase = createClient(supabaseUrl, supabaseKey);
