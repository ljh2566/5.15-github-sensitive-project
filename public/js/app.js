document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const charCurrent = document.getElementById('char-current');
    const analyzeBtn = document.getElementById('analyze-btn');
    const errorMessage = document.getElementById('error-message');
    const resultSection = document.getElementById('result-section');
    const loadingSection = document.getElementById('loading-section');
    const historyList = document.getElementById('history-list');
    const themeToggle = document.getElementById('theme-toggle');

    // New feature elements
    const scoreSection = document.getElementById('score-section');
    const scoreGrade = document.getElementById('score-grade');
    const scoreNumber = document.getElementById('score-number');
    const scoreMsg = document.getElementById('score-msg');
    const streakBadge = document.getElementById('streak-badge');
    const graphSection = document.getElementById('graph-section');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Fortune elements
    const fortuneBtn = document.getElementById('fortune-btn');
    const fortuneResult = document.getElementById('fortune-result');
    const fortuneLoading = document.getElementById('fortune-loading');
    const fortuneError = document.getElementById('fortune-error');
    const fortuneTodayMsg = document.getElementById('fortune-today-msg');
    const fortuneColor = document.getElementById('fortune-color');
    const fortuneNumber = document.getElementById('fortune-number');
    const fortuneOverallStars = document.getElementById('fortune-overall-stars');
    const fortuneLoveStars = document.getElementById('fortune-love-stars');
    const fortuneMoneyStars = document.getElementById('fortune-money-stars');
    const fortuneHealthStars = document.getElementById('fortune-health-stars');
    const fortuneOverallMsg = document.getElementById('fortune-overall-msg');
    const fortuneLoveMsg = document.getElementById('fortune-love-msg');
    const fortuneMoneyMsg = document.getElementById('fortune-money-msg');
    const fortuneHealthMsg = document.getElementById('fortune-health-msg');

    let emotionChart = null;
    let chatHistory = []; // 대화 히스토리 (챗봇용)
    let currentSentiment = null; // 최신 분석 결과 감정 저장

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

    // Dark mode logic
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

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

    // Sample chips click handler
    document.querySelectorAll('.sample-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            textInput.value = chip.dataset.text;
            charCurrent.textContent = textInput.value.length;
            textInput.focus();
        });
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
            currentSentiment = data.result.sentiment; // 감정 저장
            fetchHistory(); // 새로 분석된 기록 갱신

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

        // 점수 계산 및 그래프 업데이트
        updateScore(result.sentiment, result.confidence);
        fetchAndRenderGraph();
    }

    function hideResult() {
        resultSection.classList.add('hidden');
        intensityBar.style.width = '0%';
    }

    function setLoading(isLoading) {
        if (isLoading) {
            analyzeBtn.textContent = '분석 중...';
            analyzeBtn.disabled = true;
            loadingSection.classList.remove('hidden');
        } else {
            analyzeBtn.textContent = '분석하기';
            analyzeBtn.disabled = false;
            loadingSection.classList.add('hidden');
        }
    }

    async function fetchHistory() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            if (data.success && data.data && data.data.length > 0) {
                historyList.innerHTML = '';
                data.data.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'history-item';

                    // Truncate text for privacy
                    let shortText = item.input_text;
                    if (shortText.length > 30) {
                        shortText = shortText.substring(0, 30) + '...';
                    }

                    el.innerHTML = `
                        <span class="history-text">"${shortText}"</span>
                        <span class="history-sentiment" style="background-color: ${getSentimentColor(item.sentiment)}">${item.sentiment}</span>
                    `;
                    historyList.appendChild(el);
                });
            } else {
                historyList.innerHTML = '<p style="color:var(--color-gray);font-size:0.9rem;">아직 분석 기록이 없습니다.</p>';
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
            historyList.innerHTML = '<p style="color:var(--color-error);font-size:0.9rem;">기록을 불러오지 못했습니다.</p>';
        }
    }

    function getSentimentColor(sentiment) {
        if (sentiment === 'positive') return '#2E7D32';
        if (sentiment === 'negative') return '#C62828';
        if (sentiment === 'neutral') return '#616161';
        return '#000000';
    }

    // 초기 로드 시 기록 불러오기
    fetchHistory();
    fetchAndRenderGraph();

    // ===== 감정 점수 기능 =====
    function updateScore(sentiment, confidence) {
        let score;
        if (sentiment === 'positive') score = confidence;
        else if (sentiment === 'negative') score = 100 - confidence;
        else score = 50;

        // 연속 긍정 streak 계산
        let streak = parseInt(localStorage.getItem('positiveStreak') || '0');
        const lastSentiment = localStorage.getItem('lastSentiment');
        if (sentiment === 'positive') {
            streak = lastSentiment === 'positive' ? streak + 1 : 1;
        } else {
            streak = 0;
        }
        localStorage.setItem('positiveStreak', streak);
        localStorage.setItem('lastSentiment', sentiment);

        // 등급 결정
        let grade, msg, gradeColor;
        if (score >= 85) { grade = 'S'; msg = '오늘 감정 상태가 최상이에요! 이 에너지 유지하세요 🔥'; gradeColor = '#FF6B35'; }
        else if (score >= 70) { grade = 'A'; msg = '긍정적인 하루를 보내고 계시네요 😊'; gradeColor = '#2E7D32'; }
        else if (score >= 55) { grade = 'B'; msg = '평온하고 안정적인 감정 상태예요 😌'; gradeColor = '#1565C0'; }
        else if (score >= 40) { grade = 'C'; msg = '조금 힘드실 수 있어요. 잠깐 쉬어보세요 🍵'; gradeColor = '#E65100'; }
        else { grade = 'D'; msg = '많이 힘드신 것 같아요. 마음이 챗봇에게 털어놔 보세요 💙'; gradeColor = '#C62828'; }

        scoreGrade.textContent = grade;
        scoreGrade.style.color = gradeColor;
        scoreNumber.textContent = `${score}점`;
        scoreMsg.textContent = msg;

        // streak 뱃지
        if (streak >= 2) {
            streakBadge.textContent = `🔥 ${streak}일 연속 긍정!`;
            streakBadge.classList.remove('hidden');
        } else {
            streakBadge.classList.add('hidden');
        }

        scoreSection.classList.remove('hidden');
    }

    // ===== 감정 변화 그래프 =====
    async function fetchAndRenderGraph() {
        try {
            const response = await fetch('/api/history?limit=10');
            const data = await response.json();
            if (!data.success || !data.data || data.data.length === 0) return;

            // 오래된 순으로 정렬
            const logs = [...data.data].reverse();
            const labels = logs.map((_, i) => `#${i + 1}`);
            const values = logs.map(item => {
                if (item.sentiment === 'positive') return 1;
                if (item.sentiment === 'negative') return -1;
                return 0;
            });
            const pointColors = logs.map(item => getSentimentColor(item.sentiment));

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
            const fontColor = isDark ? '#AAAAAA' : '#666666';

            if (emotionChart) emotionChart.destroy();

            const ctx = document.getElementById('emotion-chart').getContext('2d');
            emotionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: '감정 흐름',
                        data: values,
                        borderColor: '#000000',
                        backgroundColor: 'rgba(0,0,0,0.05)',
                        pointBackgroundColor: pointColors,
                        pointRadius: 7,
                        pointHoverRadius: 9,
                        tension: 0.4,
                        fill: true,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            min: -1.5, max: 1.5,
                            ticks: {
                                color: fontColor,
                                callback: v => v === 1 ? '긍정' : v === 0 ? '중립' : v === -1 ? '부정' : ''
                            },
                            grid: { color: gridColor }
                        },
                        x: {
                            ticks: { color: fontColor },
                            grid: { color: gridColor }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => {
                                    const v = ctx.parsed.y;
                                    return v === 1 ? '긍정 😊' : v === -1 ? '부정 😞' : '중립 😐';
                                }
                            }
                        }
                    }
                }
            });

            graphSection.classList.remove('hidden');
        } catch (err) {
            console.error('Graph fetch error:', err);
        }
    }

    // ===== AI 감정 챗봇 =====
    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.classList.toggle('hidden');
        if (!chatbotWindow.classList.contains('hidden')) {
            chatbotInput.focus();
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.classList.add('hidden');
    });

    chatbotSend.addEventListener('click', sendChatMessage);
    chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    async function sendChatMessage() {
        const msg = chatbotInput.value.trim();
        if (!msg) return;

        chatbotInput.value = '';
        chatbotSend.disabled = true;

        // 사용자 말풍선 추가
        appendChatBubble(msg, 'user');

        // 대화 히스토리에 추가
        chatHistory.push({ role: 'user', content: msg });

        // 타이핑 인디케이터
        const typingEl = appendChatBubble('마음이가 입력 중...', 'typing');
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });
            const data = await response.json();

            typingEl.remove();

            if (data.success) {
                appendChatBubble(data.reply, 'bot');
                chatHistory.push({ role: 'assistant', content: data.reply });
                // 대화 히스토리가 너무 길어지면 앞 메시지 제거 (최근 20개 유지)
                if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
            } else {
                appendChatBubble('죄송해요, 지금 잠깐 문제가 생겼어요. 잠시 후 다시 시도해 주세요. 🙏', 'bot');
            }
        } catch (err) {
            typingEl.remove();
            appendChatBubble('연결에 문제가 생겼어요. 잠시 후 다시 시도해 주세요. 🙏', 'bot');
            console.error('Chat error:', err);
        } finally {
            chatbotSend.disabled = false;
            chatbotInput.focus();
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

    function appendChatBubble(text, type) {
        const el = document.createElement('div');
        el.className = `chat-bubble ${type}`;
        el.textContent = text;
        chatbotMessages.appendChild(el);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return el;
    }

    // ===== 오늘의 운세 기능 =====
    fortuneBtn.addEventListener('click', async () => {
        fortuneBtn.disabled = true;
        fortuneResult.classList.add('hidden');
        fortuneError.classList.add('hidden');
        fortuneLoading.classList.remove('hidden');

        try {
            const response = await fetch('/api/fortune', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sentiment: currentSentiment })
            });
            const data = await response.json();

            if (data.success) {
                renderFortune(data.fortune);
                fortuneResult.classList.remove('hidden');
            } else {
                fortuneError.textContent = data.message || '운세를 가져오지 못했습니다.';
                fortuneError.classList.remove('hidden');
            }
        } catch (err) {
            console.error('Fortune fetch error:', err);
            fortuneError.textContent = '서버 통신에 실패했습니다.';
            fortuneError.classList.remove('hidden');
        } finally {
            fortuneLoading.classList.add('hidden');
            fortuneBtn.disabled = false;
        }
    });

    function renderFortune(fortune) {
        fortuneTodayMsg.textContent = fortune.today_message;
        fortuneColor.textContent = fortune.lucky_color;
        fortuneNumber.textContent = fortune.lucky_number;

        renderStars(fortuneOverallStars, fortune.overall.stars);
        fortuneOverallMsg.textContent = fortune.overall.message;

        renderStars(fortuneLoveStars, fortune.love.stars);
        fortuneLoveMsg.textContent = fortune.love.message;

        renderStars(fortuneMoneyStars, fortune.money.stars);
        fortuneMoneyMsg.textContent = fortune.money.message;

        renderStars(fortuneHealthStars, fortune.health.stars);
        fortuneHealthMsg.textContent = fortune.health.message;
    }

    function renderStars(container, count) {
        container.textContent = '★'.repeat(count) + '☆'.repeat(5 - count);
    }
});
