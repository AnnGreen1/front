const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Minio = require('minio');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置MinIO客户端
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin'
});

// 创建存储桶（如果不存在）
const BUCKET_NAME = 'uploads';
minioClient.bucketExists(BUCKET_NAME, (err, exists) => {
  if (err) {
    console.error('检查存储桶时出错:', err);
    return;
  }
  if (!exists) {
    minioClient.makeBucket(BUCKET_NAME, 'us-east-1', (err) => {
      if (err) {
        console.error('创建存储桶时出错:', err);
      } else {
        console.log(`存储桶 ${BUCKET_NAME} 创建成功`);
      }
    });
  } else {
    console.log(`存储桶 ${BUCKET_NAME} 已存在`);
  }
});

// 配置中间件
app.use(cors());
app.use(express.json());

// 添加原始body解析中间件，用于处理二进制数据
app.use('/api/upload/upload-part', express.raw({ type: 'application/octet-stream', limit: '100mb' }));

// 内存存储配置用于其他可能的文件上传
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 存储上传状态
const uploadSessions = new Map();

// 初始化上传
app.post('/api/upload/init', (req, res) => {
  try {
    const { fileName } = req.body;
    const uploadId = uuidv4();
    
    uploadSessions.set(uploadId, {
      fileName,
      parts: [],
      createdAt: Date.now()
    });
    
    console.log(`初始化上传: ${fileName}, UploadId: ${uploadId}`);
    res.json({ uploadId, fileName });
  } catch (error) {
    console.error('初始化上传失败:', error);
    res.status(500).json({ error: '初始化上传失败' });
  }
});

// 上传分片 - 修改为直接接收二进制数据
app.post('/api/upload/upload-part', (req, res) => {
  try {
    const { fileName, uploadId, partNumber } = req.query;
    
    if (!uploadSessions.has(uploadId)) {
      return res.status(400).json({ error: '无效的上传ID' });
    }
    
    // 直接从请求体获取二进制数据
    const fileBuffer = req.body;
    
    if (!fileBuffer || fileBuffer.length === 0) {
      return res.status(400).json({ error: '文件数据为空' });
    }
    
    const session = uploadSessions.get(uploadId);
    const partKey = `${uploadId}/part-${partNumber}`;
    
    // 上传分片到MinIO
    minioClient.putObject(BUCKET_NAME, partKey, fileBuffer, fileBuffer.length, (err, etag) => {
      if (err) {
        console.error('上传分片失败:', err);
        return res.status(500).json({ error: '上传分片失败' });
      }
      
      // 记录分片信息
      session.parts.push({
        partNumber: parseInt(partNumber),
        etag,
        key: partKey
      });
      
      console.log(`上传分片成功: ${fileName}, Part: ${partNumber}, ETag: ${etag}`);
      res.json({ success: true, partNumber, etag });
    });
  } catch (error) {
    console.error('处理分片上传时出错:', error);
    res.status(500).json({ error: '处理分片上传失败' });
  }
});

// 完成分片上传
app.post('/api/upload/complete', async (req, res) => {
  try {
    const { fileName, uploadId, parts } = req.body;
    
    if (!uploadSessions.has(uploadId)) {
      return res.status(400).json({ error: '无效的上传ID' });
    }
    
    const session = uploadSessions.get(uploadId);
    
    // 按照分片编号排序
    const sortedParts = session.parts.sort((a, b) => a.partNumber - b.partNumber);
    
    // 合并所有分片
    const objectName = `completed/${Date.now()}-${fileName}`;
    const sourceObjects = sortedParts.map(part => part.key);
    
    // 使用composeObject合并分片
    await new Promise((resolve, reject) => {
      minioClient.composeObject(BUCKET_NAME, objectName, sourceObjects, (err) => {
        if (err) {
          console.error('合并对象失败:', err);
          reject(err);
        } else {
          console.log(`对象合并成功: ${objectName}`);
          resolve();
        }
      });
    });
    
    // 清理临时分片
    await Promise.all(sourceObjects.map(obj => 
      new Promise((resolve, reject) => {
        minioClient.removeObject(BUCKET_NAME, obj, (err) => {
          if (err) reject(err);
          else resolve();
        });
      })
    ));
    
    // 删除会话
    uploadSessions.delete(uploadId);
    
    console.log(`上传完成: ${fileName}, 对象名: ${objectName}`);
    res.json({ 
      success: true, 
      fileName, 
      objectName,
      url: `http://localhost:9000/${BUCKET_NAME}/${objectName}`
    });
  } catch (error) {
    console.error('完成上传失败:', error);
    res.status(500).json({ error: '完成上传失败' });
  }
});

// 获取上传状态
app.get('/api/upload/status/:uploadId', (req, res) => {
  const { uploadId } = req.params;
  
  if (!uploadSessions.has(uploadId)) {
    return res.status(404).json({ error: '上传会话不存在' });
  }
  
  const session = uploadSessions.get(uploadId);
  res.json({
    fileName: session.fileName,
    partsUploaded: session.parts.length,
    createdAt: session.createdAt
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`API端点:`);
  console.log(`  POST /api/upload/init - 初始化上传`);
  console.log(`  POST /api/upload/upload-part - 上传分片`);
  console.log(`  POST /api/upload/complete - 完成上传`);
  console.log(`  GET /api/upload/status/:uploadId - 获取上传状态`);
});