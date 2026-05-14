# xiaopingfeng-site · 操作手册

主站 `xiaopingfeng.com` 的源码和部署文档。

> **仓库**: `github.com/fxp/xiaopingfeng-site`
> **部署**: `git push origin main` → Cloudflare Pages 自动构建，无需 wrangler
> **最后更新**: 2026-05-14

---

## 1. URL 结构

```
xiaopingfeng.com/                     主页（导航枢纽）
xiaopingfeng.com/deepdive/            DeepDive 文章目录（本 repo）
xiaopingfeng.com/deepdive/<slug>/     单篇文章
xiaopingfeng.com/apps/                在线工具目录
xiaopingfeng.com/apps/hypothesisor/   假说验证工具
xiaopingfeng.com/apps/shuozhi/        朔知测评（302 → Cloudflare Worker）
xiaopingfeng.com/apps/skills-creator/ Skills Creator landing
xiaopingfeng.com/apps/claude-code-migration/ Claude Code 迁移指南
xiaopingfeng.com/buzzwords/           AI Buzzwords 周报目录
xiaopingfeng.com/capsules/            短文胶囊（实验性）
xiaopingfeng.com/viewer.html          Markdown viewer（?f=<path>）
```

---

## 2. 部署方式

```
git push origin main
        │
        ▼
Cloudflare Pages（直接构建，无 GitHub Actions 介入）
        │
        ▼
xiaopingfeng.com/
```

构建通常 1–2 分钟完成。无需 wrangler CLI，无需手动触发。

**GitHub Actions** 仅用于自动化任务（不参与静态文件部署）：

| Workflow | 触发 | 说明 |
|---|---|---|
| `translate.yml` | push 含 `index.html` 的 deepdive slug | 用 GLM-5.1 / Claude 自动翻译为英文，commit 回 main |
| `freshness-check.yml` | 周一定时 | 扫描各文章 `index.meta.json` 的 `next_check`，生成 Issue + Slack 通知 |
| `deploy.yml` | （已弃用或备用） | 原 wrangler 部署，当前主部署已切换到 CF Pages 直连 |

---

## 3. Repo 完整结构

```
xiaopingfeng-site/
│
├── CLAUDE.md                         # 本文件，操作手册
├── _redirects                        # Cloudflare Pages 重定向规则
├── index.html                        # 主页
├── viewer.html                       # Markdown viewer（?f=deepdive/xxx/report.md）
├── design-system.html                # 设计系统预览页
│
├── colors_and_type.css               # 设计系统 v2 主样式（所有文章引用）
├── kit.css                           # 补充样式（布局工具类等）
├── mode-toggle.js                    # 深浅色模式切换（data-toggle-mode 按钮）
├── lang-switcher.js                  # 多语言切换注入（inject_lang_switcher.py 写入）
│
├── config/
│   ├── languages.json                # 支持的语言列表（zh/en/...）
│   ├── glossary.json                 # 术语表（翻译时保留原词）
│   └── themes.json                   # 主题色配置（red/amber/mint/signal）
│
├── templates/
│   ├── article.html                  # 新文章模板（含所有 {{PLACEHOLDER}}）
│   └── _strip.html                   # 顶部导航条片段
│
├── scripts/
│   ├── translate.py                  # 双语翻译主脚本（GLM-5.1 + Claude fallback）
│   ├── freshness_check.py            # 文章新鲜度检查
│   ├── inject_lang_switcher.py       # 向已发布 HTML 注入语言切换器
│   ├── migrate_to_v2.py              # 批量迁移旧文章到 Design System v2
│   ├── migrate_to_v2_deep.py         # 深度迁移（处理复杂排版）
│   ├── migrate-vault.sh              # Obsidian vault → repo 路径修复脚本
│   ├── publish-md.sh                 # Markdown → HTML 发布辅助
│   ├── normalize_strip.py            # 统一顶部导航条格式
│   ├── fix_mobile_meta_row.py        # 修复移动端 meta 行问题
│   ├── notify_slack.py               # Slack 通知（freshness / translate）
│   └── llm_client.py                 # 统一 LLM 调用封装
│
├── .github/
│   └── workflows/
│       ├── translate.yml             # 自动翻译 Action
│       ├── freshness-check.yml       # 新鲜度检查 Action
│       └── deploy.yml                # 备用部署（当前主部署用 CF Pages 直连）
│
├── apps/
│   ├── index.html                    # 应用目录页
│   ├── hypothesisor/                 # 假说验证工具
│   │   ├── index.html
│   │   ├── privacy.html
│   │   ├── demo.mp4
│   │   └── demo-poster.jpg
│   ├── skills-creator/               # Skills Creator landing
│   │   └── index.html
│   └── claude-code-migration/        # Claude Code 迁移指南
│       └── index.html
│
├── buzzwords/
│   └── index.html                    # AI Buzzwords 周报目录
│
├── capsules/
│   └── index.html                    # 短文胶囊目录（实验性）
│
└── deepdive/                         # DeepDive 深潜文章（主体内容）
    ├── index.html                    # 文章目录（手动维护列表）
    ├── design-system.html            # 设计系统文档页
    └── <slug>/                       # 每篇文章一个目录（见 §4）
```

