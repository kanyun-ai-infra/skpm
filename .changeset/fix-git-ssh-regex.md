---
"reskill": patch
---

Fix Git SSH URL parsing and add WellKnownRegistry type

**Bug Fixes:**
- Fix `normalizeGitSshUrl` regex capture group issue where `.git` suffix might not be correctly handled
- Simplify regex pattern and explicitly remove `.git` suffix for more reliable parsing

**Improvements:**
- Add `WellKnownRegistry` type export for consumers who need to type registry names
- Add JSDoc documentation for `addRegistry()` method explaining the silent return behavior

**Tests:**
- Add test cases for SSH URL parsing edge cases (with/without `.git`, with/without version)

---

修复 Git SSH URL 解析并添加 WellKnownRegistry 类型

**Bug 修复：**
- 修复 `normalizeGitSshUrl` 正则表达式捕获组问题，`.git` 后缀可能无法正确处理
- 简化正则表达式模式并显式移除 `.git` 后缀，使解析更可靠

**改进：**
- 添加 `WellKnownRegistry` 类型导出，供需要类型化 registry 名称的消费者使用
- 为 `addRegistry()` 方法添加 JSDoc 文档，说明静默返回的行为

**测试：**
- 添加 SSH URL 解析边缘情况的测试用例（有/无 `.git`、有/无版本号）
