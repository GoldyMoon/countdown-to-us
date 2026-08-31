# 💗 Baby Countdown

一个轻量、无依赖的静态倒计时网页，用来展示从 2026 年 8 月 31 日到 12 月 17 日之间的 remote / 见面安排。

## 功能

- 自动根据当前日期推进总进度条
- 自动显示距离 12 月 17 日还剩多少天
- 自动把「目前在这里」移动到当天所在阶段
- 已经过的阶段会自动淡化
- 使用 `America/Indiana/Indianapolis` 时区计算日期
- 手机和桌面端自适应
- 无框架、无 npm 依赖，直接打开 `index.html` 即可

## 项目结构

```text
baby-countdown-repo/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── .github/
│   └── workflows/
│       └── pages.yml
├── .gitignore
├── LICENSE
└── README.md
```

## 本地运行

最简单的方法：直接双击 `index.html`。

也可以启动一个本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 修改日期

所有时间安排都集中在 `js/app.js` 顶部的 `schedule` 数组中。

例如：

```js
{
  type: "together",
  badge: "见面<br>5.5 天",
  title: "9 月 25 日 — 9 月 30 日",
  description: "5 天 + 1 晚，好好充电一下 ✨",
  start: "2026-09-25",
  end: "2026-09-30",
}
```

总进度的起止日期由：

```js
const START_DATE = "2026-08-31";
const END_DATE = "2026-12-17";
```

控制。

## GitHub Pages

仓库已经包含 GitHub Pages workflow。

1. 新建 GitHub repository。
2. 把本项目全部文件 push 上去。
3. 在 GitHub 仓库中进入 **Settings → Pages**。
4. Source 选择 **GitHub Actions**。
5. push 到 `main` 后，GitHub 会自动部署。

## License

MIT
