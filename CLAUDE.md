# xiaopingfeng-site · 操作手册

主站 `xiaopingfeng.com` 的源码和部署文档。

> **仓库**: `github.com/fxp/xiaopingfeng-site`
> **部署**: GitHub Actions → Cloudflare Pages → `xiaopingfeng.com`

---

## 1. 站点结构

```
xiaopingfeng.com/             主页（导航枢纽）
xiaopingfeng.com/deepdive/    AI Buzzwords DeepDive 深潜文章（由 Cloudflare Worker 代理，源码在 AI-Buzzwords repo）
xiaopingfeng.com/buzzwords/   Episode 周报目录（每周五分享会记录）
xiaopingfeng.com/buzzwords/85/ 具体一期（EP.85）
xiaopingfeng.com/apps/        在线工具目录
xiaopingfeng.com/apps/distance/ 距离测试
```

**注意**：`/deepdive/` 不在本 repo，由 Cloudflare Worker 处理（源码在 `~/Code/AI-Buzzwords/`）。本 repo 只负责 `/`、`/buzzwords/`、`/apps/`。

---

## 2. 部署方式

```
git push origin main
        │
        ▼
GitHub Actions (.github/workflows/deploy.yml)
        │
        ▼ npx wrangler pages deploy
Cloudflare Pages (project: xiaopingfeng-site)
        │
        ▼
xiaopingfeng.com/
```

**必要的 GitHub Secrets**（Settings → Secrets → Actions）：

| Secret | 说明 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token，需有 Account → Cloudflare Pages → Edit 权限 |
| `CLOUDFLARE_ACCOUNT_ID` | `0356d59ccdcff356bf3bbdb580bbaa60` |

---

## 3. Repo 结构

```
xiaopingfeng-site/
├── CLAUDE.md                     # 本文件
├── index.html                    # 主页
├── _redirects                    # Cloudflare Pages 重定向规则
├── buzzwords/
│   ├── index.html                # Episode 目录（JS 从 data/index.json 加载）
│   └── data/
│       └── index.json            # 所有 Episode 元数据（手动维护）
├── apps/
│   ├── index.html                # 应用目录
│   └── distance/                 # 距离测试（心理测量 app）
│       └── index.html
└── .github/
    └── workflows/
        └── deploy.yml            # 自动部署
```

---

## 4. 添加新 Episode（每周分享）

每期维护一条 JSON，存在 `buzzwords/data/index.json`：

```json
[
  {
    "ep": 85,
    "date": "2026-05-15",
    "title": "本期主题简介",
    "oneliner": "一句话总结（120字以内）"
  }
]
```

**流程**：
1. 编辑 `buzzwords/data/index.json`，在数组开头加新 Episode 对象
2. 如需要独立页面（含完整 TLDR + 视频链接）：创建 `buzzwords/<ep号>/index.html`
3. `git add . && git commit -m "add: EP.<n> buzzwords entry" && git push`
4. GitHub Actions 自动部署，约 30 秒生效

Episode 目录页（`buzzwords/index.html`）会自动读取 JSON 渲染列表，无需改 HTML。

---

## 5. 添加新 App

**纯前端 App**（HTML/JS，无需后端）：
1. 在 `apps/<slug>/` 下创建 `index.html`
2. 在 `apps/index.html` 里加一个 `.app-card` 链接到 `/apps/<slug>/`
3. Push → 自动部署

**需要后端的 App**：
- 单独建 repo `fxp/app-<slug>`
- Cloudflare Workers（API 逻辑）+ D1（数据库）+ R2（文件存储）
- 路由通过 Worker 处理 `/apps/<slug>/*`，或单独绑定子域

Cloudflare 生态可以覆盖大多数场景：

| 需求 | 方案 |
|---|---|
| API 逻辑 | Cloudflare Workers（JS/TS） |
| 关系型数据 | Cloudflare D1（SQLite） |
| KV 存储 | Cloudflare KV |
| 文件/媒体 | Cloudflare R2 |
| 定时任务 | Workers Cron Triggers |

---

## 6. 重定向规则（`_redirects`）

Cloudflare Pages 原生支持 `_redirects` 文件：

```
/app/the-stall/*  /apps/distance/:splat  301
/app/*            /apps/:splat           301
```

格式：`<源路径>  <目标路径>  <状态码>`。Worker 路由优先级高于 Pages，所以 `/deepdive/*` 和 `/blog/ai-buzzwords/*` 不受此文件影响（由 Worker 处理）。

---

## 7. 相关 Repo

| Repo | 职责 | 部署目标 |
|---|---|---|
| `fxp/xiaopingfeng-site`（本 repo） | 主页 + Buzzwords + Apps | Cloudflare Pages → `xiaopingfeng.com/` |
| `fxp/AI-Buzzwords` | DeepDive 深潜文章 | GitHub Pages → `fxp.github.io/AI-Buzzwords/`（Worker 代理为 `xiaopingfeng.com/deepdive/`） |
| `fxp/roam` | 问野 · AI 自主空间 | Cloudflare Pages → `roam.xiaopingfeng.com` |

`/deepdive/` 的路由逻辑在 `AI-Buzzwords/worker.js`，操作手册在 `~/Code/AI-Buzzwords/CLAUDE.md`。

`roam.xiaopingfeng.com` 独立部署，操作手册在 `~/Code/roam/CLAUDE.md`。
