document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const charCurrent = document.getElementById('char-current');
    const analyzeBtn = document.getElementById('analyze-btn');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');
    
    const sentimentVal = document.getElementById('sentiment-val');
    const primaryEmotionVal = document.getElementById('primary-emotion-val');
    const intensityVal = document.getElementById('intensity-val');
    const intensityBar = document.getElementById('intensity-bar');

    const confidenceVal = document.getElementById('confidence-val');
    const reasonVal = document.getElementById('reason-val');
    const recommendationContainer = document.getElementById('recommendation-container');
    const recommendationVal = document.getElementById('recommendation-val');

    const liveTime = document.getElementById('live-time');
    const dynamicGreeting = document.getElementById('dynamic-greeting');

    // Live Clock & Dynamic Greeting
    function updateTimeAndGreeting() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? '오후' : '오전';
        
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        liveTime.textContent = `${ampm} ${hours}:${minutes}`;

        const currentHour = now.getHours();
        let greeting = "안녕하세요! 기분이 어떠신가요?";
        if (currentHour >= 5 && currentHour < 11) greeting = "상쾌한 아침입니다! 오늘 기분은 어떠신가요?";
        else if (currentHour >= 11 && currentHour < 17) greeting = "활기찬 오후입니다! 지금 감정은 어떠신가요?";
        else if (currentHour >= 17 && currentHour < 22) greeting = "편안한 저녁입니다. 오늘 하루 어떠셨나요?";
        else greeting = "고요한 밤입니다. 어떤 생각에 잠겨 계신가요?";

        dynamicGreeting.textContent = greeting;
    }
    
    updateTimeAndGreeting();
    setInterval(updateTimeAndGreeting, 60000); // 1분마다 업데이트

    // Text area character count
    textInput.addEventListener('input', () => {
        charCurrent.textContent = textInput.value.length;
    });

    // Analyze button click handler
    analyzeBtn.addEventListener('click', async () => {
        const text = textInput.value.trim();

        // Validate input
        if (!text) {
            showError("텍스트를 입력해주세요.");
            return;
        }

        if (text.length > 1000) {
            showError("텍스트는 최대 1000자까지 입력 가능합니다.");
            return;
        }

        // Reset state
        hideError();
        hideResult();
        setLoading(true);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (!data.success) {
                showError(data.message || "분석 중 오류가 발생했습니다.");
                return;
            }

            showResult(data.result);

        } catch (error) {
            console.error("API Error:", error);
            showError("서버와의 통신에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    });

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
    }

    function showResult(result) {
        sentimentVal.textContent = result.sentiment;
        primaryEmotionVal.textContent = result.primary_emotion || '-';
        
        const intensity = result.intensity || 0;
        intensityVal.textContent = `${intensity} / 10`;
        // 애니메이션 효과를 위해 setTimeout 사용
        setTimeout(() => {
            intensityBar.style.width = `${(intensity / 10) * 100}%`;
        }, 100);

        confidenceVal.textContent = result.confidence + '%';
        reasonVal.textContent = result.reason;
        
        if (result.recommendation) {
            recommendationVal.textContent = result.recommendation;
            recommendationContainer.classList.remove('hidden');
        } else {
            recommendationContainer.classList.add('hidden');
        }

        resultSection.classList.remove('hidden');
    }

    function hideResult() {
        resultSection.classList.add('hidden');
        intensityBar.style.width = '0%';
    }

    function setLoading(isLoading) {
        if (isLoading) {
            analyzeBtn.textContent = '분석 중...';
            analyzeBtn.disabled = true;
        } else {
            analyzeBtn.textContent = '분석하기';
            analyzeBtn.disabled = false;
        }
    }
});
