<template>
  <div class="tts-player">
    <h2>阿里云TTS语音合成</h2>

    <div class="form-group">
      <label for="text">合成文本:</label>
      <textarea
        id="text"
        v-model="text"
        placeholder="请输入需要合成的文本"
        rows="3"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="format">音频格式:</label>
      <select id="format" v-model="format">
        <option value="wav">WAV</option>
        <option value="mp3">MP3</option>
        <option value="pcm">PCM</option>
      </select>
    </div>

    <div class="form-group">
      <label for="sampleRate">采样率:</label>
      <select id="sampleRate" v-model="sampleRate">
        <option :value="8000">8000 Hz</option>
        <option :value="16000">16000 Hz</option>
        <option :value="24000">24000 Hz</option>
        <option :value="48000">48000 Hz</option>
      </select>
    </div>

    <div class="button-group">
      <button @click="sendGetRequest" :disabled="loading">
        {{ loading && requestType === "GET" ? "处理中..." : "发送GET请求" }}
      </button>
      <button @click="sendPostRequest" :disabled="loading">
        {{ loading && requestType === "POST" ? "处理中..." : "发送POST请求" }}
      </button>
    </div>

    <div v-if="audioUrl" class="audio-player">
      <h3>播放音频</h3>
      <audio :src="audioUrl" controls autoplay></audio>
    </div>

    <div v-if="error" class="error">
      <p>错误: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";

// 配置参数
const appkey = "CVW7mjKfDxOSfhC7";
const token = "6f172ce460bd47b6b7c7bd46ea000fc1";

// 响应式数据
const text = ref("今天是周一，天气挺好的。");
const format = ref("wav");
const sampleRate = ref(16000);
const audioUrl = ref("");
const loading = ref(false);
const requestType = ref("");
const error = ref("");
const voice = ref("siqi");

// 清理对象URL以防止内存泄漏
let objectUrl = null;

onUnmounted(() => {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
});

// URL编码函数
const urlEncode = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
};

// 发送GET请求
const sendGetRequest = async () => {
  try {
    error.value = "";
    loading.value = true;
    requestType.value = "GET";

    let url = "/ali-tts/stream/v1/tts";
    url += "?appkey=" + appkey;
    url += "&token=" + token;
    url += "&text=" + urlEncode(text.value);
    url += "&format=" + format.value;
    url += "&sample_rate=" + sampleRate.value;
    url += "&voice=" + voice.value;

    console.log("GET请求URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "audio/*",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("audio/")) {
      const textResponse = await response.text();
      throw new Error(`请求失败: ${textResponse}`);
    }

    const audioBlob = await response.blob();
    updateAudioPlayer(audioBlob);
  } catch (err) {
    console.error("GET请求错误:", err);
    error.value = err.message || "GET请求失败";
  } finally {
    loading.value = false;
  }
};

// 发送POST请求
const sendPostRequest = async () => {
  try {
    error.value = "";
    loading.value = true;
    requestType.value = "POST";

    const url = "/ali-tts/stream/v1/tts";

    const requestBody = {
      appkey: appkey,
      token: token,
      text: text.value,
      format: format.value,
      sample_rate: sampleRate.value,
      voice: voice.value,
    };

    console.log("POST请求体:", JSON.stringify(requestBody));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/*",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.startsWith("audio/")) {
      const textResponse = await response.text();
      throw new Error(`请求失败: ${textResponse}`);
    }

    const audioBlob = await response.blob();
    updateAudioPlayer(audioBlob);
  } catch (err) {
    console.error("POST请求错误:", err);
    error.value = err.message || "POST请求失败";
  } finally {
    loading.value = false;
  }
};

// 更新音频播放器
const updateAudioPlayer = (audioBlob) => {
  // 清理之前的对象URL
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }

  // 创建新的对象URL
  objectUrl = URL.createObjectURL(audioBlob);
  audioUrl.value = objectUrl;
};
</script>

<style scoped>
.tts-player {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.button-group button {
  flex: 1;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.button-group button:hover:not(:disabled) {
  background-color: #359c6d;
}

.button-group button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.audio-player {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.audio-player audio {
  width: 100%;
  margin-top: 10px;
}

.error {
  padding: 10px;
  background-color: #ffecec;
  color: #cc0000;
  border: 1px solid #cc0000;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
