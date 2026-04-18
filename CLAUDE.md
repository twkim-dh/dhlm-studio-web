@AGENTS.md

---

## ⛔ 언어 규칙 (Language Rules)

- **모든 응답은 한국어로 작성한다.**
- 대표님(tw.kim@dhlm.co.kr)과의 대화: 반드시 한국어
- 코드 주석 / 커밋 메시지: 영어 허용
- 일본어, 중국어, 기타 언어 사용 절대 금지
- 영어 기술 용어(API, TypeScript 등)는 그대로 사용 가능

---

## 리포트 히어로 이미지 선정 규칙

1. **주제와 직접 연관된 이미지를 선택한다.**
   - Anthropic / AI → AI 서버, 데이터센터, 신경망 시각화
   - Crypto / 블록체인 → 디지털자산, 블록체인, 암호화폐
   - SpaceX / 우주 → 로켓 발사, 우주, 위성
   - CRCL / 핀테크 → 디지털결제, 스테이블코인, 모바일 결제

2. **추상적인 범용 이미지로 대체하지 않는다.**
   - ❌ 아무 회로판, 관계없는 도시 야경, 일반 "technology" 사진
   - ✅ 리포트 내용을 구체적으로 연상시키는 이미지

3. **Unsplash 검색 시 구체적 키워드 사용한다.**
   - ❌ `technology` (너무 범용)
   - ✅ `ethereum blockchain`, `rocket launch`, `stablecoin payment`

4. **적절한 이미지를 찾을 수 없으면 대표님에게 확인 후 진행한다.**

5. **기존 리포트 중 주제와 맞지 않는 이미지는 순차적으로 교체한다.**

---

## ⛔ FMP API 호출 규칙 (절대 준수)

```
✅ Cron 외 FMP 호출 금지
✅ 사용자 요청 → Redis만 읽기 (캐시 miss 시 stale 반환)
✅ FMP stable/quote 단일 심볼만 사용 (무료 tier 지원)
❌ FMP comma-separated batch 금지 (premium 전용)
❌ FMP ETF 심볼(XLK, XLF, SPY 등) FMP 호출 금지 (premium 전용)
❌ FMP legacy endpoint (api/v3/quote/...) 금지 (2025-08 이후 차단)
```

**일일 호출 목표: 10회 이하 (free tier 250회 한도의 4%)**
- Cron market-snapshot: 30(top30) + 3(macro) = 33회/일
- Cron daily-brief: ~8회/일
- 합계: ~41회/일 (250 이내)

**새 기능 추가 시:**
1. 이미 수집한 Redis 데이터로 구현 가능? → 재사용
2. Cron batch에 심볼 추가? → cron 수정
3. 추가 FMP 호출 필요? → 대표님 승인 후 진행

---

## ⛔ NON-NEGOTIABLE: Every Task Must End With Git Push

```
git add [changed files]
git status
git commit -m "description"
git pull --rebase origin main   ← sync remote changes first
git push origin main
```

Then wait 2-3 minutes for Vercel to deploy.
Then verify on the PRODUCTION URL (dhlm-studio.com).

**If you did not `git push`, NOTHING you did exists.**
**Never report "done" without confirming `git push` succeeded.**

---

## Token Optimization Rules (Auto-apply every session)
> DHLM Claude Code Token Optimization Guide v1.0 — 2026.04.13

### 1. Context Management — Prevent Context Rot
- After editing 3+ files → `/compact`
- After every `git push` → `/compact`
- Starting a new priority/task → `/clear`
- Session longer than 30 minutes → `/compact`
- Claude repeats itself or makes errors → `/clear` immediately

### 2. Effort Levels — Match Cost to Task
- **Low** — typos, 1-line fixes, variable renames: `--effort low`
- **Medium** — component updates, config changes (default): `--effort medium`
- **High** — new features, complex logic, architecture: `--effort high`

Rule: Default to medium. Only use high when the task genuinely requires deep reasoning.

### 3. File Reading — Biggest Token Waste
- **NEVER** `cat` an entire file or read full build output
- Grep first to locate exact lines before reading
- Use `offset` + `limit` on Read for large files (head-50 equivalent)
- Never re-read a file already read in the same session
- Build errors only: pipe through `grep -i error` / `tail -20`

```
BAD:  Read entire 5,000-line file
GOOD: Grep "keyword" → Read offset:100 limit:30
```

### 4. Bulk Operations
- Never edit files one by one for repetitive changes
- Use `sed -i 's/old/new/g'` scripts or batch commands
- Claude Code batch: up to 30 parallel changes

### 5. Communication Rules
- No preambles ("I will now proceed to...")
- No repeating previous context
- No explaining what you're about to do — just do it
- Report results concisely: what changed, what file, done

### 6. MCP Servers
- Maximum 10 per project (tool descriptions consume tokens)

---

## Project: DHLM-STUDIO
**Path:** `C:\Users\twkim\Desktop\DHLM-STUDIO`
**Stack:** Next.js (see AGENTS.md for version notes) · TypeScript · Tailwind
**Deploy:** Vercel → dhlm-studio.com

CRITICAL: Always verify you are in `C:\Users\twkim\Desktop\DHLM-STUDIO` before making any changes. Never work in the wrong project folder.

---

## ⛔ DHLM-QRI 폴더 접근 금지

C:\Users\twkim\Desktop\DHLM-QRI\ 폴더 내 파일을 **절대 읽지도, 쓰지도, 수정하지도 않는다.**
특히 `02_KB_문서/외부문헌_학습정리.md`는 2,700건+ 학습 데이터 — 덮어쓰기 시 복구 불가능한 손실.
2회 사고 이력(2026-03-27, 2026-03-30). 이 프로젝트의 파일은 이 프로젝트 폴더에만 저장한다.
