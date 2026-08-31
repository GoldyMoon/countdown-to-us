# Countdown to Us

一个自动推进的情侣倒计时静态网页。

## 替换素材

### 宝宝头像
直接替换：

`assets/baby-avatar.svg`

也可以改成 jpg/png，只需要同步修改 `index.html` 与 `css/styles.css` 中的文件名。

### 照片墙
当前占位素材：

- `assets/photos/photo-01.svg`
- `assets/photos/photo-02.svg`
- ...
- `assets/photos/photo-06.svg`

你可以直接用自己的图片覆盖这些文件，或者在 `js/app.js` 的 `photos` 数组里修改路径和 caption。

## 本地预览

```bash
python3 -m http.server 8000
```

打开：

`http://localhost:8000`

## GitHub Pages

Push 到 `main` 后，在 GitHub：

`Settings → Pages → Source: GitHub Actions`

仓库里已经包含静态站点 workflow。
