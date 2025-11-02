import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://axrjfkyoaydcuezcaoce.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cmpma3lvYXlkY3VlemNhb2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMjcxODgsImV4cCI6MjA3NzYwMzE4OH0.c1vGo0EZgM_wO-QKg4SUA1KFCoUQtLIRuDYSiNJrzH4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
