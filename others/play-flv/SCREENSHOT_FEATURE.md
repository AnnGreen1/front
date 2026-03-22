# 📸 截图功能说明

## ✅ 新增功能

前端可以调用接口通知后端截取当前帧并保存图片，并支持预览功能。

### 主要特性

1. **📸 截取画面** - 点击按钮即可截取当前直播画面
2. **💾 自动下载** - 截图成功后自动下载 JPG 图片
3. **🖼️ 查看截图** - 弹窗画廊查看所有历史截图
4. **🔍 预览功能** - 点击缩略图可查看大图预览
5. **🔄 实时刷新** - 支持手动刷新截图列表

## 🚀 使用方法

### 1. 启动后端服务

**重要提示：** 如果之前已经运行了后端服务，需要先停止再重新启动！

**Windows PowerShell:**
``powershell
# 停止所有 Node 进程（推荐）
Stop-Process -Name node -Force

# 或者使用任务管理器结束 node.exe 进程

# 然后重新启动
cd backend
npm start
```

成功启动后会显示：
```
🎬 流媒体服务器已启动
RTMP 端口：1935
HTTP-FLV 端口：8000
📷 截图服务已启动，端口：8001
截图接口：http://localhost:8001/api/screenshot
查看截图：http://localhost:8001/screenshots
```

### 2. 打开前端页面

在浏览器中打开 `front/index.html`

### 3. 开始播放

点击 "▶️ 开始播放" 按钮开始播放视频流

### 4. 截取画面

点击 "📸 截取画面" 按钮即可截取当前帧

**功能特点：**
- ✅ 按钮会显示 "📸 截图中..." 状态
- ✅ 截图成功后自动下载图片
- ✅ 图片格式为 JPG
- ✅ 文件名包含时间戳（如：`screenshot_1679234567890.jpg`）
- ✅ 截图保存在 `backend/screenshots/` 目录

### 5. 查看截图历史

点击 "🖼️ 查看截图" 按钮：
- 📋 以画廊形式展示所有截图
- 🔍 点击缩略图可预览大图
- 💾 支持从预览窗口下载图片
- 🔄 支持手动刷新列表

## 📁 文件保存位置

所有截图保存在：`backend/screenshots/` 目录

文件名格式：`screenshot_时间戳.jpg`

例如：`screenshot_1679234567890.jpg`

## 🔧 API 接口

### 截图接口

**请求：**
```http
POST http://localhost:8001/api/screenshot
Content-Type: application/json
```

**响应示例（成功）：**
```json
{
  "success": true,
  "message": "截图成功",
  "filename": "screenshot_1679234567890.jpg",
  "path": "/screenshots/screenshot_1679234567890.jpg",
  "fullPath": "E:\\Code\\front\\others\\play-flv\\backend\\screenshots\\screenshot_1679234567890.jpg"
}
```

**响应示例（失败）：**
```json
{
  "success": false,
  "message": "截图失败",
  "error": "错误详情..."
}
```

### 获取截图列表

**请求：**
```http
GET http://localhost:8001/screenshots
```

**响应示例：**
```json
[
  "screenshot_1679234567890.jpg",
  "screenshot_1679234567891.jpg",
  "screenshot_1679234567892.jpg"
]
```

## 💡 技术实现

### 后端实现

使用 FFmpeg 从 RTMP 流中截取单帧：

```javascript
const ffmpegArgs = [
  '-y',                                    // 覆盖输出文件
  '-rtmp_live', 'live',                   // 直播流模式
  '-i', 'rtmp://localhost/live/stream',   // 输入流地址
  '-frames:v', '1',                       // 只截取 1 帧
  '-q:v', '2',                            // 图片质量 (2-31，越小质量越高)
  '-f', 'image2',                         // 输出格式为图片
  outputPath                              // 输出文件路径
];
```

### 前端实现

通过 Fetch API 调用后端接口：

```javascript
fetch('http://localhost:8001/api/screenshot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // 自动下载截图
    const link = document.createElement('a');
    link.href = `http://localhost:8001/screenshots/${data.filename}`;
    link.download = data.filename;
    link.click();
  }
});
```

## ⚙️ 配置选项

### 修改截图质量

编辑 `backend/server.js`，找到这行：

```javascript
'-q:v', '2',  // 图片质量 (2-31，越小质量越高)
```

- `1-3`: 高质量，文件较大
- `4-10`: 中等质量，文件适中
- `11-31`: 低质量，文件较小

推荐值：`2-5`

### 修改截图超时时间

编辑 `backend/server.js`，找到：

```javascript
setTimeout(() => {
  // ... 超时处理代码
}, 10000); // 10 秒超时
```

可以根据网络情况调整超时时间。

## 🔍 故障排查

### ❌ 截图失败："I/O error"

**可能原因：**
- RTMP 推流未开始
- 流地址不正确
- FFmpeg 未安装

**解决方案：**
1. 确保已经点击"开始播放"按钮
2. 检查后端日志，确认推流正常
3. 验证 FFmpeg 安装：`ffmpeg -version`

### ❌ 截图失败："Connection refused"

**可能原因：**
- 截图服务未启动
- 端口 8001 被占用

**解决方案：**
1. 重启后端服务
2. 查看启动日志，确认截图服务正常运行
3. 检查端口占用：`netstat -ano | findstr :8001`

### ❌ 前端无法调用接口

**检查项：**
- ✅ 后端服务是否运行
- ✅ 端口 8001 是否可访问
- ✅ 浏览器控制台是否有 CORS 错误
- ✅ 防火墙设置

## 📊 性能影响

- **CPU**: 截图时会有短暂的 CPU 使用率上升（约 5-10%）
- **内存**: 几乎无影响
- **推流**: 不影响正常推流和播放
- **延迟**: 单次截图约需 1-3 秒

## 🎯 使用场景

- 📸 直播画面抓拍
- 📸 视频会议截图
- 📸 监控画面保存
- 📸 教学演示截图
- 📸 产品展示抓拍

## 🔒 安全考虑

### 生产环境建议：

1. **添加认证**
```javascript
// 在截图接口中添加 token 验证
const token = req.headers['authorization'];
if (!token || !validateToken(token)) {
  return res.status(401).json({ error: '未授权' });
}
```

2. **限制截图频率**
```javascript
// 添加限流逻辑，防止恶意调用
let lastScreenshotTime = 0;
const screenshotInterval = 1000; // 最少间隔 1 秒

if (Date.now() - lastScreenshotTime < screenshotInterval) {
  return res.status(429).json({ error: '请求过于频繁' });
}
```

3. **文件清理**
```javascript
// 定期清理旧截图
setInterval(() => {
  const dir = path.join(__dirname, 'screenshots');
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      // 删除超过 24 小时的文件
      if (Date.now() - stats.mtimeMs > 24 * 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
      }
    });
  });
}, 60 * 60 * 1000); // 每小时检查一次
```

## 📝 更新日志

### v1.0.0 - 2024-03-19
- ✅ 新增后端截图 API 接口
- ✅ 新增前端截图按钮
- ✅ 支持自动下载截图
- ✅ 支持查看截图列表
- ✅ 完整的错误处理

---

**祝你使用愉快！** 🎉

如有问题，请查看主项目的 README.md 或提 Issue。