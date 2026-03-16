<template>
  <div class="upload-container">
    <h1>大文件分片上传测试</h1>

    <!-- 文件选择区域 -->
    <div class="upload-area">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        accept="*/*"
        multiple
        class="file-input"
      />
      <div class="file-info" v-if="selectedFiles.length > 0">
        <h3>已选择文件:</h3>
        <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
          <span>{{ file.name }}</span>
          <span>{{ formatFileSize(file.size) }}</span>
        </div>
      </div>
    </div>

    <!-- 上传控制按钮 -->
    <div class="controls">
      <button
        @click="startUpload"
        :disabled="!selectedFiles.length || isUploading"
        class="upload-btn"
      >
        {{ isUploading ? '上传中...' : '开始上传' }}
      </button>
      <button @click="cancelUpload" :disabled="!isUploading" class="cancel-btn">取消上传</button>
    </div>

    <!-- 上传进度显示 -->
    <div class="progress-section" v-if="uploadProgress.length > 0">
      <h3>上传进度:</h3>
      <div v-for="(progress, index) in uploadProgress" :key="index" class="progress-item">
        <div class="file-name">{{ progress.fileName }}</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress.percentage + '%' }"></div>
        </div>
        <div class="progress-text">
          {{ progress.uploadedParts }}/{{ progress.totalParts }} 分片 ({{
            Math.round(progress.percentage)
          }}%)
        </div>
        <div class="speed-info">
          速度: {{ progress.speed }}/s | 剩余时间: {{ progress.remainingTime }}
        </div>
      </div>
    </div>

    <!-- 上传结果 -->
    <div class="result-section" v-if="uploadResults.length > 0">
      <h3>上传结果:</h3>
      <div v-for="(result, index) in uploadResults" :key="index" class="result-item">
        <div class="result-success" v-if="result.success">
          ✅ {{ result.fileName }} 上传成功
          <div class="result-url">
            <strong>访问地址:</strong>
            <a :href="result.url" target="_blank">{{ result.url }}</a>
          </div>
        </div>
        <div class="result-error" v-else>❌ {{ result.fileName }} 上传失败: {{ result.error }}</div>
      </div>
    </div>

    <!-- 日志输出 -->
    <div class="log-section">
      <h3>上传日志:</h3>
      <div class="log-content">
        <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
          [{{ log.time }}] {{ log.message }}
        </div>
      </div>
      <button @click="clearLogs" class="clear-log-btn">清空日志</button>
    </div>
  </div>
</template>

<script>
import { initUpload, uploadPart, completeUpload, getUploadStatus } from '@/utils/upload'

