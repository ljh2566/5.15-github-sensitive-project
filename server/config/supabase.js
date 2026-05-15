const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

// 플레이스홀더만 있는 상태에서는 에러 방지 처리
let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_SUPABASE_URL_HERE')) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = supabase;
