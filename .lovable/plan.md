# Job Decoder 제품 감사 (V0.2 우선순위)

목표 기준: 한국 취준생이 반복 사용하고, 이후 SEO/유료화가 가능한 신뢰도 높은 JD 분석 서비스.

## 1. 가장 큰 신뢰도 리스크: mock 분석 fallback

확인한 사실 (`src/pages/Index.tsx` 61-108행):

- `analyzeWithAI` 실패 시 `catch`에서 `mockAnalysis.ts`의 키워드 매칭 결과로 그대로 전환한다.
- 사용자에게 남는 신호는 사라지는 토스트 하나뿐이고, 리포트 화면·헤더·PDF·복사 결과·`saveToHistory` 기록 모두 실제 AI 분석과 100% 동일하게 표시된다.
- 즉 AI가 죽었을 때도 "JD Match Score 62%", "숨겨진 요구사항", "리크루터 인사이트" 같은 단정적 문장이 진짜 분석처럼 보인다. 유료화/신뢰도 관점에서 이건 제품 최대 결함이다.

또한 AI 경로에서도 일부 섹션이 mock 로직으로 채워진다:

- `ExperienceMatchingSection` / `DashboardSummary`는 `matchExperiences()`(키워드 포함 여부 계산)에 의존한다.
- `experienceMatches`는 AI 응답에서 항상 빈 배열이라, AI 경로에서는 사실상 빈 카드가 남는다.
- 히스토리에서 항목을 다시 열면 `jdMatchResult`가 `null`로 복원되어 Match Score 전체가 사라진다(데이터 유실처럼 보임).

V0.2 결정: **자동 mock 전환 제거.** 실패 시 리포트를 그리지 않고 "분석에 실패했습니다 / 다시 시도" 상태로 명확히 보여준다. mock 로직은 예시 화면·개발용으로만 남기고 사용자 결과 경로에서 분리한다.

## 2. 보안 / 비용 리스크

- `analyze-job`은 `verify_jwt = false`(`supabase/config.toml`) + CORS `*`. 누구나 URL만 알면 무제한 호출 가능 → AI 크레딧 직접 소진 경로.
- 레이트 리밋·요청 길이 상한 없음. `jobDescription` 길이 제한이 없어 한 번 호출로 큰 토큰을 태울 수 있다.
- `scrape-job-url`은 임의 URL을 서버에서 fetch하고 이미지를 최대 10개까지 병렬로 받아 비전 모델에 넣는다. 임의 URL fetch(SSRF성 요청)와 호출당 비용이 가장 큰 함수다.
- 인증 도입 시점 판단: **V0.2에서는 로그인 강제하지 않는다.** 로그인 벽은 초기 유입을 죽인다. 대신 (a) 입력 길이 상한, (b) IP/세션 기준 일일 호출 제한, (c) 스크래핑 이미지 수 축소를 먼저 넣는다. 로그인(+DB 저장, 이력 동기화)은 **V0.3**, 유료 플랜/사용량 과금이 논의될 때 도입한다.

## 3. UX 문제

- 리포트 카드가 12개 이상. 취준생이 실제로 쓰는 정보(Match Score, 부족 키워드, 필수 기술, 지원 전략)와 장식적 섹션(숨겨진 요구사항, 리크루터 인사이트, 대시보드)이 같은 비중으로 나열된다.
- 히스토리 복원 시 Match Score 소실(위 1번).
- URL 자동 입력 실패 시 안내가 "채용공고가 아닌 것 같습니다" 수준으로만 나와서, 사용자가 무엇을 고쳐야 할지 모른다(목록 페이지 대신 상세 공고 URL을 넣어야 함).
- 이력서 미입력 시 리포트의 절반(Resume Match)이 통째로 사라지지만, 입력 단계에서 그 이득이 약하게만 설명된다.
- 분석 대기 중 진행 상태가 스피너 하나뿐(실제 15~30초 소요).
- 모바일: `lg:grid-cols-3` 기반이라 모바일에서는 전부 1열로 길게 쌓인다. 우선순위 재정렬 없이 그냥 길어져서 스크롤이 매우 깊다.

## 4. SEO / 메타데이터 문제

