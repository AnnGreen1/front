# 🎬 FLV 直播流 - 完整实现方案

## ✅ 已完成功能

### 后端 (Backend)
- ✅ RTMP + HTTP-FLV 流媒体服务器
- ✅ FFmpeg 摄像头捕获推流
- ✅ 自动设备检测
- ✅ 实时日志输出
- ✅ 优雅关闭处理
- ✅ Windows 快速启动脚本

### 前端 (Frontend)
- ✅ Vue.js 2.7 响应式界面
- ✅ flvjs FLV 播放器
- ✅ CDN 方式引入（无需构建）
- ✅ 实时统计信息
- ✅ 播放控制功能
- ✅ 日志记录系统
- ✅ 现代化 UI 设计

## 📁 项目文件清单

```
play-flv/
│
├── 📘 README.md              # 项目总览和使用指南
├── 📘 QUICKSTART.md          # 快速开始指南
├── 📘 ARCHITECTURE.md        # 技术架构详解
│
├── backend/                  # 后端服务
│   ├── server.js            # 主服务器文件
│   ├── package.json         # 依赖配置
│   ├── start.bat            # Windows 启动脚本
│   └── README.md            # 后端文档
│
└── front/                    # 前端页面
    ├── index.html           # 播放器页面
    └── README.md            # 前端文档
```

## 🚀 5 分钟快速上手

### 步骤 1: 安装 FFmpeg

打开 PowerShell，执行：
```powershell
winget install Gyan.FFmpeg
```

等待安装完成（约 2 分钟）。

### 步骤 2: 启动后端

双击 `backend\start.bat`

看到以下提示表示成功：
```
✅ 推流已开始！
📺 前端访问：http://localhost:8000/live/stream.flv
```

### 步骤 3: 打开前端

直接在浏览器中打开 `front\index.html`

或双击该文件。

### 步骤 4: 开始播放

点击 **"▶️ 开始播放"** 按钮

等待几秒后即可看到摄像头画面！🎉

## 💡 核心原理

```
┌─────────────┐     RTMP      ┌──────────────┐    HTTP-FLV    ┌─────────────┐
│  摄像头     │ ────────────> │  node-media  │ ────────────>  │  浏览器     │
│  (FFmpeg)   │   推流        │   -server    │    拉流        │  (flvjs)    │
└─────────────┘               └──────────────┘                └─────────────┘
```

**简单说就是：**
1. FFmpeg 把摄像头变成视频流
2. Node.js 服务器接收并转发
3. 浏览器用 flvjs 播放

## ⚙️ 常用配置

### 修改摄像头

1. 查看可用设备：
```bash
ffmpeg -list_devices true -f dshow -i dummy
```

2. 找到你的摄像头名称

3. 编辑 `backend\server.js` 第 62 行：
```javascript
'-i', 'video=你的摄像头名称',
```

### 修改视频质量

编辑 `backend\server.js` 第 63-65 行：

```javascript
'-vf', 'scale=1280:720',  // 分辨率：640x480, 1280x720, 1920x1080
'-r', '30',               // 帧率：15, 24, 30, 60
'-b:v', '2500k',          // 码率：数字越大越清晰
```

### 修改端口

编辑 `backend\server.js` 第 8-13 行：

```javascript
rtmp: { port: 1935 },   // RTMP 推流端口
http: { port: 8000 },   // HTTP-FLV 播放端口
```

## 🔧 故障排查

### ❌ "找不到 FFmpeg"

**解决：**
```bash
# 重新安装
winget install Gyan.FFmpeg

# 重启电脑（如果还不行）
```

### ❌ "端口被占用"

**解决：**
```bash
# 查找占用端口的进程
netstat -ano | findstr :1935

# 结束进程
taskkill /PID <数字> /F
```

### ❌ "摄像头无法访问"

**解决：**
1. 关闭所有使用摄像头的程序（微信、Zoom 等）
2. Windows 设置 → 隐私 → 摄像头 → 允许访问

### ❌ "前端无法连接"

**检查：**
- [ ] 后端是否运行
- [ ] 防火墙是否阻止
- [ ] 浏览器地址是否正确

## 📊 性能对比

| 配置 | 延迟 | 带宽 | 适用场景 |
|------|------|------|---------|
| 640x480 @ 15fps | ~300ms | ~500KB/s | 网络监控 |
| 1280x720 @ 30fps | ~400ms | ~1.5MB/s | 视频会议 |
| 1920x1080 @ 60fps | ~600ms | ~4MB/s | 高清直播 |

## 🌟 扩展功能

### 添加音频

编辑 `backend\server.js`，在 FFmpeg 参数中添加：

```javascript
// 找到音频设备
ffmpeg -list_devices true -f dshow -i dummy

// 修改输入参数
'-i', 'video=摄像头名称:audio=麦克风名称',
'-c:a', 'aac',
'-b:a', '128k',
```

### 录制视频

添加 FFmpeg 参数：

```javascript
// 同时推流和录制
'rtmp://localhost/live/stream',
'-f', 'segment',
'-segment_time', '3600',
'recordings/%Y%m%d_%H%M%S.flv'
```

### 局域网访问

1. 获取本机 IP：
```bash
ipconfig  # 找到 IPv4 地址
```

2. 前端修改流地址：
```javascript
streamUrl: 'http://192.168.1.100:8000/live/stream.flv'
```

3. 关闭防火墙或添加规则

## 📱 移动端支持

flvjs 在移动端支持有限，建议：

- iOS: 使用 HLS 格式
- Android: 使用 ExoPlayer
- 跨平台：考虑 WebSocket + FLV

## 🔒 安全建议

### 生产环境必做：

1. **添加认证**
```javascript
// server.js
nms.on('prePublish', (id, StreamPath, args) => {
  if (args.token !== 'your_secret_token') {
    return false;
  }
});
```

2. **使用 HTTPS**
```bash
# 使用 Nginx 反向代理
# 配置 SSL 证书
```

3. **限制访问**
```javascript
http: {
  allow_origin: 'https://yourdomain.com'
}
```

## 📚 学习资源

- [FFmpeg 官方文档](https://ffmpeg.org/documentation.html)
- [node-media-server GitHub](https://github.com/illuspas/Node-Media-Server)
- [flv.js GitHub](https://github.com/bilibili/flv.js)
- [Vue.js 官方文档](https://vuejs.org/)

## 🤝 下一步建议

1. ✅ 先跑通基础功能
2. 🔧 调整参数优化效果
3. 🎨 自定义 UI 样式
4. 🔐 添加认证系统
5. 📹 尝试多路推流
6. 🌐 部署到云服务器

## 💬 常见问题

**Q: 可以在外网访问吗？**  
A: 可以，需要：
- 服务器有公网 IP
- 配置端口转发
- 建议使用域名 + SSL

**Q: 支持多少人同时观看？**  
A: 取决于：
- 服务器带宽
- 视频码率
- CDN 加速

单台普通服务器可支持 100-500 人同时观看。

**Q: 延迟能更低吗？**  
A: 可以优化到 200-300ms：
- 使用 ultrafast preset
- 禁用 GOP cache
- 减少缓冲配置

**Q: 能保存录像吗？**  
A: 可以，参考上面的"录制视频"部分。

---

## 🎉 开始使用吧！

现在你已经了解了所有必要的信息，开始你的 FLV 直播之旅吧！

如有问题，请查看：
- 📖 [QUICKSTART.md](./QUICKSTART.md) - 详细步骤
- 📖 [README.md](./README.md) - 完整文档
- 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - 技术详解

**祝你编码愉快！** 🚀
