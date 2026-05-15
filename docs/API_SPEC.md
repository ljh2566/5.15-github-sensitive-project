# API_SPEC.md

# API 명세서

## Base URL

```bash
/api
```

---

# 감성 분석 요청

## POST /analyze

### Request

```json
{
  "text": "오늘 기분이 너무 좋아!"
}
```

---

### Response Success

```json
{
  "success": true,
  "result": {
    "sentiment": "positive",
    "confidence": 95,
    "reason": "긍정 표현 비율이 높음"
  }
}
```

---

### Response Error

```json
{
  "success": false,
  "message": "텍스트를 입력해주세요."
}
```

---

# 상태 코드

| 코드 | 의미 |
|---|---|
| 200 | 성공 |
| 400 | 잘못된 요청 |
| 500 | 서버 오류 |

---

# OpenAI 프롬프트 규칙

반드시 JSON 형식만 반환하도록 요청한다.

예시:

```text
사용자 입력의 감정을 분석하고 반드시 JSON으로 반환해.
sentiment는 positive, negative, neutral 중 하나만 사용해.
confidence는 숫자만 반환해.
```
