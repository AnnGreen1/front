# 📦 项目架构说明

## 技术架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      FLV 直播流系统                           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│   Backend 后端    │                    │   Frontend 前端   │
│                  │                    │                  │
│  ┌────────────┐  │                    │  ┌────────────┐  │
│  │  摄像头     │  │                    │  │  Vue.js    │  │
│  │  (硬件)    │  │                    │  │  (UI 框架)  │  │
│  └─────┬──────┘  │                    │  └─────┬──────┘  │
│        │         │                    │          │       │
│        ▼         │                    │          ▼       │
│  ┌────────────┐  │                    │  ┌────────────┐  │
│  │  FFmpeg    │  │                    │  │  flvjs     │  │
│  │  (编码推流)│  │                    │  │  (播放器)  │  │
│  └─────┬──────┘  │                    │  └─────┬──────┘  │
│        │         │                    │          │       │
│        ▼         │                    │          │       │
│  ┌────────────┐  │      RTMP/HTTP    │  ┌────────────┐  │
│  │node-media- │◄─┼───────────────────┼─►│  浏览器    │  │
│  │  server    │  │     HTTP-FLV      │  │  (显示)    │  │
│  └────────────┘  │                    │  └────────────┘  │
└──────────────────┘                    └──────────────────┘
```

## 数据流图

```
摄像头画面
    │
    ▼
[FFmpeg 捕获]
    │
    ├─> H.264 视频编码
    ├─> AAC 音频编码 (可选)
    └─> FLV 封装
            │
            ▼
       [RTMP 推流]
       localhost:1935
            │
            ▼
   [node-media-server]
   - 接收 RTMP 流
   - 转换为 HTTP-FLV
   - 提供拉流服务
            │
            ▼
      [HTTP-FLV 拉流]
      localhost:8000
            │
            ▼
       [flvjs 播放]
       - 解析 FLV 容器
       - 解码 H.264/AAC
       - Web API 渲染
            │
            ▼
       用户看到画面
```

## 目录结构详解

```
play-flv/
│
├── backend/                      # 后端服务目录
│   ├── server.js                # 主服务器文件
│   │   ├── NodeMediaServer     # 流媒体服务器初始化
│   │   ├── FFmpeg 推流配置      # 摄像头捕获参数
│   │   └── 事件监听器          # 推流状态监控
│   │
│   ├── package.json            # NPM 依赖配置
│   │   ├── node-media-server   # RTMP/HTTP-FLV 服务器
│   │   └── fluent-ffmpeg       # FFmpeg Node.js 绑定
│   │
│   ├── start.bat               # Windows 快速启动脚本
│   └── README.md               # 后端详细文档
│
├── front/                       # 前端页面目录
│   ├── index.html              # 单文件应用
│   │   ├── Vue.js 应用         # 响应式 UI
│   │   ├── flvjs 播放器        # FLV 流播放
│   │   └── 现代化样式          # CSS3 动画
│   │
│   └── README.md               # 前端详细文档
│
├── README.md                    # 项目总览文档
├── QUICKSTART.md               # 快速开始指南
└── ARCHITECTURE.md             # 本文件 - 架构说明
```

## 核心技术组件

### 后端组件

#### 1. NodeMediaServer
**作用**: Node.js 实现的 RTMP + HTTP-FLV 流媒体服务器

**功能**:
- 接收 RTMP 推流
- 提供 HTTP-FLV 拉流
- 支持 HLS 输出 (可选)
- 内置事件系统
- 跨域支持

**配置项**:
```javascript
{
  rtmp: {
    port: 1935,      // RTMP 推流端口
    chunk_size: 60000,
    gop_cache: true, // GOP 缓存，减少延迟
  },
  http: {
    port: 8000,      // HTTP-FLV 拉流端口
    allow_origin: '*' // CORS 配置
  }
}
```

#### 2. FFmpeg
**作用**: 音视频处理工具

**在本项目中的功能**:
- 捕获摄像头画面 (DirectShow/v4l2/avfoundation)
- H.264 视频编码
- AAC 音频编码 (可选)
- FLV 格式封装
- RTMP 推流

**关键参数**:
```bash
-f dshow                    # 输入格式 (Windows DirectShow)
-i video=DeviceName        # 输入设备
-vf scale=640:480          # 视频缩放
-r 30                      # 帧率
-vcodec libx264            # H.264 编码器
-preset ultrafast          # 编码速度预设
-tune zerolatency          # 零延迟调优
-f flv                     # 输出格式
rtmp://localhost/live/stream  # 推流地址
```

### 前端组件

#### 1. Vue.js 2.7
**作用**: 渐进式 JavaScript 框架

**在本项目中的功能**:
- 响应式数据绑定
- 组件化开发
- 事件处理
- 状态管理

#### 2. flvjs
**作用**: Bilibili 开源的 HTML5 FLV 播放器

**核心功能**:
- 解析 FLV 容器格式
- 通过 Media Source Extensions (MSE) 播放
- 支持 HTTP-FLV 直播流
- 自动解码 H.264/AAC
- 低延迟优化

**API 使用**:
```javascript
// 创建播放器
player = flvjs.createPlayer({
  type: 'flv',
  url: 'http://localhost:8000/live/stream.flv',
  isLive: true,
  autoplay: true
});

