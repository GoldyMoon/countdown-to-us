# Countdown to Us + Desktop Pet

这一版是在现有网页 repo 上**直接附加桌宠功能**，不是把原网页换成另一套代码。

## 结构

```text
countdown-to-us/
├── index.html                 # 现有网页，GitHub Pages 继续用它
├── css/styles.css
├── js/app.js                  # 11 张照片 + 当前滚动逻辑
├── assets/
│   ├── baby-avatar.jpg        # placeholder，替换它即可同时更新网页/桌宠
│   ├── icon.png
│   └── photos/
│       ├── photo-01.jpg
│       ├── ...
│       └── photo-11.jpg       # 全部为 placeholder
├── electron/
│   ├── main.js
│   └── preload.js
├── pet/
│   ├── pet.html
│   ├── pet.css
│   └── pet.js
├── package.json
└── .github/workflows/static.yml
```

## 网页部署

和之前完全一样：

```bash
git add .
git commit -m "Add desktop pet"
git push
```

GitHub Pages 仍然部署根目录的 `index.html`。

## 运行桌宠

先安装 Node.js，然后在 repo 根目录：

```bash
npm install
npm start
```

桌宠功能：

- 透明悬浮窗口
- Always on top
- 可拖动
- 单击宝宝：弹出倒计时 + 冒爱心
- 双击宝宝：打开**同一个根目录网页 Dashboard**
- 晚上自动显示 `Zzz`
- 自动显示下次见面还有几天
- 见面期间自动显示“现在就在一起”
- 12 月 17 日自动切换庆祝状态

## 打包 Mac App

```bash
npm run dist:mac
```

输出在 `dist/`。

## 替换真实素材

头像：直接覆盖：

```text
assets/baby-avatar.jpg
```

11 张照片：直接覆盖：

```text
assets/photos/photo-01.jpg
...
assets/photos/photo-11.jpg
```

只要文件名不变，不需要改任何代码。

## 当前照片墙代码

保留了你现在这版逻辑：

- `length: 11`
- JPG
- 自动循环滚动
- `80 px/s`
- 鼠标移入暂停
- 鼠标移出继续
- 左右按钮
- 点击放大
