# FLV 直播流后端

基于 Node.js和 node-media-server 实现的 FLV 直播流服务器，可以将摄像头画面转换为 FLV 流。

## 功能特性

- 🎬 内置 RTMP + HTTP-FLV 流媒体服务器
- 📹 自动捕获系统摄像头并推流
- ⚡ 低延迟直播流
- 🔧 支持自定义摄像头设备和推流参数

## 环境要求

- Node.js >= 14.0.0
- FFmpeg（必须安装到系统 PATH）

### 安装 FFmpeg

**Windows:**
```bash
# 使用 winget
winget install Gyan.FFmpeg

# 或使用 chocolatey
choco install ffmpeg

# 或手动安装：
# 1. 访问 https://www.gyan.dev/ffmpeg/builds/
# 2. 下载 release-full.zip
# 3. 解压并将 bin 目录添加到系统 PATH
```

## 安装步骤

1. 安装依赖
```bash
npm install
```

2. 启动服务器
```bash
npm start
```

3. 查看可用的摄像头设备

启动后会自动列出所有 DirectShow 视频设备。如果需要指定特定摄像头，请修改 `server.js` 中的设备名称：

```javascript
'-i', 'video=你的摄像头名称'
```

常见摄像头名称示例：
- `video=Integrated Camera` (笔记本内置摄像头)
- `video=HD Pro Webcam C920` (罗技摄像头)
- `video=OBS Virtual Video` (虚拟摄像头)

## 访问地址

- **播放地址**: http://localhost:8000/live/stream.flv
- **前端页面**: 打开 `../front/index.html`

## 配置说明

### 端口配置

在 `server.js` 中修改：

```javascript
const config = {
  rtmp: {
    port: 1935,  // RTMP 推流端口
  },
  http: {
    port: 8000,  // HTTP-FLV 播放端口
  }
};
```

### FFmpeg 推流参数

可以调整视频质量、帧率等：

```javascript
const ffmpegArgs = [
  '-f', 'dshow',                    // 输入格式 (Windows 用 dshow，Mac 用 avfoundation)
  '-i', 'video=Integrated Camera',  // 输入设备
  '-vf', 'scale=640:480',          // 分辨率
  '-r', '30',                       // 帧率
  '-vcodec', 'libx264',            // 编码器
  '-preset', 'ultrafast',          // 编码速度
  '-tune', 'zerolatency',          // 零延迟优化
  '-pix_fmt', 'yuv420p',           // 像素格式
  '-g', '60',                       // GOP 大小
  '-f', 'flv',                      // 输出格式
  'rtmp://localhost/live/stream'   // 推流地址
];
```

## 常见问题

### 1. 找不到摄像头设备

确保摄像头已连接并被系统识别，可以通过以下方式检查：
- Windows: 设备管理器 -> 图像设备
- 运行 `ffmpeg -list_devices true -f dshow -i dummy` 查看设备列表

### 2. FFmpeg 命令未找到

确保 FFmpeg 已正确安装并添加到系统 PATH。

### 3. 推流失败

- 检查端口 1935 和 8000 是否被占用
- 确认防火墙允许这些端口
- 检查摄像头是否被其他程序占用

## 跨平台支持

### macOS

修改 `server.js` 中的输入设备：

```javascript
// macOS 使用 avfoundation
const ffmpegArgs = [
  '-f', 'avfoundation',
  '-i', '0:0',  // 视频设备 0: 音频设备 0
  // ... 其他参数保持不变
];
```

### Linux

```javascript
// Linux 使用 v4l2
const ffmpegArgs = [
  '-f', 'v4l2',
  '-i', '/dev/video0',
  // ... 其他参数保持不变
];
```

## 技术栈

- **node-media-server**: Node.js 实现的 RTMP/HTTP-FLV 服务器
- **FFmpeg**: 强大的音视频处理工具
- **child_process**: Node.js 原生模块，用于执行 FFmpeg