---

## 4. DeepDive 文章目录

### 4.1 已上线文章（有 index.html + meta.json）

| Slug | 标题 | 分类 | 双语 |
|---|---|---|---|
| `bot-dream` | 问野的十六个深夜 · Night Lab | NEWDEV | zh |
| `vending-reverse` | 售货机协议 15 分钟逆向 | NEWDEV | zh+en |
| `neolab` | ANDON LABS · 自主组织的前夜 | NEO LAB | zh+en |
| `neolab/project-deal` | PROJECT DEAL · 看不见的不平等 | NEO LAB | zh+en |
| `claude-desktop-buddy/prd` | Buddy 对开发者的价值 | LAB · ANTHROPIC | zh+en |
| `claude-desktop-buddy/protocol` | Buddy 协议深潜 | LAB · ANTHROPIC | zh+en |
| `labor-day-2026` | 劳动的终局，还是转型的前夜？ | ECONOMY | zh+en |
| `labor-day-2026/white-collar` | 白领初级岗的终局加速 | ECONOMY | zh+en+cn |
| `labor-day-2026/rentahuman` | RentAHuman 范式反转 | ECONOMY | zh+en |
| `emotion-vectors` | 情绪向量 | RESEARCH | zh+en |
| `code-with-claude-2026` | Code with Claude 2026 | LAB | zh |
| `china-llm-enterprise-ai` | 中国 LLM 企业 AI | ENTERPRISE | zh |
| `cybertonia` | 控制论第三次降临 | GOV | zh+en |
| `ai-military` | AI 武器化：Claude 与伊朗战争 | GOV | zh+en |
| `palantir-aip` | Palantir AIP Context Layer | ENTERPRISE | zh+en |
| `llm-from-scratch` | LLM from Scratch | INFRA | zh |
| `the-stall` | The Stall | — | zh |
| `anthropic-enterprise-ai` | Anthropic 的 72 小时 | LAB | zh+en |

### 4.2 内容归档中（有 .md，无 index.html，Coming Soon）

`agent-economy` · `agent-engineering-evolution` · `agent-infrastructure-war` · `ai-blackbox-measurement` · `ai-energy-tax` · `ai-enterprise-service-war` · `ai-governance-failure` · `ai-inference-democratization` · `ai-model-ideology` · `ai-scientist` · `ai-security-double-helix` · `anthropic-china-moment` · `capability-vs-compute` · `cloudflare-agents-week` · `google-cloud-next-2026` · `llm-tos` · `mse435` · `mythos` · `newjob-rentahuman` · `open-source-encirclement` · `openai-deployco` · `seat-to-compute` · `training-data-crisis`

### 4.3 特殊目录

| 目录 | 说明 |
|---|---|
| `anthropic/overview/` | Anthropic 公司全景系列（7 篇 .md，归档） |
| `labor-day-2026/l1-*/` `l2-*/` ... | 劳动五一系列子文章（.md，归档） |
| `silicon-valley-politicians/` | Karp 22 条信念（单页 HTML） |
| `edgecluster-arch/` | 边缘集群架构（单页 HTML） |
| `abap-bench/` | ABAP 基准测试（leaderboard） |
| `test-deploy/` | 测试用，忽略 |

---

## 5. 单篇文章资产结构

