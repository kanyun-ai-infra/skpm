---
"reskill": patch
---

Fix CLI hanging when connecting to new SSH hosts

**Bug Fixes:**
- Fixed an issue where `reskill install` would hang indefinitely when cloning from a new SSH host (e.g., first time connecting to github.com)
- Git commands now use `StrictHostKeyChecking=accept-new` to automatically accept new host keys while still rejecting changed keys (for security)
- Added `BatchMode=yes` to fail fast instead of waiting for interactive input
- Added `GIT_TERMINAL_PROMPT=0` to prevent HTTPS password prompts from hanging

---

修复连接新 SSH 主机时 CLI 挂起的问题

**Bug 修复：**
- 修复了 `reskill install` 在首次通过 SSH 连接新主机（如首次连接 github.com）时会无限挂起的问题
- Git 命令现在使用 `StrictHostKeyChecking=accept-new` 自动接受新主机的密钥，同时仍会拒绝已更改的密钥（保证安全性）
- 添加 `BatchMode=yes` 使命令在需要交互输入时快速失败而非挂起
- 添加 `GIT_TERMINAL_PROMPT=0` 防止 HTTPS 密码提示导致挂起
