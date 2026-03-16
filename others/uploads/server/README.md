# 文件分片上传后端服务

基于Node.js和MinIO的对象存储服务，支持大文件分片上传。

## 功能特性

- ✅ 大文件分片上传
- ✅ 断点续传支持
- ✅ MinIO对象存储集成
- ✅ RESTful API接口
- ✅ CORS跨域支持

## 技术栈

- Node.js
- Express.js
- MinIO (对象存储)
- Multer (文件上传)
- UUID (唯一标识)

## 环境要求

- Node.js >= 14.0.0
- MinIO Server

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动MinIO服务

确保MinIO服务运行在 `localhost:9000`，默认凭据：
- Access Key: `minioadmin`
- Secret Key: `minioadmin`

### 3. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

服务器将在 `http://localhost:3000` 运行。

## API接口

### 初始化上传
```
POST /api/upload/init
Content-Type: application/json

{
  "fileName": "example.zip"
}
```

响应:
```json
{
  "uploadId": "uuid-string",
  "fileName": "example.zip"
}
```

### 上传分片
```
POST /api/upload/upload-part?fileName=example.zip&uploadId=uuid&partNumber=1
Content-Type: application/octet-stream

[文件二进制数据]
```

响应:
```json
{
  "success": true,
  "partNumber": 1,
  "etag": "文件ETag"
}
```

### 完成上传
```
POST /api/upload/complete
Content-Type: application/json

{
  "fileName": "example.zip",
  "uploadId": "uuid-string",
  "parts": [
    {"partNumber": 1, "etag": "etag1"},
    {"partNumber": 2, "etag": "etag2"}
  ]
}
```

响应:
```json
{
  "success": true,
  "fileName": "example.zip",
  "objectName": "completed/123456789-example.zip",
  "url": "http://localhost:9000/uploads/completed/123456789-example.zip"
}
```

### 查询上传状态
```
GET /api/upload/status/:uploadId
```

响应:
```json
{
  "fileName": "example.zip",
  "partsUploaded": 5,
  "createdAt": 1234567890000
}
```

## 配置说明

环境变量配置在 `.env` 文件中：

```properties
# 服务器端口
PORT=3000

# MinIO配置
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=uploads
```

## 前端集成

此后端与Vue前端完美配合，前端上传工具位于 `client-front-vue/src/utils/upload.js`。

## 目录结构

```
server/
├── server.js          # 主服务器文件
├── package.json       # 项目依赖配置
├── .env              # 环境变量配置
└── README.md         # 项目文档
```

## 注意事项

1. 确保MinIO服务正常运行
2. 分片大小建议在5MB-100MB之间
3. 上传过程中保持网络稳定
4. 支持并发上传多个文件