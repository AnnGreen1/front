const WebSocket = require('ws');

// 创建WebSocket服务器，监听8082端口（避免与其他服务冲突）
const wss = new WebSocket.Server({ port: 8082 }, () => {
  console.log('WebSocket流式文本服务已启动，监听端口 8082');
  console.log('等待客户端连接...');
});

// 模拟的文本内容
const sampleTexts = [
  "你好！我是一个模拟的大语言模型。\n",
  "我可以逐字生成文本，就像真实的大模型一样。\n",
  "这种流式传输技术在现代Web应用中非常常见。\n",
  "它能让用户在等待响应时有更好的体验。\n",
  "特别是在处理大量文本或长时间运行的AI任务时。\n",
  "通过逐步发送文本，我们可以实现更好的用户体验。\n",
  "而不需要等待整个响应完成后再显示。\n",
  "这就是为什么你会看到文本一个字一个字地出现。\n"
];

// 处理WebSocket连接
wss.on('connection', (ws, req) => {
  console.log('新的客户端已连接');
  
  // 发送欢迎消息
  ws.send(JSON.stringify({ 
    type: 'welcome', 
    message: '已连接到流式文本服务',
    timestamp: new Date().toISOString()
  }));
  
  // 监听客户端消息
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'request_text':
          // 获取要发送的文本
          const text = data.content || sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
          // 模拟流式发送文本
          streamText(ws, text);
          break;
          
        case 'stop_stream':
          // 客户端请求停止流式传输
          console.log('客户端请求停止流式传输');
          break;
          
        default:
          console.log('未知消息类型:', data.type);
      }
    } catch (error) {
      console.error('解析消息错误:', error);
    }
  });
  
  // 连接关闭时
  ws.on('close', () => {
    console.log('客户端已断开连接');
  });
  
  // 连接错误时
  ws.on('error', (error) => {
    console.error('WebSocket连接错误:', error);
  });
});

// 流式发送文本函数
function streamText(ws, text) {
  console.log('开始流式发送文本:', text.substring(0, 30) + '...');
  
  // 将文本分解为字符数组
  const chars = Array.from(text);
  let index = 0;
  
  // 模拟逐字发送（每150毫秒发送一个字符）
  const interval = setInterval(() => {
    if (index < chars.length && ws.readyState === WebSocket.OPEN) {
      // 发送单个字符
      ws.send(JSON.stringify({
        type: 'text_chunk',
        content: chars[index],
        index: index
      }));
      index++;
    } else {
      // 发送结束标记
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'text_end',
          message: '文本发送完成',
          total_chars: index
        }));
        console.log('文本发送完成，共发送', index, '个字符');
      }
      clearInterval(interval);
    }
  }, 150); // 每150毫秒发送一个字符，模拟真实的AI响应速度
}

// 错误处理
wss.on('error', (error) => {
  console.error('WebSocket服务器错误:', error);
});

console.log('正在启动WebSocket流式文本服务...');