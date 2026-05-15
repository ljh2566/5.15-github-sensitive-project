# DB_SCHEMA.md

# Supabase DB 설계

## 테이블 이름

```sql
analysis_logs
```

---

# 컬럼 구조

| 컬럼명 | 타입 | 설명 |
|---|---|---|
| id | uuid | 기본 키 |
| input_text | text | 사용자 입력 |
| sentiment | text | 감정 결과 |
| confidence | int | 신뢰도 |
| reason | text | 분석 이유 |
| created_at | timestamp | 생성 시간 |

---

# 생성 SQL

```sql
create table analysis_logs (
    id uuid primary key default gen_random_uuid(),
    input_text text not null,
    sentiment text not null,
    confidence int not null,
    reason text,
    created_at timestamp default now()
);
```

---

# 완료 기준

- 데이터 저장 성공
- timestamp 자동 생성
- null 오류 없음
