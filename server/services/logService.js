const supabase = require('../config/supabase');

async function insertLog(inputText, sentiment, primaryEmotion, intensity, confidence, reason, recommendation) {
    if (!supabase) {
        console.log("Supabase is not configured. Skipping DB insert.");
        return;
    }

    try {
        const { data, error } = await supabase
            .from('analysis_logs')
            .insert([
                { 
                    input_text: inputText, 
                    sentiment: sentiment,
                    primary_emotion: primaryEmotion,
                    intensity: intensity,
                    confidence: confidence, 
                    reason: reason,
                    recommendation: recommendation
                }
            ]);

        if (error) {
            console.error("Supabase Insert Error:", error);
        } else {
            console.log("Log saved to Supabase successfully.");
        }
    } catch (err) {
        console.error("Supabase Exception:", err);
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
