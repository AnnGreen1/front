import axios from 'axios'

const API_BASE = '/api'

// 初始化上传
export const initUpload = async (fileName) => {
  try {
    const response = await axios.post(`${API_BASE}/upload/init`, { fileName })
    return response.data
  } catch (error) {
    console.error('初始化上传失败:', error)
    throw error
  }
}

// 上传分片
export const uploadPart = async (fileName, uploadId, partNumber, chunk) => {
  try {
    const response = await axios.post(
      `${API_BASE}/upload/upload-part?fileName=${encodeURIComponent(fileName)}&uploadId=${uploadId}&partNumber=${partNumber}`,
      chunk,
      {
        headers: { 'Content-Type': 'application/octet-stream' },
        timeout: 60000 // 60秒超时
      }
    )
    return response.data
  } catch (error) {
    console.error('上传分片失败:', error)
    throw error
  }
}

// 完成上传
export const completeUpload = async (fileName, uploadId, parts) => {
  try {
    const response = await axios.post(`${API_BASE}/upload/complete`, {
      fileName,
      uploadId,
      parts
    })
    return response.data
  } catch (error) {
    console.error('完成上传失败:', error)
    throw error
  }
}

// 获取上传状态
export const getUploadStatus = async (uploadId) => {
  try {
    const response = await axios.get(`${API_BASE}/upload/status/${uploadId}`)
    return response.data
  } catch (error) {
    console.error('获取上传状态失败:', error)
    throw error
  }
}