// 绑定到 video 元素
player.attachMediaElement(videoElement);

// 加载并播放
player.load();
player.play();
```

## 通信协议

### RTMP (Real-Time Messaging Protocol)
**用途**: 推流协议 (FFmpeg → node-media-server)

**特点**:
- 基于 TCP
- 低延迟
- 支持音视频混合流
- Adobe 开发，广泛使用

**连接流程**:
1. TCP 三次握手 (端口 1935)
2. RTMP 握手 (C0/C1/S0/S1/C2/S2)
3. 建立连接 (connect)
4. 发布流 (publish)
5. 推送数据 (video/audio/script data)

### HTTP-FLV
**用途**: 拉流协议 (node-media-server → flvjs)

**特点**:
- 将 FLV 文件通过 HTTP 传输
- 支持长连接
- 防火墙友好
- 易于 CDN 分发

**数据格式**:
```
FLV Header (9 bytes)
FLV Tag (Previous Tag Size + Tag)
  - Audio Tag
  - Video Tag
  - Script Data Tag
```

## 性能指标

### 延迟分析

| 环节 | 延迟 | 可优化空间 |
|------|------|-----------|
| 摄像头采集 | ~33ms (30fps) | 有限 |
| FFmpeg 编码 | 50-100ms | 调整 preset/tune |
| RTMP 传输 | <10ms | 网络环境影响 |
| Server 处理 | <10ms | GOP cache 优化 |
| HTTP 传输 | <10ms | 网络环境影响 |
| flvjs 缓冲 | 100-500ms | 调整缓冲策略 |
| 浏览器渲染 | ~16ms (60Hz) | 固定 |
| **总计** | **~200-700ms** | **可优化至<300ms** |

### 优化策略

#### 降低延迟
```javascript
// FFmpeg 参数优化
'-preset', 'ultrafast'     // 最快编码
'-tune', 'zerolatency'    // 零延迟调优
'-g', '30'                // 小 GOP

// Server 配置
gop_cache: false          // 禁用 GOP 缓存

// 前端配置
isLive: true              // 直播模式
enableStableBuffer: false // 禁用稳定缓冲
```

#### 提高画质
```javascript
// FFmpeg 参数
'-vf', 'scale=1920:1080'  // 高分辨率
'-r', '60'                // 高帧率
'-b:v', '5000k'           // 高码率
'-crf', '18'              // 高质量
```

#### 节省带宽
```javascript
// FFmpeg 参数
'-vf', 'scale=640:480'    // 低分辨率
'-r', '15'                // 低帧率
'-b:v', '800k'            // 低码率
'-c:a', 'aac'
'-b:a', '64k'             // 音频压缩
```

## 扩展方案

### 1. 添加音频支持

```javascript
// Windows - 同时捕获视频和音频
const audioDevice = "麦克风 (Realtek Audio)";
const videoDevice = "Integrated Camera";

