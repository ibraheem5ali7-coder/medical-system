import { createClient } from '@supabase/supabase-js'

// جلب المفاتيح من ملف .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// إنشاء العميل للاتصال بقاعدة البيانات
export const supabase = createClient(supabaseUrl, supabaseAnonKey)