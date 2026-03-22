const NodeMediaServer = require('node-media-server');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

// 流媒体服务器配置
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

// 启动流媒体服务器
const nms = new NodeMediaServer(config);
nms.run();

console.log('🎬 流媒体服务器已启动');
console.log('RTMP 端口：1935');
console.log('HTTP-FLV 端口：8000');
console.log('推流地址：rtmp://localhost/live/stream');
console.log('播放地址：http://localhost:8000/live/stream.flv');

// 监听推流事件
nms.on('preConnect', (id, args) => {
  console.log('[RTMP 推流连接]', id, args);
});

nms.on('doneConnect', (id, args) => {
  console.log('[RTMP 推流断开]', id, args);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[开始推流]', id, StreamPath, args);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[停止推流]', id, StreamPath, args);
});

// FFmpeg 推流进程
let ffmpegProcess = null;

// 启动摄像头捕获并推流
function startStreaming() {
  // 列出所有视频设备
  const listDevicesCmd = spawn('ffmpeg', ['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy'], {
    stdio: 'pipe'
  });

  listDevicesCmd.stderr.on('data', (data) => {
    const output = data.toString();
    console.log('检测设备输出:', output);
    
    // 尝试自动检测摄像头设备名称（Windows）
    const deviceMatch = output.match(/DirectShow video devices\s*([\s\S]*?)\s*DirectShow audio devices/);
    if (deviceMatch) {
      console.log('找到的视频设备:\n', deviceMatch[1]);
    }
  });

  // 等待 2 秒后开始推流（给时间查看设备列表）
  setTimeout(() => {
    // Windows 下使用 DirectShow 捕获摄像头
    // 注意：需要根据实际摄像头名称调整 "video=Integrated Camera"
    const ffmpegArgs = [
      '-f', 'dshow',                    // 使用 DirectShow (Windows)
      '-i', 'video=Logi C270 HD WebCam',  // 摄像头名称，需要根据实际设备调整
      '-vf', 'scale=640:480',          // 缩放视频
      '-r', '30',                       // 帧率
      '-vcodec', 'libx264',            // H.264 编码
      '-preset', 'ultrafast',          // 超快速编码 preset
      '-tune', 'zerolatency',          // 零延迟优化
      '-pix_fmt', 'yuv420p',           // 像素格式
      '-g', '60',                       // GOP 大小
      '-f', 'flv',                      // 输出格式
      'rtmp://localhost/live/stream'   // 推流地址
    ];

    console.log('📹 启动 FFmpeg 推流...');
    console.log('FFmpeg 参数:', ffmpegArgs.join(' '));
    
    ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    ffmpegProcess.stdout.on('data', (data) => {
      console.log(`[FFmpeg 输出]: ${data}`);
    });

    ffmpegProcess.stderr.on('data', (data) => {
      const output = data.toString();
      // 只显示重要的 FFmpeg 信息
      if (output.includes('frame=') || output.includes('fps=') || output.includes('speed=')) {
        console.log(`[FFmpeg 状态]: ${output.trim()}`);
      } else if (output.includes('error') || output.includes('Error')) {
        console.error(`[FFmpeg 错误]: ${output.trim()}`);
      }
    });

    ffmpegProcess.on('close', (code) => {
      console.log(`FFmpeg 进程退出，代码：${code}`);
    });

    console.log('✅ 推流已开始！');
    console.log('📺 前端访问：http://localhost:8000/live/stream.flv');
  }, 2000);
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务...');
  if (ffmpegProcess) {
    ffmpegProcess.kill();
  }
  nms.stop();
  process.exit(0);
});

// 创建 HTTP 截图服务器
const screenshotServer = http.createServer((req, res) => {
  // 设置 CORS 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 截图接口：POST /api/screenshot
  if (req.url === '/api/screenshot' && req.method === 'POST') {
    const timestamp = new Date().getTime();
    const filename = `screenshot_${timestamp}.jpg`;
    const outputPath = path.join(__dirname, 'screenshots', filename);
    
    // 确保 screenshots 目录存在
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    console.log('📸 开始截取当前帧...');
    
    // 使用 FFmpeg 从 RTMP 流截取单帧
    const ffmpegArgs = [
      '-y',                                    // 覆盖输出文件
      '-rtmp_live', 'live',                   // 直播流模式
      '-i', 'rtmp://localhost/live/stream',   // 输入流地址
      '-frames:v', '1',                       // 只截取 1 帧
      '-q:v', '2',                            // 图片质量 (2-31，越小质量越高)
      '-f', 'image2',                         // 输出格式为图片
      outputPath                              // 输出文件路径
    ];
    
    const ffmpegScreenshot = spawn('ffmpeg', ffmpegArgs);
    
    let errorOutput = '';
    
    ffmpegScreenshot.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    ffmpegScreenshot.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ 截图成功：${filename}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: '截图成功',
          filename: filename,
          path: `/screenshots/${filename}`,
          fullPath: outputPath
        }));
      } else {
        console.error(`❌ 截图失败，代码：${code}`);
        console.error('FFmpeg 错误:', errorOutput);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: '截图失败',
          error: errorOutput
        }));
      }
    });
    
    // 设置超时
    setTimeout(() => {
      if (!res.writableEnded) {
        ffmpegScreenshot.kill();
        res.writeHead(504, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: '截图超时'
        }));
      }
    }, 10000); // 10 秒超时
    
  } else if (req.url.startsWith('/screenshots/') && req.method === 'GET') {
    // 提供静态文件访问
    const filePath = path.join(__dirname, req.url.substring(1));
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
      } else {
        const extname = path.extname(filePath);
        const contentType = {
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.png': 'image/png',
          '.gif': 'image/gif'
        };
        res.writeHead(200, { 'Content-Type': contentType[extname] || 'application/octet-stream' });
        res.end(data);
      }
    });
  } else if (req.url === '/api/screenshots' && req.method === 'GET') {
    // 获取所有截图列表
    const screenshotsDir = path.join(__dirname, 'screenshots');
    
    if (!fs.existsSync(screenshotsDir)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify([]));
      return;
    }
    
    fs.readdir(screenshotsDir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '读取失败' }));
        return;
      }
      
      const jpgFiles = files.filter(f => f.endsWith('.jpg'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(jpgFiles));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// 在 8001 端口启动截图服务器
screenshotServer.listen(8001, () => {
  console.log('📷 截图服务已启动，端口：8001');
  console.log('截图接口：http://localhost:8001/api/screenshot');
  console.log('查看截图：http://localhost:8001/screenshots');
});

// 启动推流
startStreaming();
