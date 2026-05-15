const { OpenAI } = require('openai');

if (!process.env.OPENAI_API_KEY) {
    console.error('CRITICAL: OPENAI_API_KEY is missing!');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key'
});

async function analyzeSentiment(text) {
    const prompt = `사용자 입력의 감정을 분석하고 반드시 JSON으로 반환해.
sentiment는 positive, negative, neutral 중 하나만 사용해.
primary_emotion은 텍스트에서 느껴지는 가장 핵심적인 감정 키워드 1개(예: 억울함, 기쁨, 평온, 분노 등)를 작성해.
intensity는 그 감정의 강도를 1부터 10 사이의 숫자로 반환해.
confidence는 분석에 대한 확신을 0~100 사이 숫자로 반환해.
reason은 감성을 그렇게 판단한 이유를 형태소 및 문맥 기반으로 매우 상세하고 구체적으로 3~4문장으로 작성해.
recommendation은 이 텍스트가 대화형 메시지라면 '가장 적절하고 현명한 답장 예시와 가이드'를, 개인적인 독백/일기라면 '감정 상태에 맞는 실질적인 행동 조언(예: 휴식, 명상 등)'을 2~3문장으로 제안해.

입력 텍스트: "${text}"`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a highly analytical AI assistant that strictly outputs valid JSON only. The JSON structure should be: { \"sentiment\": \"string\", \"primary_emotion\": \"string\", \"intensity\": number, \"confidence\": number, \"reason\": \"string\", \"recommendation\": \"string\" }"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const resultText = response.choices[0].message.content;
        const result = JSON.parse(resultText);
        
        return result;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("감성 분석에 실패했습니다.");
    }
}

module.exports = {
    analyzeSentiment
};
