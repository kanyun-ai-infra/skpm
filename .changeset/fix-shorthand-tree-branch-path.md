---
"reskill": patch
---

Fix shorthand skill references not recognizing `tree/branch/path` format

**Bug Fixes:**
- `GitResolver.parseRef()` now correctly handles GitHub web URL style paths in shorthand format (e.g., `github:vercel-labs/skills/tree/main/skills/find-skills`)
- Previously, only full HTTPS URLs (`https://github.com/...`) could recognize the `tree/branch/path` pattern; shorthand format would incorrectly treat the entire `tree/main/...` as a subPath, causing "Subpath not found" errors during installation
- The fix detects `tree`, `blob`, and `raw` keywords in the shorthand path and correctly extracts the branch name and subPath

**Tests:**
- Added 7 unit tests covering: shorthand with `tree/branch/path`, without subpath, `blob/branch/path`, no registry prefix, `tree` as regular subpath (no false positive), and version override precedence

---

修复 shorthand 格式的 skill 引用无法识别 `tree/branch/path` 的问题

**Bug 修复：**
- `GitResolver.parseRef()` 现在能正确处理 shorthand 格式中的 GitHub 网页 URL 风格路径（如 `github:vercel-labs/skills/tree/main/skills/find-skills`）
- 此前只有完整 HTTPS URL（`https://github.com/...`）才能识别 `tree/branch/path` 模式；shorthand 格式会将整个 `tree/main/...` 错误地当作 subPath，导致安装时报 "Subpath not found" 错误
- 修复方案：在 shorthand 路径中检测 `tree`、`blob`、`raw` 关键词，正确提取 branch 和 subPath

**测试：**
- 新增 7 个单元测试，覆盖：shorthand + `tree/branch/path`、无 subpath、`blob/branch/path`、无 registry 前缀、`tree` 作为普通 subpath（无误判）、版本覆盖优先级