```
deepdive/<slug>/
├── index.html          # 主文章（Design System v2，必须）
├── index.meta.json     # 元数据（translate.yml 和 freshness 需要，必须）
├── index.en.html       # 英文版（translate.yml 自动生成）
├── <slug>-blog.md      # 配套博客 Markdown（可选）
├── images/ 或 screenshots/  # 图片资源（可选）
└── ...                 # 其他附属 HTML / MD
```

**index.meta.json 结构**：

```json
{
  "$schema": "../../config/meta.schema.json",
  "slug": "xxx",
  "title": { "zh": "中文标题" },
  "current_version": 1,
  "first_published": "YYYY-MM-DD",
  "last_updated": "YYYY-MM-DD",
  "freshness_priority": "cold",
  "next_check": "YYYY-MM-DD",
  "languages": ["zh"],
  "primary_language": "zh",
  "manual_only": false,
  "translation_provider_hint": "anthropic",
  "author": "冯小平",
  "version_log": [{ "v": 1, "date": "YYYY-MM-DD", "git": "PENDING", "summary": "..." }],
  "tags": [],
  "category": "分类标签"
}
```

`freshness_priority`: `hot`=7天复查 / `warm`=30天 / `cold`=90天

---

## 6. 设计系统 v2

所有文章必须：

```html
<html lang="zh-Hans" data-theme="amber">  <!-- 主题: red|amber|mint|signal -->
<link rel="stylesheet" href="../../colors_and_type.css">
<link rel="stylesheet" href="../../kit.css">             <!-- 如需要 -->
<script src="https://cdn.tailwindcss.com"></script>
<script src="../../mode-toggle.js" defer></script>
```

深浅色切换按钮（必须有）：

```html
<button data-toggle-mode aria-label="切换浅色/暗色">
  <span data-mode-icon>◐</span>
  <span data-mode-label>暗色</span>
</button>
```

主题色对应：`red`=紧迫/军事 · `signal`=警告 · `amber`=分析/历史（默认）· `mint`=研究/实验

---

## 7. 重定向规则（`_redirects`）

```
# 朔知测评 → Cloudflare Worker
/apps/shuozhi     https://shuozhi-web.fxp007.workers.dev  302
/apps/shuozhi/*   https://shuozhi-web.fxp007.workers.dev/:splat  302

# 旧路径迁移
/app/the-stall/*  /apps/distance/:splat  301
/app/*            /apps/:splat           301

# 旧博客路径
/blog/ai-buzzwords/*  /deepdive/:splat  301
```

---

## 8. 发布新文章流程（快速参考）

使用 `/deepdive-publish` skill（`~/.claude/skills/deepdive-publish/SKILL.md`）。

手动流程：

1. 准备 `index.html`（Design System v2，CSS 路径 `../../`）
2. `mkdir -p deepdive/<slug>/`
3. 写入 `index.html` + `index.meta.json`
4. 在 `deepdive/index.html` 的 `<!-- ENABLED -->` 区块插入新 `.group` 卡片
5. `git add deepdive/<slug>/ deepdive/index.html && git commit && git push origin main`

---

## 9. 相关 Repo

| Repo | 职责 | 部署目标 |
|---|---|---|
| `fxp/xiaopingfeng-site`（本 repo） | 主页 + DeepDive + Apps + Buzzwords | Cloudflare Pages → `xiaopingfeng.com/` |
| `fxp/shuozhi-web` | 朔知测评 Next.js app | Cloudflare Workers → `shuozhi-web.fxp007.workers.dev`（302 挂载到 `/apps/shuozhi/`） |

---

## 10. 注意事项

- **作者名**：冯小平（不是冯晓平）。发布前 `grep "冯[晓小]平"` 确认
- **作者/署名不出现**：智谱 / zhipu / GLM / Z.ai
- **引用必须有链接**：禁止裸域名（`wsj.com/`），CEO 引语必须可追溯
- **TL;DR 区块**：每篇文章 hero 之后 § 01 之前必须有内联 TL;DR，禁止创建独立 `*-tldr.md`
- **翻译**：commit 后 translate.yml 自动处理；如需 Claude 翻译（保留 AI persona）：手动 `gh workflow run translate.yml -f provider=anthropic`
