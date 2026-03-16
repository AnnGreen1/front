const WebSocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');
const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const { path: ffprobePath } = require('@ffprobe-installer/ffprobe');

// 设置FFmpeg路径
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 8081 });
console.log('WebSocket服务器运行在端口 8081');

wss.on('connection', (ws) => {
  console.log('新客户端已连接');
  
  // 启动摄像头流
  const stream = ffmpeg()
    .input('video=Integrated Camera') // Windows下默认摄像头，根据实际情况修改
    .inputFormat('dshow')             // DirectShow (Windows)
    // 对于Mac用户使用:
    // .input('default:none')          
    // .inputFormat('avfoundation')    
    // 对于Linux用户使用:
    // .input('/dev/video0')           
    // .inputFormat('v4l2')            
    .videoCodec('libx264')
    .size('1280x720')
    .fps(30)
    .outputFormat('flv')
    .outputOptions([
      '-preset ultrafast',
      '-tune zerolatency',
      '-g 60',
      '-keyint_min 30',
      '-sc_threshold 0'
    ])
    .on('start', (cmdLine) => {
      console.log('FFmpeg命令:', cmdLine);
    })
    .on('error', (err) => {
      console.error('FFmpeg错误:', err);
      ws.close();
    });

  // 将FLV流数据发送到客户端
  stream.on('data', (chunk) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(chunk, { binary: true });
    }
  });

  // 开始流传输
  stream.run();

  ws.on('close', () => {
    console.log('客户端断开连接');
    stream.kill();
  });

  ws.on('error', (err) => {
    console.error('WebSocket错误:', err);
    stream.kill();
  });
});

console.log('摄像头流服务器已启动');
console.log('请在浏览器中打开 test.html 并连接到 ws://localhost:8081');