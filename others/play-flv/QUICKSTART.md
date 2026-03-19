# 🚀 快速开始指南

## 环境准备

### 1. 安装 FFmpeg（必需）

**Windows 用户：**

打开 PowerShell 或 CMD，执行以下命令之一：

```bash
# 方法 1: 使用 winget (推荐)
winget install Gyan.FFmpeg

# 方法 2: 使用 chocolatey
choco install ffmpeg
```

**验证安装：**
```bash
ffmpeg -version
```

如果显示版本信息，说明安装成功。

### 2. 安装 Node.js（如未安装）

从 [Node.js 官网](https://nodejs.org/) 下载并安装 LTS 版本。

**验证安装：**
```bash
node --version
npm --version
```

## 启动步骤

### 方式一：使用启动脚本（推荐）

1. 双击 `backend\start.bat`
2. 等待服务启动完成
3. 看到 `✅ 推流已开始！` 表示成功

### 方式二：手动启动

#### 1. 启动后端

```bash
cd backend
npm install    # 首次运行需要安装依赖
npm start      # 启动服务
```

#### 2. 打开前端

**方法 A：直接打开**
- 双击 `front\index.html`

**方法 B：使用本地服务器（推荐）**
```bash
# 在项目根目录打开新终端
python -m http.server 8080

# 或使用 npx
npx http-server -p 8080
```

然后访问：http://localhost:8080

## 使用流程

### 1️⃣ 启动后端
```bash
# Windows - 双击
backend\start.bat

# 或手动执行
cd backend
npm start
```

看到以下输出表示成功：
```
🎬 流媒体服务器已启动
RTMP 端口：1935
HTTP-FLV 端口：8000
📹 启动 FFmpeg 推流...
✅ 推流已开始！
```

### 2️⃣ 打开前端

在浏览器中打开 `front\index.html`

### 3️⃣ 开始播放

点击 **"▶️ 开始播放"** 按钮

### 4️⃣ 观看直播

等待几秒后即可看到摄像头画面！

## 常见问题

### ❌ "找不到 FFmpeg"

**解决方案：**
1. 重新运行：`winget install Gyan.FFmpeg`
2. 重启终端/命令行
3. 重启电脑（如果仍然不行）

### ❌ "端口被占用"

**解决方案：**
```bash
# 查看占用端口的进程
netstat -ano | findstr :1935
netstat -ano | findstr :8000

# 结束进程
taskkill /PID <进程 ID> /F
```

### ❌ "摄像头无法访问"

**可能原因：**
- 摄像头被其他程序占用（如 Zoom、微信等）
- 权限不足

**解决方案：**
1. 关闭所有使用摄像头的程序
2. Windows 设置 -> 隐私 -> 摄像头 -> 允许应用访问摄像头

### ❌ "前端无法连接"

**检查清单：**
1. ✅ 后端是否正在运行
2. ✅ 防火墙是否阻止（临时关闭防火墙测试）
3. ✅ 浏览器控制台是否有错误

## 自定义配置

### 修改摄像头

1. 查看可用设备：
```bash
ffmpeg -list_devices true -f dshow -i dummy
```

2. 找到你的摄像头名称（类似 `"Integrated Camera"`）

3. 编辑 `backend\server.js`，找到这行：
```javascript
'-i', 'video=Integrated Camera',
```
改为你的设备名称。

### 修改视频质量

编辑 `backend\server.js`，调整这些参数：

```javascript
// 分辨率
'-vf', 'scale=1280:720',  // 改为 1920:1080 或其他

// 帧率
'-r', '30',  // 改为 24 或 60

// 码率
'-b:v', '2500k',  // 改为 1000k (更清晰) 或 5000k (更流畅)
```

### 修改端口

编辑 `backend\server.js`：

```javascript
const config = {
  rtmp: {
    port: 1935,  // 改为其他端口
  },
  http: {
    port: 8000,  // 改为其他端口
  }
};
```

## 进阶使用

### 局域网访问

1. 获取本机 IP：
```bash
ipconfig
# 找到 IPv4 地址，例如：192.168.1.100
```

2. 前端配置：
```javascript
streamUrl: 'http://192.168.1.100:8000/live/stream.flv'
```

3. 确保防火墙允许端口 8000 和 1935

### 录制视频

添加 FFmpeg 参数同时录制：

```javascript
// 在 server.js 中添加
'-f', 'flv',
'rtmp://localhost/live/stream',
'-f', 'segment',
'-segment_time', '3600',
'recordings/%Y%m%d_%H%M%S.flv'
```

### 多路推流

复制多个 FFmpeg 进程，使用不同的输入设备和推流地址：

```javascript
// stream1
'-i', 'video=Camera1',
'rtmp://localhost/live/stream1'

// stream2
'-i', 'video=Camera2',
'rtmp://localhost/live/stream2'
```

## 技术支持

- 📖 详细文档：查看各子目录的 README.md
- 🐛 问题反馈：查看项目的 Issue 区
- 💬 讨论交流：加入相关技术社区

## 下一步

- [ ] 尝试修改视频质量参数
- [ ] 添加音频支持
- [ ] 实现录制功能
- [ ] 部署到服务器
- [ ] 添加用户认证

---

**祝你使用愉快！** 🎉

如有任何问题，请查看详细文档或搜索相关技术资料。
