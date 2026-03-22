# 🎬 FLV 直播流完整方案

基于 **node-media-server** 和 **flvjs** 实现的完整直播流解决方案，可以将计算机摄像头转换为 FLV 流并在前端播放。

## ✨ 最新功能

### 📸 实时截图（新增）
- ✅ 前端一键截取当前帧
- ✅ 自动下载保存为 JPG 格式
- ✅ 支持查看历史截图列表
- ✅ 高质量图片输出

详细说明请查看：[📸 截图功能说明](./SCREENSHOT_FEATURE.md)

## 📁 项目结构

```
play-flv/
├── backend/          # 后端服务
│   ├── server.js    # 服务器主文件
│   ├── package.json # 依赖配置
│   └── README.md    # 后端文档
├── front/           # 前端页面
│   ├── index.html   # 播放器页面
│   └── README.md    # 前端文档
└── README.md        # 本文件
```

## 🚀 快速开始

### 步骤 1：安装 FFmpeg

**Windows 系统：**

```bash
# 方法 1: 使用 winget (推荐)
winget install Gyan.FFmpeg

# 方法 2: 使用 chocolatey
choco install ffmpeg

# 方法 3: 手动安装
# 1. 访问 https://www.gyan.dev/ffmpeg/builds/
# 2. 下载 ffmpeg-release-full.zip
# 3. 解压并将 bin 目录添加到系统 PATH 环境变量
```

**验证安装：**
```bash
ffmpeg -version
```

### 步骤 2：启动后端服务

```bash
cd backend

# 安装依赖
npm install

# 启动服务
npm start
```

**成功标志：**
```
🎬 流媒体服务器已启动
RTMP 端口：1935
HTTP-FLV 端口：8000
推流地址：rtmp://localhost/live/stream
播放地址：http://localhost:8000/live/stream.flv
📹 启动 FFmpeg 推流...
✅ 推流已开始！
```

### 步骤 3：打开前端页面

**方法 1：直接打开**
```bash
# 双击打开 front/index.html
# 或在浏览器中拖入该文件
```

**方法 2：使用本地服务器（推荐）**
```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js
npx http-server -p 8080

# 然后访问 http://localhost:8080
```

### 步骤 4：开始播放

1. 点击"▶️ 开始播放"按钮
2. 等待连接成功
3. 享受实时直播画面！

## 🎯 核心原理

```
┌─────────────┐     RTMP      ┌──────────────┐    HTTP-FLV    ┌─────────────┐
│  摄像头     │ ────────────> │  node-media  │ ────────────>  │  浏览器     │
│  (FFmpeg)   │   推流        │   -server    │    拉流        │  (flvjs)    │
└─────────────┘               └──────────────┘                └─────────────┘
```

### 工作流程：

1. **FFmpeg** 捕获摄像头画面并编码为 H.264
2. **FFmpeg** 将编码后的视频以 FLV 格式推送到 RTMP 服务器
3. **node-media-server** 接收推流并提供 HTTP-FLV 拉流服务
4. **flvjs** 通过 HTTP 拉取 FLV 流并在浏览器中播放

## ⚙️ 配置说明

### 后端配置

**修改服务器端口** (`backend/server.js`):

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

**修改摄像头设备** (`backend/server.js`):

```javascript
// Windows - 查看可用设备
ffmpeg -list_devices true -f dshow -i dummy

// 找到你的摄像头名称，例如 "Integrated Camera"
'-i', 'video=Integrated Camera'

// 常见设备名称示例：
'-i', 'video=HD Pro Webcam C920'  // 罗技 C920
'-i', 'video=OBS Virtual Video'   // OBS 虚拟摄像头
```

**调整视频质量** (`backend/server.js`):

```javascript
const ffmpegArgs = [
  '-f', 'dshow',
  '-i', 'video=Integrated Camera',
  '-vf', 'scale=1280:720',  // 修改分辨率
  '-r', '30',               // 帧率
  '-b:v', '2500k',          // 视频码率
  '-vcodec', 'libx264',
  '-preset', 'ultrafast',
  '-tune', 'zerolatency',
  '-pix_fmt', 'yuv420p',
  '-g', '60',
  '-f', 'flv',
  'rtmp://localhost/live/stream'
];
```

### 前端配置

**修改流地址** (`front/index.html`):

```javascript
data() {
  return {
    streamUrl: 'http://your-server-ip:8000/live/stream.flv'
  };
}
```

**播放器优化配置**:

```javascript
this.player = flvjs.createPlayer({
  type: 'flv',
  url: this.streamUrl,
  isLive: true,              // 直播模式
  autoplay: true,            // 自动播放
  enableStableBuffer: true,  // 稳定缓冲
  lazyLoadMaxDuration: 3 * 60, // 最大缓冲时长 (秒)
  lazyLoadTimeout: 10000,    // 懒加载超时 (毫秒)
  hasAudio: false,           // 如果只需要视频
});
```

## 🔧 故障排查

### 1. FFmpeg 未找到

**错误信息**: `'ffmpeg' 不是内部或外部命令`

**解决方案**:
- 重新安装 FFmpeg
- 确保添加到系统 PATH
- 重启终端/命令行工具

### 2. 摄像头无法访问

**可能原因**:
- 摄像头被其他程序占用
- 权限不足
- 设备名称错误

