---
"reskill": patch
---

Fix scope selection behavior during skill installation

**Changes:**
- Only skip scope selection prompt when running `reskill install` without arguments (reinstall all)
- Show scope selection prompt when installing a single skill with `reskill install <package>`
- Previously, scope selection was skipped whenever `skills.json` existed, which was incorrect

**Tests:**
- Added unit tests for scope selection logic

---

修复技能安装时的 scope 选择行为

**变更：**
- 仅在执行 `reskill install` 不带参数（重新安装全部）时跳过 scope 选择
- 安装单个技能 `reskill install <package>` 时显示 scope 选择提示
- 之前的行为是只要存在 `skills.json` 就跳过 scope 选择，这是不正确的

**测试：**
- 添加了 scope 选择逻辑的单元测试