export default {
  name: 'HomeView',
  data() {
    return {
      selectedFiles: [],
      isUploading: false,
      uploadProgress: [],
      uploadResults: [],
      logs: [],
      abortControllers: new Map(), // 用于取消上传
      chunkSize: 5 * 1024 * 1024 // 5MB分片大小
    }
  },
  methods: {
    // 处理文件选择
    handleFileSelect(event) {
      console.log('handleFileSelect', event)
      const files = Array.from(event.target.files)
      this.selectedFiles = files

      // 重置之前的状态
      this.uploadProgress = []
      this.uploadResults = []
      this.logs = []

      this.addLog('info', `选择了 ${files.length} 个文件`)
      files.forEach((file) => {
        this.addLog('info', `文件: ${file.name} (${this.formatFileSize(file.size)})`)
      })
    },

    // 开始上传
    async startUpload() {
      if (this.isUploading) return

      this.isUploading = true
      this.uploadResults = []

      try {
        // 并发上传所有文件
        const uploadPromises = this.selectedFiles.map((file, index) =>
          this.uploadSingleFile(file, index)
        )

        await Promise.all(uploadPromises)
        this.addLog('success', '所有文件上传完成')
      } catch (error) {
        this.addLog('error', `上传过程中发生错误: ${error.message}`)
      } finally {
        this.isUploading = false
      }
    },

    // 上传单个文件
    async uploadSingleFile(file, fileIndex) {
      try {
        this.addLog('info', `开始上传文件: ${file.name}`)

        // 初始化上传
        const initResult = await initUpload(file.name)
        const { uploadId } = initResult

        this.addLog('info', `初始化成功，UploadId: ${uploadId}`)

        // 设置进度跟踪
        const totalParts = Math.ceil(file.size / this.chunkSize)
        // Vue 3中直接赋值即可，无需$set
        this.uploadProgress[fileIndex] = {
          fileName: file.name,
          uploadedParts: 0,
          totalParts,
          percentage: 0,
          speed: '0 KB',
          remainingTime: '--',
          startTime: Date.now()
        }

        // 创建AbortController用于取消上传
        const abortController = new AbortController()
        this.abortControllers.set(uploadId, abortController)

        const parts = []
        let uploadedBytes = 0

        // 分片上传
        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
          const start = (partNumber - 1) * this.chunkSize
          const end = Math.min(start + this.chunkSize, file.size)
          const chunk = file.slice(start, end)

          try {
            const partResult = await uploadPart(file.name, uploadId, partNumber, chunk)

            parts.push({
              partNumber,
              etag: partResult.etag
            })

            uploadedBytes += chunk.size
            this.updateProgress(fileIndex, partNumber, totalParts, uploadedBytes, file.size)

            this.addLog('info', `分片 ${partNumber}/${totalParts} 上传成功`)
          } catch (error) {
            if (error.name === 'AbortError') {
              this.addLog('warning', `文件 ${file.name} 上传被取消`)
              return
            }
            throw error
          }
        }

        // 完成上传
        const completeResult = await completeUpload(file.name, uploadId, parts)

        // Vue 3中直接赋值即可
        this.uploadResults[fileIndex] = {
          fileName: file.name,
          success: true,
          url: completeResult.url,
          objectName: completeResult.objectName
        }

        this.addLog('success', `文件 ${file.name} 上传完成`)
        this.abortControllers.delete(uploadId)
      } catch (error) {
        // Vue 3中直接赋值即可
        this.uploadResults[fileIndex] = {
          fileName: file.name,
          success: false,
          error: error.message
        }
        this.addLog('error', `文件 ${file.name} 上传失败: ${error.message}`)
        throw error
      }
    },

    // 更新上传进度
    updateProgress(fileIndex, currentPart, totalParts, uploadedBytes, totalBytes) {
      const progress = this.uploadProgress[fileIndex]
      if (!progress) return

      const percentage = (currentPart / totalParts) * 100
      const elapsedTime = (Date.now() - progress.startTime) / 1000
      const speed = elapsedTime > 0 ? uploadedBytes / elapsedTime : 0
      const remainingBytes = totalBytes - uploadedBytes
      const remainingTime = speed > 0 ? remainingBytes / speed : 0

      // Vue 3中直接修改对象属性即可
      progress.uploadedParts = currentPart
      progress.percentage = percentage
      progress.speed = this.formatFileSize(speed) + '/s'
      progress.remainingTime = this.formatTime(remainingTime)
    },

    // 取消上传
    cancelUpload() {
      this.abortControllers.forEach((controller) => controller.abort())
      this.abortControllers.clear()
      this.isUploading = false
      this.addLog('warning', '上传已被用户取消')
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    // 格式化时间
    formatTime(seconds) {
      if (seconds === Infinity || seconds < 0) return '--'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}m ${secs}s`
    },

    // 添加日志
    addLog(type, message) {
      const time = new Date().toLocaleTimeString()
      this.logs.push({ type, time, message })
      // 保持最新的100条日志
      if (this.logs.length > 100) {
        this.logs.shift()
      }
    },

    // 清空日志
    clearLogs() {
      this.logs = []
    }
  }
}
</script>

<style scoped>
.upload-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  background-color: #fafafa;
}

.file-input {
  margin-bottom: 15px;
}

.file-info {
  text-align: left;
}

.file-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: white;
  border-radius: 4px;
  margin: 5px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.controls {
  text-align: center;
  margin-bottom: 30px;
}

.upload-btn,
.cancel-btn {
  padding: 12px 24px;
  margin: 0 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.upload-btn {
  background-color: #4caf50;
  color: white;
}

.upload-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.upload-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #da190b;
}

.progress-section,
.result-section,
.log-section {
  margin-bottom: 30px;
}

.progress-item,
.result-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.file-name {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #45a049);
  transition: width 0.3s ease;
}

.progress-text,
.speed-info {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.result-success {
  color: #4caf50;
  font-weight: bold;
}

.result-error {
  color: #f44336;
  font-weight: bold;
}

.result-url {
  margin-top: 10px;
  font-size: 14px;
}

.result-url a {
  color: #2196f3;
  text-decoration: none;
}

.result-url a:hover {
  text-decoration: underline;
}

.log-content {
  background: #000;
  color: #00ff00;
  padding: 15px;
  border-radius: 8px;
  height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  margin-bottom: 10px;
}

.log-item {
  margin: 2px 0;
}

.log-item.info {
  color: #00ff00;
}
.log-item.success {
  color: #00ffff;
}
.log-item.warning {
  color: #ffff00;
}
.log-item.error {
  color: #ff0000;
}

.clear-log-btn {
  background-color: #666;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.clear-log-btn:hover {
  background-color: #555;
}
</style>
