const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `당신은 "마음이"라는 이름의 따뜻하고 공감 능력이 뛰어난 AI 감정 상담사입니다.

역할:
- 사용자의 감정을 깊이 공감하고 이해해주세요.
- 판단하거나 조언을 강요하지 말고, 먼저 충분히 들어주세요.
- 필요할 때는 실질적이고 따뜻한 조언을 제공하세요.
- 짧고 자연스러운 대화체로 응답하세요 (2~4문장).
- 이모지를 1~2개 적절히 사용해서 따뜻한 분위기를 만들어주세요.
- 사용자가 매우 힘든 상황이라면 전문 상담사 연결을 권유하세요.

주의사항:
- 과도하게 긍정적이거나 억지 위로는 하지 마세요.
- 한국어로만 대화하세요.
- 상담사처럼 "~군요", "~네요", "~시겠어요" 같은 자연스러운 말투를 사용하세요.`;

async function chat(messages) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            max_tokens: 300,
            temperature: 0.8
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('ChatService Error:', error);
        throw new Error('챗봇 응답 생성에 실패했습니다.');
    }
}

module.exports = { chat };
