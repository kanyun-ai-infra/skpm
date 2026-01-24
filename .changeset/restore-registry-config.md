---
"reskill": minor
---

Restore custom registry configuration support

**Changes:**
- Added `RegistryResolver` type and `GitResolverOptions` interface to `GitResolver`
- `GitResolver` now accepts an optional `registryResolver` function for custom registry URL resolution
- `SkillManager` passes `ConfigLoader.getRegistryUrl()` to `GitResolver` to enable custom registries
- Exported new types `GitResolverOptions` and `RegistryResolver` from core module
- Default `skills.json` template now includes `registries` section with `github` pre-configured

**Usage:**
```json
{
  "skills": {
    "internal-tool": "internal:team/tool@latest"
  },
  "registries": {
    "internal": "https://gitlab.company.com"
  }
}
```

---

恢复自定义 registry 配置支持

**变更:**
- 为 `GitResolver` 添加 `RegistryResolver` 类型和 `GitResolverOptions` 接口
- `GitResolver` 现在接受可选的 `registryResolver` 函数用于自定义 registry URL 解析
- `SkillManager` 将 `ConfigLoader.getRegistryUrl()` 传递给 `GitResolver` 以启用自定义 registries
- 从 core 模块导出新类型 `GitResolverOptions` 和 `RegistryResolver`
- 默认 `skills.json` 模板现在包含预配置 `github` 的 `registries` 部分

**使用方式:**
```json
{
  "skills": {
    "internal-tool": "internal:team/tool@latest"
  },
  "registries": {
    "internal": "https://gitlab.company.com"
  }
}
```
