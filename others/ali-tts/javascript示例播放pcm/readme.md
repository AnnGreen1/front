# 阿里云流式语音合成（TTS）前端实现指南

## 概述

本文档基于阿里云官方 JavaScript 示例，详细讲解流式语音合成的完整实现流程。流式语音合成允许实时将文本转换为语音，适用于需要即时语音反馈的场景。

---

## 核心架构

```
┌─────────────────┐     WebSocket     ┌─────────────────────┐
│   前端应用      │ ────────────────> │ 阿里云 TTS 服务     │
│ (JavaScript)    │                  │  (FlowingSpeech)    │
└────────┬────────┘                  └──────────┬──────────┘
         │                                      │
         │ 1. StartSynthesis                    │ 返回 SynthesisStarted
         │ 2. RunSynthesis (文本)               │ 返回 PCM 音频数据
         │ 3. StopSynthesis                     │ 返回 SynthesisCompleted
         │                                      │
         ▼                                      ▼
    PCMAudioPlayer                          语音合成引擎
    (播放 PCM 音频)                        (流式返回音频)
```

---

## 1. 核心文件结构

| 文件 | 功能 |
|------|------|
| `index.html` | 页面结构，包含按钮和输入框 |
| `app.js` | WebSocket 通信逻辑 |
| `audio_player.js` | PCM 音频解码与播放 |

---

## 2. 准备工作

### 2.1 必要参数

```javascript
let appkey = 'your-nls-appkey';  // 阿里云应用密钥
let token = 'your-nls-token';     // 访问令牌
```

> **获取方式**：登录阿里云控制台 → 语音合成 → 创建应用 → 获取 AppKey 和 Token

### 2.2 连接地址

```javascript
// 北京区域（推荐）
'wss://nls-gateway-cn-beijing.aliyuncs.com/ws/v1?token=' + token

// 其他区域
// 上海: wss://nls-gateway-cn-shanghai.aliyuncs.com/ws/v1
// 深圳: wss://nls-gateway-cn-shenzhen.aliyuncs.com/ws/v1
```

---

## 3. WebSocket 通信协议详解

### 3.1 消息结构

所有消息遵循统一格式：

```json
{
  "header": {
    "message_id": "UUID",           // 唯一消息 ID
    "task_id": "UUID",              // 任务 ID（整个会话共享）
    "namespace": "FlowingSpeechSynthesizer",  // 流式合成命名空间
    "name": "StartSynthesis",       // 消息类型
    "appkey": "your-appkey"         // 应用密钥
  },
  "payload": { ... }                // 业务参数
}
```

### 3.2 消息类型说明

| 消息名称 | 方向 | 说明 |
|----------|------|------|
| `StartSynthesis` | 客户端 → 服务端 | 开始合成会话 |
| `SynthesisStarted` | 服务端 → 客户端 | 合成已开始（成功响应） |
| `RunSynthesis` | 客户端 → 服务端 | 发送待合成文本 |
| `SynthesisCompleted` | 服务端 → 客户端 | 合成完成 |
| `StopSynthesis` | 客户端 → 服务端 | 停止合成 |

---

## 4. 完整流程实现

### 4.1 步骤一：建立 WebSocket 连接

```javascript
ws = new WebSocket('wss://nls-gateway-cn-beijing.aliyuncs.com/ws/v1?token=' + token);
ws.binaryType = "arraybuffer";  // 关键：设置接收二进制数据
```

### 4.2 步骤二：发送 StartSynthesis

连接成功后立即发送开始指令：

```javascript
ws.onopen = () => {
    if (ws.readyState === WebSocket.OPEN) {
        task_id = generateUUID();  // 生成任务 ID
        const params = {
            header: {
                message_id: generateUUID(),
                task_id: task_id,
                namespace: 'FlowingSpeechSynthesizer',
                name: 'StartSynthesis',
                appkey: appkey
            },
            payload: {
                voice: 'zhixiaoxia',    // 音色选择
                format: 'PCM',          // 音频格式
                sample_rate: 24000,     // 采样率
                volume: 100,            // 音量 0-100
                speech_rate: 0,         // 语速 -500~500
                pitch_rate: 0,          // 音调 -500~500
                enable_subtitle: true,  // 启用字幕
                platform: 'javascript'
            }
        };
        ws.send(JSON.stringify(params));
    }
};
```

### 4.3 步骤三：处理服务端响应

```javascript
ws.onmessage = (event) => {
    const data = event.data;
    
    // 二进制数据：PCM 音频
    if (data instanceof ArrayBuffer) {
        player.pushPCM(data);  // 直接送入音频播放器
    } 
    // 文本数据：控制消息
    else {
        const body = JSON.parse(data);
        
        // 合成开始成功
        if (body.header.name === 'SynthesisStarted' && 
            body.header.status === 20000000) {
            isSynthesisStarted = true;
        }
        
        // 合成完成
        if (body.header.name === 'SynthesisCompleted' && 
            body.header.status === 20000000) {
            ws.close();
            isSynthesisStarted = false;
        }
    }
};
```

### 4.4 步骤四：发送文本进行合成

```javascript
const sendRunSynthesis = (text) => {
    if (ws && isSynthesisStarted) {
        const params = {
            header: {
                message_id: generateUUID(),
                task_id: task_id,
                namespace: 'FlowingSpeechSynthesizer',
                name: 'RunSynthesis',
                appkey: appkey
            },
            payload: { text }  // 待合成的文本
        };
        ws.send(JSON.stringify(params));
    }
};
```

### 4.5 步骤五：停止合成

