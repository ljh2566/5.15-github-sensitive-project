# AGENTS.md

# 프로젝트 작업 규칙

## 프로젝트 개요
이 프로젝트는 HTML, CSS, JavaScript 기반 감성 분석 웹 서비스이다.
사용자가 입력한 텍스트를 OpenAI API로 분석하여 긍정 / 부정 / 중립 결과를 제공한다.

---

# 필수 기술 스택

- Front-End: HTML, CSS, JavaScript
- Back-End: Node.js (Express)
- AI API: OpenAI API
- Database: Supabase
- Deployment: Vercel

추가 라이브러리는 반드시 필요할 때만 사용한다.

---

# UI 규칙

## 디자인 방향
첨부된 레퍼런스 UI 스타일을 참고한다.

### 핵심 특징
- 미니멀 디자인
- 넓은 여백
- 굵은 타이포그래피
- 라운드 버튼
- 흑백 기반 UI
- 카드형 섹션 구성
- 단순하고 직관적인 화면

### 금지 사항
- 과도한 색상 사용 금지
- 복잡한 애니메이션 금지
- 과도한 그림자 효과 금지
- Bootstrap 사용 금지

---

# 기능 구현 범위

## 반드시 구현해야 하는 기능
1. 사용자 텍스트 입력
2. 감성 분석 요청
3. 긍정 / 부정 / 중립 결과 표시
4. 신뢰도(%) 표시
5. 분석 이유 표시
6. 오류 메시지 표시
7. 분석 기록 저장
8. 반응형 UI

## 구현 제외 범위
- 회원가입
- 로그인
- 소셜 로그인
- 다국어 기능
- 음성 입력
- 이미지 감성 분석

---

# 작업 규칙

## 프론트엔드
- HTML semantic tag 사용
- CSS는 파일 분리
- JavaScript는 기능 단위로 분리
- 모든 버튼에는 hover 상태 구현
- 모바일 반응형 필수

## 백엔드
- Express 구조 사용
- API 라우터 분리
- 환경 변수 사용 (.env)
- API Key 하드코딩 금지

## API 규칙
OpenAI 응답 형식은 반드시 아래 JSON 구조를 유지한다.

```json
{
  "sentiment": "positive",
  "confidence": 92,
  "reason": "긍정적인 단어 사용 비율이 높음"
}
```

---

# 완료 기준

다음 조건을 모두 만족해야 완료로 간주한다.

- 텍스트 입력 가능
- 분석 결과 정상 출력
- 오류 발생 시 메시지 표시
- 모바일 화면 정상 동작
- API 요청 실패 대응
- Supabase 저장 성공
- Vercel 배포 성공

---

# 검증 기준

## 기능 검증
- 긍정 문장 → positive 출력
- 부정 문장 → negative 출력
- 중립 문장 → neutral 출력

## 예외 검증
- 빈 입력 처리
- API 실패 처리
- 네트워크 오류 처리

## UI 검증
- 모바일 반응형 확인
- 버튼 hover 동작 확인
- 레이아웃 깨짐 여부 확인

---

# 폴더 구조 규칙

```bash
project/
│
├── public/
│   ├── css/
│   ├── js/
│   └── assets/
│
├── server/
│   ├── routes/
│   ├── services/
│   └── config/
│
├── docs/
│
├── .env
├── package.json
└── server.js
```
