const express = require('express');
const router = express.Router();
const { analyzeSentiment } = require('../services/openaiService');
const { insertLog } = require('../services/logService');

router.post('/analyze', async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({
            success: false,
            message: "텍스트를 입력해주세요."
        });
    }

    try {
        // OpenAI를 이용한 감성 분석
        const result = await analyzeSentiment(text);

        // Supabase에 분석 결과 저장 (비동기, 성공 여부에 상관없이 클라이언트 응답)
        insertLog(text, result.sentiment, result.primary_emotion, result.intensity, result.confidence, result.reason, result.recommendation);

        return res.status(200).json({
            success: true,
            result: result
        });
    } catch (error) {
        console.error("API /analyze Error:", error);
        return res.status(500).json({
            success: false,
            message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        });
    }
});

module.exports = router;