- `index.html`: `<html lang="en">`인데 콘텐츠는 한국어. `<title>`/description이 "채용공고 분석" 한 단어 수준, `meta author = Lovable`, TODO 주석 잔존.
- canonical 없음, `og:url` 없음, `og:image`가 Lovable 미리보기 스크린샷 R2 URL.
- JSON-LD 없음. 라우트가 `/` 하나뿐이라 색인 가능한 콘텐츠 표면이 사실상 0 → 유입 가능한 페이지(가이드/직무별 페이지)는 별도 과제.

## 5. 전형적인 AI 생성물처럼 보이는 요소 (확인된 위치)

- `Index.tsx` 149·316행, `index.css` 146행: primary→secondary 그라디언트 로고 블록/사이드바.
- `JdMatchScoreCard.tsx` 33행: 카드 상단 그라디언트 액센트 바.
- `DashboardSummary.tsx` 48행: 그라디언트 배지.
- `Index.tsx` 177행: "AI-Powered Job Analysis" 상단 라벨 + 히어로 3단 반복 카피 + 이탤릭 태그라인.
- `JobInputForm.tsx` 205행: Sparkles 아이콘 CTA.
- `ReportHeader.tsx` 18행: 장식용 pill 배지 + `uppercase tracking-[0.15em]` 영문 라벨(227·241행에도 반복).
- 모든 섹션이 동일한 `rounded-xl` 카드 + 그림자 유틸(`card-elevated`, `card-highlight`, `glass-card`)로 균일하게 반복.

## V0.2에서 반드시 고칠 것

1. mock 자동 전환 제거 + 명시적 실패 상태 (신뢰도 최우선).
2. AI 경로에서 데이터가 없는 섹션(경험 매칭, 대시보드) 숨김 처리, 히스토리 복원 시 Match Score 유지.
3. 비용 방어: 입력 길이 상한, 일일 호출 제한, 스크래핑 이미지 수 축소. 로그인은 도입하지 않음.
4. 디자인 방향 전환: 흰색/아주 연한 회색 배경, 네이비-블루 단일 액센트, 그라디언트 전면 제거, 카드 대신 얇은 구분선 + 넓은 여백, 아이콘 최소화.
5. 카피 정리: "AI-Powered" 등 AI 강조 제거, 한국어 중심 실무 문장으로 축약, 히어로 1문장 + 1보조문장.
6. 리포트 정보 구조 축약: 핵심 4개(매칭도 / 부족 키워드+보완법 / 필수·우대 기술 / 지원 전략)를 상단에 고정, 부가 섹션은 접기 또는 후순위.
7. 모바일 우선 재배치: 모바일에서 위 4개가 먼저 보이도록, 분석 중 단계 표시 추가.
8. `index.html` 메타 정리: `lang="ko"`, 실제 title/description, canonical, og:url/og:title/og:description, WebApplication JSON-LD, Lovable 잔존 값 제거.

## 이후로 미룰 것 (V0.3+)

- 로그인 + 분석 이력 DB 저장/동기화, 사용량 기반 유료 플랜.
- SEO 유입용 콘텐츠 라우트(직무별 JD 해설, 가이드 페이지)와 per-route 메타.
- URL 스크래핑 성공률 개선(렌더링 서비스 도입), 파일 직접 업로드(PDF/이미지).
- 이력서 파싱 정교화, 산업/직군별 프롬프트 분기.
- 결과 공유 링크, 팀/코치용 기능.

## 기술 메모

- 변경 집중 파일: `src/pages/Index.tsx`(fallback·레이아웃·카피), `src/index.css` + `tailwind.config.ts`(토큰), `JdMatchScoreCard`/`ReportHeader`/`DashboardSummary`/`JobInputForm`(장식 제거), `index.html`(메타), `supabase/functions/*`(입력 상한·레이트 리밋).
- `mockAnalysis.ts` / `jdMatch.ts`는 삭제하지 않고 사용자 결과 경로에서만 분리한다(예시/테스트 용도 유지).
- 레이트 리밋은 Cloud 테이블 한 개(요청 카운터) + 엣지 함수 내 검사로 구현 가능. RLS·GRANT 포함.
