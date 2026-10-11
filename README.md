# JobDecoder

채용공고·이력서 입력을 분석해 요구 기술, 보완 항목과 지원 준비 정보를 리포트로 정리하는 웹 서비스입니다. 기존 `job-decoder-0524` repository를 활용합니다.

[현재 Demo](https://job-decoder-0524.lovable.app)

## Problem / Input

JD는 비정형 텍스트이며 URL·직접 입력·이미지/PDF 경로로 들어옵니다. 프런트에서 직접 입력하거나 `scrape-job-url` Edge Function을 통해 입력을 취득합니다. 실제 이력서·사용자 log/history는 repository에 포함하지 않습니다.

## Architecture / Data Flow

```text
URL → Supabase scrape-job-url → HTML text / image / PDF 처리 → JD 입력
JD + optional resume → Supabase analyze-job → Lovable AI gateway
                    → client normalization → report / local history
```

- Frontend: React 18, Vite, TypeScript, shadcn/ui, Tailwind, Supabase JS SDK.
- Backend: Supabase Edge Functions(Deno).
- API: `https://ai.gateway.lovable.dev/v1/chat/completions`.
- 코드 지정 model: analyze-job = `google/gemini-3-flash-preview`, scrape-job-url = `google/gemini-2.5-flash`.
- `LOVABLE_API_KEY`는 Edge Function server 환경변수입니다. 직접 Gemini API integration 또는 자체 모델로 설명하지 않습니다.

## Processing and Validation

`analyze-job`은 JD/이력서 입력 길이 제한 및 gateway 429/402 오류 처리를 포함합니다. `src/lib/aiAnalysis.ts`는 반환 배열·선택 field를 정규화하고 score를 0–100 범위로 보정합니다. 완전한 server-side response schema 검증이나 출력 정확도 보장을 의미하지 않습니다.

주 화면의 Match Score는 **LLM 반환값**입니다. `src/lib/jdMatch.ts`의 별도 keyword-match 함수는 현재 Index의 주 분석 경로에서 사용되지 않으며 핵심 서비스 알고리즘으로 소개하지 않습니다. Score 정확도, 합격 예측력, ATS 성능은 검증하지 않았습니다.

`analysisHistory.ts`는 최대 10개 분석 기록을 localStorage에 저장합니다. 이력서 원문은 저장하지 않지만 JD 원문·분석 결과·이력서 keyword는 개인/비공개 정보를 포함할 수 있습니다. 실제 사용자 export와 browser storage dump를 commit하지 마세요.

## How to Run

Node.js 20+:

```bash
npm ci
cp .env.example .env.local
# Replace client placeholders with your Supabase project configuration.
npm run dev
```

Client의 Supabase publishable/anon key와 server secret은 구분합니다. `.env.local`은 ignored입니다. Server key를 VITE 변수에 넣으면 browser bundle에 노출되므로 사용하지 마세요.

Supabase CLI가 있는 본인 project 환경에서 server key를 환경변수로 등록하고 기존 `analyze-job`, `scrape-job-url` 함수를 배포해야 합니다. Key를 명령행 또는 repository에 직접 기록하지 마세요. 이 README 정리 단계에서는 원격 함수를 변경·배포하지 않았습니다.

## Checks

```bash
npm run build
npx tsc --noEmit
npm run lint
npm test
```

기존 example test는 분석 품질 검증이 아닙니다. Frontend build·화면 확인과 실제 Edge Function/gateway 호출은 별도 검사이며, 이번 문서 수정에서 유료 AI 호출을 실행하지 않습니다.

## Deployment

Google Sites 의존이 없는 Vite 웹앱입니다. 기존 Supabase backend를 유지하며 Vercel/Netlify에 frontend를 배포할 수 있습니다. Static SPA fallback과 VITE client configuration이 필요합니다. GitHub Pages는 frontend만 제공하며 Edge Function을 host하지 않습니다. 현재 Lovable demo는 유지하며 다른 host로 실제 이전하지 않았습니다.

## Limitations / Public Release

LLM 출력 일관성·점수 정확도·사용자 규모·production 운영 성과를 주장하지 않습니다. SQL 질의/migration 구현은 확인되지 않았습니다. URL 수집 성공은 대상 page 형식·접근 제한에 따라 달라집니다.

`supabase/config.toml`의 analyze-job은 `verify_jwt=false`이며 함수 source는 CORS `*`를 허용합니다. 분석·URL 수집 함수에서 별도 사용자 인증, 사용자별 rate limit 또는 usage quota를 확인하지 못했습니다. Gateway 429/402 처리는 이 접근 제어를 대신하지 않습니다. URL 수집에는 별도 host allowlist도 확인되지 않았습니다.

따라서 기존 repository는 **Private으로 유지**합니다. 기존 demo와 portfolio case study만 제공합니다. 이번 작업은 입력 없는 OPTIONS 및 빈 JSON 요청처럼 유료 gateway 이전에 종료되는 경로만 점검하며, 정상 AI 요청·비용·운영 정확도를 검증하지 않습니다. 원격 backend 또는 접근 정책은 변경하지 않았습니다. Publishable/anon key는 browser client configuration이며 server secret과 다릅니다.

추적된 `.env`는 local copy에서 제거하고 `.env.example`로 대체했습니다. 과거 history의 client configuration은 별도 검사합니다. 서버 secret, 실제 이력서·사용자 history·개인 로그는 공개 대상에서 제외합니다.
