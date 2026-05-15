const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getDailyFortune(sentiment) {
    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    const sentimentContext = sentiment
        ? `사용자의 현재 감정 상태는 '${sentiment}'이다. 이를 운세에 반영해줘.`
        : '';

    const prompt = `오늘은 ${today}이다. ${sentimentContext}
오늘의 운세를 재미있고 따뜻하게 생성해줘. 반드시 아래 JSON 형식으로만 반환해.

{
  "overall": { "stars": 1~5 사이 정수, "message": "전체운 한 줄 메시지" },
  "love": { "stars": 1~5 사이 정수, "message": "연애운 한 줄 메시지" },
  "money": { "stars": 1~5 사이 정수, "message": "금전운 한 줄 메시지" },
  "health": { "stars": 1~5 사이 정수, "message": "건강운 한 줄 메시지" },
  "lucky_color": "오늘의 행운 색상 (예: 하늘색)",
  "lucky_number": 1~99 사이 정수,
  "today_message": "오늘 하루를 위한 따뜻하고 힘이 되는 한마디 (2문장)"
}`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: '당신은 재미있고 따뜻한 운세 전문가입니다. 반드시 유효한 JSON만 반환하세요.'
                },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.9
        });

        const result = JSON.parse(response.choices[0].message.content);
        return result;
    } catch (error) {
        console.error('FortuneService Error:', error);
        throw new Error('운세 생성에 실패했습니다.');
    }
}

module.exports = { getDailyFortune };
