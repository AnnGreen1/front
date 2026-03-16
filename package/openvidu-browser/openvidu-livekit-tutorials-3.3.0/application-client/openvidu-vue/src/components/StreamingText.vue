<template>
  <div class="streaming-text-container">
    <h3>大模型流式文本演示</h3>
    <div class="controls">
      <button @click="connect" :disabled="isConnected">连接</button>
      <button @click="disconnect" :disabled="!isConnected">断开</button>
      <button @click="requestText" :disabled="!isConnected || isStreaming">请求文本</button>
    </div>
    
    <div class="input-section">
      <textarea 
        v-model="inputText" 
        placeholder="输入要流式传输的文本" 
        :disabled="isStreaming"
        rows="4"
        cols="50"
      ></textarea>
    </div>
    
    <div class="status">
      状态: {{ connectionStatus }}
    </div>
    
    <div class="output" ref="outputRef">
      <div v-for="(chunk, index) in receivedChunks" :key="index" class="text-chunk">
        {{ chunk }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

// 响应式数据
const isConnected = ref(false);
const isStreaming = ref(false);
const connectionStatus = ref('未连接');
const inputText = ref('这是一个模拟的大模型流式返回文本示例。它会逐字发送到客户端，就像真实的大语言模型一样。');
const receivedChunks = ref([]);
const outputRef = ref(null);

// WebSocket 实例
let ws = null;

// 连接到 WebSocket 服务器
const connect = () => {
  // 连接到流式文本服务器 (假设运行在 8080 端口)
  ws = new WebSocket('ws://localhost:8080');
  
  ws.onopen = () => {
    isConnected.value = true;
    connectionStatus.value = '已连接';
    console.log('已连接到流式文本服务器');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'welcome':
          console.log('服务器消息:', data.message);
          break;
          
        case 'text_chunk':
          // 添加接收到的文本块
          receivedChunks.value.push(data.content);
          isStreaming.value = true;
          // 滚动到底部
          scrollToBottom();
          break;
          
        case 'text_end':
          // 文本流结束
          isStreaming.value = false;
          receivedChunks.value.push('\n\n'); // 添加换行
          console.log('文本接收完成');
          break;
          
        default:
          console.log('未知消息类型:', data.type);
      }
    } catch (error) {
      console.error('解析消息错误:', error);
    }
  };
  
  ws.onclose = () => {
    isConnected.value = false;
    isStreaming.value = false;
    connectionStatus.value = '连接已断开';
    console.log('WebSocket 连接已关闭');
  };
  
  ws.onerror = (error) => {
    connectionStatus.value = '连接错误';
    console.error('WebSocket 错误:', error);
  };
};

// 断开连接
const disconnect = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

// 请求文本流
const requestText = () => {
  if (ws && isConnected.value) {
    // 清空之前的文本
    receivedChunks.value = [];
    
    // 发送请求
    ws.send(JSON.stringify({
      type: 'request_text',
      content: inputText.value
    }));
  }
};

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight;
    }
  }, 0);
};

// 组件卸载时断开连接
onUnmounted(() => {
  disconnect();
});
</script>

<style scoped>
.streaming-text-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  font-family: Arial, sans-serif;
}

.controls {
  margin-bottom: 15px;
}

.controls button {
  margin-right: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.input-section {
  margin-bottom: 15px;
}

.input-section textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}

.status {
  margin-bottom: 15px;
  font-weight: bold;
}

.output {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 15px;
  min-height: 100px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #f8f9fa;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.text-chunk {
  display: inline;
}
</style>