const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testUploadAPI() {
  try {
    console.log('🚀 开始测试上传API...');
    
    // 1. 测试初始化上传
    console.log('\n1. 测试初始化上传...');
    const initResponse = await axios.post(`${API_BASE}/upload/init`, {
      fileName: 'test-file.txt'
    });
    console.log('✅ 初始化成功:', initResponse.data);
    
    const { uploadId, fileName } = initResponse.data;
    
    // 2. 测试上传分片
    console.log('\n2. 测试上传分片...');
    const testChunk = Buffer.from('Hello World! This is a test chunk.');
    const uploadPartResponse = await axios.post(
      `${API_BASE}/upload/upload-part?fileName=${fileName}&uploadId=${uploadId}&partNumber=1`,
      testChunk,
      {
        headers: { 'Content-Type': 'application/octet-stream' }
      }
    );
    console.log('✅ 分片上传成功:', uploadPartResponse.data);
    
    // 3. 测试获取上传状态
    console.log('\n3. 测试获取上传状态...');
    const statusResponse = await axios.get(`${API_BASE}/upload/status/${uploadId}`);
    console.log('✅ 状态查询成功:', statusResponse.data);
    
    // 4. 测试完成上传
    console.log('\n4. 测试完成上传...');
    const completeResponse = await axios.post(`${API_BASE}/upload/complete`, {
      fileName,
      uploadId,
      parts: [{
        partNumber: 1,
        etag: uploadPartResponse.data.etag
      }]
    });
    console.log('✅ 上传完成:', completeResponse.data);
    
    console.log('\n🎉 所有API测试通过！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 如果直接运行此脚本则执行测试
if (require.main === module) {
  testUploadAPI();
}

module.exports = { testUploadAPI };