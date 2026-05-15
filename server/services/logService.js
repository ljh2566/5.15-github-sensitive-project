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

module.exports = {
    insertLog
};
