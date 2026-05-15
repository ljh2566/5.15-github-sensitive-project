const express = require('express');
const router = express.Router();
const { analyzeSentiment } = require('../services/openaiService');
const { insertLog, getRecentLogs } = require('../services/logService');
const { chat } = require('../services/chatService');
const { getDailyFortune } = require('../services/fortuneService');

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

router.get('/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const logs = await getRecentLogs(limit);
        return res.status(200).json({
            success: true,
            data: logs
        });
    } catch (error) {
        console.error("API /history Error:", error);
        return res.status(500).json({
            success: false,
            message: "히스토리를 불러오는 중 오류가 발생했습니다."
        });
    }
});

router.post('/chat', async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
            success: false,
            message: "메시지를 입력해주세요."
        });
    }

    try {
        const reply = await chat(messages);
        return res.status(200).json({
            success: true,
            reply: reply
        });
    } catch (error) {
        console.error("API /chat Error:", error);
        return res.status(500).json({
            success: false,
            message: "챗봇 응답에 실패했습니다. 잠시 후 다시 시도해주세요."
        });
    }
});

router.post('/fortune', async (req, res) => {
    const { sentiment } = req.body; // optional: reflect user's current emotion
    try {
        const fortune = await getDailyFortune(sentiment || null);
        return res.status(200).json({ success: true, fortune });
    } catch (error) {
        console.error('API /fortune Error:', error);
        return res.status(500).json({ success: false, message: '운세 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    }
});

module.exports = router;
