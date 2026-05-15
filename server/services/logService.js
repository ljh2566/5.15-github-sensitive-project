const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseKey);
    } catch (err) {
        console.error('Supabase initialization error:', err);
    }
} else {
    console.warn('Supabase credentials missing. Logging to DB will be skipped.');
}

async function insertLog(inputText, sentiment, primaryEmotion, intensity, confidence, reason, recommendation) {
    if (!supabase) {
        console.warn('Supabase not initialized. Skipping log insertion.');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('analysis_logs')
            .insert([
                { 
                    input_text: inputText, 
                    sentiment, 
                    primary_emotion: primaryEmotion, 
                    intensity, 
                    confidence, 
                    reason, 
                    recommendation 
                }
            ]);
        
        if (error) throw error;
        console.log('Log saved to Supabase successfully.');
    } catch (error) {
        console.error('Failed to save log to Supabase:', error.message);
    }
}

async function getRecentLogs(limit = 5) {
    if (!supabase) {
        console.log("Supabase is not configured. Returning empty history.");
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('analysis_logs')
            .select('input_text, sentiment, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Supabase Select Error:", error);
            return [];
        }
        return data || [];
    } catch (err) {
        console.error("Supabase Exception:", err);
        return [];
    }
}

module.exports = {
    insertLog,
    getRecentLogs
};
