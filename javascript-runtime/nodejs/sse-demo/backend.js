// 导入Node.js内置模块
const http = require("http");
const fs = require("fs");

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 请求根路径时，返回HTML页面
  if (req.url === "/") {
    fs.readFile("./index.html", (err, content) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content); // 发送HTML给浏览器
    });
    return;
  }

  // 请求/events路径时，建立SSE连接
  if (req.url === "/events") {
    console.log("SSE客户端已连接");

    // 设置SSE必备响应头
    res.writeHead(200, {
      "Content-Type": "text/event-stream", // 关键：声明这是事件流
      "Cache-Control": "no-cache", // 禁止缓存
      Connection: "keep-alive", // 保持连接
      "Access-Control-Allow-Origin": "*",
    });

    // 1. 发送连接成功消息
    res.write("data: 连接成功，开始接收数据\n\n");

    // 2. 定时发送数据（模拟实时更新）
    let counter = 0;
    const timer = setInterval(() => {
      counter++;

      // 示例1：发送简单数据
      res.write(
        `data: 消息${counter} - 时间: ${new Date().toLocaleTimeString()}\n\n`
      );

      // 示例2：发送JSON数据（推荐）
      const jsonData = JSON.stringify({
        id: counter,
        value: Math.random().toFixed(4),
        time: new Date().toISOString(),
      });
      res.write(`data: ${jsonData}\n\n`);

      // 示例3：发送带事件类型和ID的消息
      res.write(`event: alert\n`); // 自定义事件类型
      res.write(`id: ${counter}\n`); // 消息ID
      res.write(`data: 这是第${counter}条警报\n\n`);

      // 发送10条后停止（演示用）
      if (counter >= 10) {
        clearInterval(timer);
        res.write("data: 数据流结束\n\n");
        res.end();
      }
    }, 1000); // 每秒发送一次

    // 客户端断开时清理定时器
    req.on("close", () => {
      clearInterval(timer);
      console.log("客户端断开连接");
    });
    return;
  }

  // 其他路径返回404
  res.writeHead(404);
  res.end("Not Found");
});

// 启动服务器
server.listen(3000, () => {
  console.log("SSE服务器运行在: http://localhost:3000");
});
