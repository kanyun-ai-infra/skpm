---
"reskill": patch
---

Fix cache collision for different skills in the same monorepo

**Bug:**
When installing multiple skills from the same monorepo (e.g., `github:antfu/skills/skills/unocss` and `github:antfu/skills/skills/pnpm`), they would share the same cache path, causing the wrong skill to be installed.

**Root Cause:**
The `getSkillCachePath` method did not include the `subPath` in the cache path calculation, resulting in all skills from the same repo using identical cache paths.

**Fix:**
Include `subPath` in the cache path to ensure each skill has its own unique cache location:
- Before: `~/.reskill-cache/github/antfu/skills/main/`
- After: `~/.reskill-cache/github/antfu/skills/skills/unocss/main/`

---

修复同一 monorepo 中不同 skills 的缓存冲突问题

**Bug:**
从同一个 monorepo 安装多个 skills 时（如 `github:antfu/skills/skills/unocss` 和 `github:antfu/skills/skills/pnpm`），它们会共用同一个缓存路径，导致安装错误的 skill。

**根本原因:**
`getSkillCachePath` 方法在计算缓存路径时没有包含 `subPath`，导致同一仓库的所有 skills 使用相同的缓存路径。

**修复:**
在缓存路径中包含 `subPath`，确保每个 skill 有独立的缓存位置：
- 修复前: `~/.reskill-cache/github/antfu/skills/main/`
- 修复后: `~/.reskill-cache/github/antfu/skills/skills/unocss/main/`
