import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kdmvjbttgbflhpcprlon.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkbXZqYnR0Z2JmbGhwY3BybG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTQ1OTYsImV4cCI6MjA4NzU3MDU5Nn0.NcG-WxYNXivc6Cvlv1jzgAZ9w7NRFtUJPTO3LjTkOMQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);