```javascript
const sendStopSynthesis = () => {
    if (ws && isSynthesisStarted) {
        const params = {
            header: {
                message_id: generateUUID(),
                task_id: task_id,
                namespace: 'FlowingSpeechSynthesizer',
                name: 'StopSynthesis',
                appkey: appkey
            }
        };
        ws.send(JSON.stringify(params));
    }
};
```

---

## 5. PCM 音频播放器实现

### 5.1 核心原理

Web Audio API 无法直接播放原始 PCM 数据，需要进行转换：

```
原始 PCM (Int16) → 归一化 (-1.0 ~ 1.0) → AudioBuffer → BufferSourceNode → 播放
```

### 5.2 关键代码

```javascript
class PCMAudioPlayer {
    constructor(sampleRate) {
        this.sampleRate = sampleRate;  // 24000 Hz
        this.audioContext = null;
        this.audioQueue = [];          // 音频数据队列
        this.isPlaying = false;
    }

    // 初始化 AudioContext
    connect() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // 将 PCM 数据转为 AudioBuffer
    _bufferPCMData(pcmData) {
        const length = pcmData.byteLength / 2;  // 16-bit = 2 bytes per sample
        const audioBuffer = this.audioContext.createBuffer(1, length, this.sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        const int16Array = new Int16Array(pcmData);

        // 关键转换：Int16 → Float32 (-1.0 ~ 1.0)
        for (let i = 0; i < length; i++) {
            channelData[i] = int16Array[i] / 32768;
        }
        return audioBuffer;
    }

    // 播放音频
    async _playAudio(arrayBuffer) {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();  // 唤醒音频上下文
        }

        const audioBuffer = this._bufferPCMData(arrayBuffer);
        this.currentSource = this.audioContext.createBufferSource();
        this.currentSource.buffer = audioBuffer;
        this.currentSource.connect(this.audioContext.destination);
        
        this.currentSource.onended = () => {
            this.isPlaying = false;
            this._playNextAudio();  // 播放队列中的下一段
        };
        
        this.currentSource.start();
        this.isPlaying = true;
    }
}
```

---

## 6. 状态管理

```
              ┌─────────────┐
              │   Begin     │
              └──────┬──────┘
                     │ StartSynthesis
                     ▼
              ┌─────────────┐
              │  Started    │◄─────────────┐
              └──────┬──────┘              │
                     │ RunSynthesis        │
                     │ (可多次调用)         │
                     ▼                     │
              ┌─────────────┐              │
              │ Completed   │──────────────┘
              └─────────────┘  StopSynthesis
```

---

## 7. 错误处理与最佳实践

### 7.1 错误处理

```javascript
ws.onerror = (err) => {
    console.error('WebSocket 错误:', err);
    // 可实现重连逻辑
};

ws.onclose = (event) => {
    console.info('连接关闭:', event.code, event.reason);
    // 清理状态
    ws = null;
    isSynthesisStarted = false;
};
```

### 7.2 注意事项

| 事项 | 说明 |
|------|------|
| **Token 有效期** | Token 通常有效期为 1 小时，需要定时刷新 |
| **文本长度限制** | 单次 `RunSynthesis` 建议不超过 200 字符 |
| **浏览器兼容性** | 需要 HTTPS 环境（localhost 除外） |
| **音频上下文** | 需要用户交互才能唤醒（浏览器安全策略） |
| **错误码** | `20000000` 表示成功，其他为错误 |

### 7.3 推荐配置

```javascript
// 推荐的合成参数
payload: {
    voice: 'zhixiaoxia',    // 推荐音色：晓晓
    format: 'PCM',          // PCM 格式兼容性最好
    sample_rate: 24000,     // 高采样率音质更好
    volume: 80,             // 避免音量过大
    speech_rate: 0,         // 正常语速
    pitch_rate: 0           // 正常音调
}
```

---

## 8. 完整调用示例

```javascript
// 1. 初始化播放器
const player = new PCMAudioPlayer(24000);

// 2. 点击开始按钮
document.querySelector('#button-start').addEventListener('click', () => {
    player.connect();
    player.stop();
    connectAndStartSynthesis();
});

// 3. 输入文本并合成
document.querySelector('#button-run').addEventListener('click', () => {
    const text = document.getElementById('textInput').value.trim();
    sendRunSynthesis(text);
});

// 4. 停止合成
document.querySelector('#button-stop').addEventListener('click', () => {
    sendStopSynthesis();
});
```

---

## 9. 调试技巧

### 9.1 日志输出

```javascript
ws.onmessage = (event) => {
    const data = event.data;
    if (data instanceof ArrayBuffer) {
        console.log(`收到 PCM 数据: ${data.byteLength} bytes`);
    } else {
        console.log('收到消息:', JSON.parse(data));
    }
};
```

### 9.2 常见问题排查

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 连接失败 | Token 无效或过期 | 重新获取 Token |
| 无音频输出 | AudioContext 被挂起 | 需要用户交互触发 |
| 音频卡顿 | 网络延迟或数据累积 | 优化队列处理 |
| 401 错误 | Token 缺失或错误 | 检查 Token 参数 |

---

## 10. 总结

阿里云流式语音合成的核心流程：

1. **建立连接** → WebSocket 连接到阿里云服务
2. **开始合成** → 发送 `StartSynthesis` 获取会话
3. **流式传输** → 多次发送 `RunSynthesis` 传输文本
4. **实时播放** → 接收 PCM 数据并解码播放
5. **结束会话** → 发送 `StopSynthesis` 或等待完成

这套机制实现了真正的流式处理，文本可以分段发送，音频实时返回播放，非常适合对话式 AI 助手等场景。