'-f', 'dshow',
'-i', `video=${videoDevice}:audio=${audioDevice}`,
'-c:a', 'aac',
'-b:a', '128k',
```

### 2. 多路推流

```javascript
// 创建多个 FFmpeg 进程
const streams = [
  { 
    input: 'video=Camera1', 
    output: 'rtmp://localhost/live/camera1' 
  },
  { 
    input: 'video=Camera2', 
    output: 'rtmp://localhost/live/camera2' 
  }
];
```

### 3. HLS 输出

```javascript
// node-media-server 配置
trans: {
  enable: true,
  app: 'live',
  hls: true,
  hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
}

// 前端使用 hls.js 播放
```

### 4. 录制功能

```javascript
// FFmpeg 同时推流和录制
'-f', 'flv',
'rtmp://localhost/live/stream',
'-f', 'segment',
'-segment_time', '3600',
'-segment_format', 'flv',
'recordings/%Y%m%d_%H%M%S.flv'
```

### 5. 鉴权系统

```javascript
// 推流认证
nms.on('prePublish', (id, StreamPath, args) => {
  const token = args.token;
  if (!validateToken(token)) {
    return false; // 拒绝推流
  }
});

// 播放认证
nms.on('prePlay', (id, StreamPath, args) => {
  const token = args.token;
  if (!validateToken(token)) {
    return false; // 拒绝播放
  }
});
```

## 安全考虑

### 1. 网络安全
- 使用 Token 验证
- HTTPS/WSS 加密传输
- 防火墙规则配置
- IP 白名单

### 2. 访问控制
- 推流密钥管理
- 播放权限验证
- 并发连接数限制
- 带宽限制

### 3. 数据安全
- 输入验证（防止注入攻击）
- 日志记录与审计
- 敏感信息加密
- 定期安全更新

## 部署方案

### 单机部署
适合开发和测试环境

```
本地电脑
├── FFmpeg (推流)
├── node-media-server
└── 浏览器 (播放)
```

### 服务器部署
适合生产环境

```
摄像头 ──> FFmpeg ──> 云服务器 ──> CDN ──> 用户
                         │
                    node-media-server
                         │
                    Nginx 反向代理
                         │
                    SSL/TLS 加密
```

### 分布式部署
大规模应用场景

```
多个摄像头 ──> 边缘节点 ──> 中心服务器 ──> CDN ──> 用户
     │              │            │
  FFmpeg       node-media    负载均衡
```

## 监控与运维

### 关键指标监控
- CPU 使用率（FFmpeg 编码）
- 内存使用率
- 网络带宽
- 推流/拉流连接数
- 延迟统计
- 错误率

### 日志记录
```javascript
// 推流事件日志
nms.on('preConnect', (id, args) => {
  logger.info(`连接：${id}`, args);
});

nms.on('prePublish', (id, StreamPath, args) => {
  logger.info(`开始推流：${StreamPath}`, args);
});

// FFmpeg 进程日志
ffmpegProcess.stderr.on('data', (data) => {
  logger.info(`FFmpeg: ${data}`);
});
```

## 故障排查

### 常见问题定位

1. **黑屏/无画面**
   - 检查 FFmpeg 是否正常运行
   - 验证摄像头设备名称
   - 查看 RTMP 连接状态

2. **卡顿/延迟高**
   - 检查网络带宽
   - 降低视频码率/分辨率
   - 调整缓冲配置

3. **声音不同步**
   - 检查音视频时间戳
   - 调整 FFmpeg 编码参数
   - 验证 GOP 设置

4. **连接失败**
   - 检查端口占用
   - 验证防火墙规则
   - 查看服务端日志

---

**架构文档结束**

如需更多信息，请查看：
- 📖 [README.md](./README.md) - 项目总览
- 🚀 [QUICKSTART.md](./QUICKSTART.md) - 快速开始
- 📚 [backend/README.md](./backend/README.md) - 后端文档
- 📚 [front/README.md](./front/README.md) - 前端文档