**解决方案**:
```bash
# 查看摄像头是否被占用
# Windows: 任务管理器 -> 详细信息 -> 结束占用摄像头的进程

# 列出所有视频设备
ffmpeg -list_devices true -f dshow -i dummy

# 使用正确的设备名称
'-i', 'video=你的摄像头准确名称'
```

### 3. 端口被占用

**错误信息**: `Port 1935 is already in use`

**解决方案**:
```bash
# Windows - 查看占用端口的进程
netstat -ano | findstr :1935
taskkill /PID <进程 ID> /F

# 或修改配置文件使用其他端口
```

### 4. 前端无法连接

**检查清单**:
- [ ] 后端服务是否运行
- [ ] 防火墙是否阻止端口
- [ ] 流地址是否正确
- [ ] 浏览器控制台是否有 CORS 错误

**解决方案**:
```javascript
// 确保后端配置允许跨域
const config = {
  http: {
    allow_origin: '*'
  }
};
```

### 5. 播放卡顿

**优化建议**:
```javascript
// 降低 FFmpeg 推流参数
'-vf', 'scale=640:480',     // 降低分辨率
'-r', '24',                 // 降低帧率
'-b:v', '1000k',            // 降低码率

// 调整前端缓冲
lazyLoadMaxDuration: 60,    // 减少缓冲时长
```

## 🌐 网络部署

### 局域网访问

**后端服务器配置**:
```javascript
const config = {
  http: {
    allow_origin: '*',  // 允许所有来源
  }
};
```

**获取服务器 IP**:
```bash
# Windows
ipconfig

# 查找 IPv4 地址，例如 192.168.1.100
```

**前端配置**:
```javascript
streamUrl: 'http://192.168.1.100:8000/live/stream.flv'
```

**防火墙设置**:
```bash
# Windows - 允许端口通过防火墙
netsh advfirewall firewall add rule name="RTMP" dir=in action=allow protocol=TCP localport=1935
netsh advfirewall firewall add rule name="HTTP-FLV" dir=in action=allow protocol=TCP localport=8000
```

### 公网部署

**需要配置**:
1. 服务器公网 IP 或域名
2. 端口转发/映射
3. SSL 证书 (可选，用于 HTTPS)
4. CDN 加速 (可选)

**Nginx 反向代理示例**:
```nginx
location /live {
    proxy_pass http://localhost:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

## 📊 性能调优

### 降低延迟

**FFmpeg 参数优化**:
```javascript
'-preset', 'ultrafast',     // 最快编码速度
'-tune', 'zerolatency',    // 零延迟调优
'-g', '30',                // 更小的 GOP
```

**前端配置优化**:
```javascript
isLive: true,              // 启用直播模式
enableStableBuffer: false, // 禁用稳定缓冲 (更低延迟)
```

### 提高画质

```javascript
'-vf', 'scale=1920:1080',  // 1080p 分辨率
'-r', '60',                // 60fps 高帧率
'-b:v', '5000k',           // 更高码率
'-crf', '18',              // 高质量 (范围 0-51, 越小越好)
```

### 节省带宽

```javascript
'-vf', 'scale=640:480',    // 较低分辨率
'-r', '15',                // 较低帧率
'-b:v', '800k',            // 较低码率
'-c:a', 'aac',             // AAC 音频
'-b:a', '64k',             // 低音频码率
```

## 🛠️ 扩展功能

### 添加音频录制

```javascript
// 修改 FFmpeg 参数同时录制视频和音频
const ffmpegArgs = [
  '-f', 'dshow',
  '-i', `video=${videoDevice}:audio=${audioDevice}`,
  // ... 其他参数
];
```

### 多路推流

```javascript
// 创建多个 FFmpeg 进程推送到不同房间
const streams = [
  { input: 'camera1', output: 'rtmp://localhost/live/stream1' },
  { input: 'camera2', output: 'rtmp://localhost/live/stream2' },
];
```

### 录制保存

```javascript
// FFmpeg 同时推流和录制
'-f', 'flv',
'rtmp://localhost/live/stream',
'-f', 'segment',
'-segment_time', '3600',
'recordings/%Y%m%d_%H%M%S.flv'
```

## 📱 移动端支持

flvjs 在移动端的支持有限，可以考虑：

1. **使用 HLS**: node-media-server 也支持 HLS
2. **转码服务**: 后端转码为 MP4 片段
3. **第三方播放器**: 
   - iOS: AVPlayer
   - Android: ExoPlayer

## 🔒 安全考虑

### 推流认证

```javascript
// backend/server.js
nms.on('prePublish', (id, StreamPath, args) => {
  const authKey = args.token; // 从 URL 获取 token
  if (authKey !== 'your_secret_key') {
    console.log('认证失败');
    return false; // 拒绝推流
  }
});
```

### 播放鉴权

```javascript
// 添加 token 验证
streamUrl: 'http://localhost:8000/live/stream.flv?token=abc123'
```

### HTTPS 配置

使用 Nginx 反向代理并配置 SSL:

```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location /live {
        proxy_pass http://localhost:8000;
    }
}
```

## 📚 技术参考

### 相关资源

- [node-media-server GitHub](https://github.com/illuspas/Node-Media-Server)
- [flv.js GitHub](https://github.com/bilibili/flv.js)
- [FFmpeg 官方文档](https://ffmpeg.org/documentation.html)

### 常见问题 FAQ

详见各子目录的 README.md 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**祝你使用愉快！** 🎉

如有问题，请查看各子目录的详细文档或提 Issue。
