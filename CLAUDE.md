@AGENTS.md

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
