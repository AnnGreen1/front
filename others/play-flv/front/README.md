# FLV 直播流前端

基于 Vue.js和 flvjs实现的 FLV直播流播放器，通过 CDN 方式引入依赖。

## 功能特性

- 🎥 实时 FLV 流播放
- 📊 实时统计信息（缓冲区、下载量、速度）
- 🎨 现代化 UI 界面
- 📝 实时日志记录
- ⚡ 低延迟播放
- 🔄 自动重连机制

## 快速开始

### 方法 1：直接打开

直接在浏览器中打开 `index.html` 文件即可。

### 方法 2：使用本地服务器（推荐）

```bash
# 使用 Python
python -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080
```

然后访问：http://localhost:8080

## 使用说明

1. **启动后端服务**
   ```bash
   cd ../backend
   npm install
   npm start
   ```

2. **打开前端页面**
   - 直接双击打开 `index.html`
   - 或通过本地服务器访问

3. **开始播放**
   - 点击"▶️ 开始播放"按钮
   - 等待连接成功
   - 观看实时直播画面

4. **查看统计信息**
   - 播放时会自动显示实时统计
   - 点击"📊 刷新统计"手动更新

## 配置说明

### 修改流地址

在 `index.html` 中修改 `streamUrl`：

```javascript
data() {
  return {
    streamUrl: 'http://your-server:8000/live/stream.flv'
  };
}
```

### 播放器配置

```javascript
this.player = flvjs.createPlayer({
  type: 'flv',
  url: this.streamUrl,
  isLive: true,              // 直播模式
  autoplay: true,            // 自动播放
  enableStableBuffer: true,  // 稳定缓冲
  lazyLoadMaxDuration: 3 * 60, // 最大缓冲时长
  lazyLoadTimeout: 10000     // 懒加载超时
});
```

## 界面说明

### 控制按钮

- **▶️ 开始播放**: 连接并开始播放 FLV 流
- **⏹️ 停止播放**: 断开连接并停止播放
- **📊 刷新统计**: 手动刷新播放统计信息

### 状态显示

- **播放状态**: 显示当前播放器状态
- **流地址**: 显示当前连接的流媒体地址
- **统计信息**: 
  - 缓冲区大小 (KB)
  - 已下载数据量 (KB)
  - 实时下载速度 (KB/s)

### 日志区域

显示所有操作日志，包括：
- ℹ️ 信息日志（蓝色）
- ✅ 成功日志（绿色）
- ⚠️ 警告日志（黄色）
- ❌ 错误日志（红色）

## 浏览器兼容性

**支持的浏览器：**
- Chrome ✓
- Firefox ✓
- Edge ✓
- Safari ✓ (需要 Media Source Extensions 支持)

**要求：**
- 支持 Media Source Extensions API
- 支持 ES6

## 技术栈

- **Vue.js 2.7.14**: 渐进式 JavaScript 框架
- **flv.js 1.6.2**: Bilibili 开源的 FLV 播放器
- **CDN**: jsDeliver

## 自定义样式

可以通过修改 `<style>` 部分来自定义界面：

```css
/* 修改主题色 */
.header {
  background: linear-gradient(135deg, #你的颜色 0%, #你的颜色 100%);
}

.btn-primary {
  background: linear-gradient(135deg, #你的颜色 0%, #你的颜色 100%);
}
```

## 常见问题

### 1. 播放失败/无法连接

**检查项：**
- 后端服务是否已启动
- 流地址是否正确
- 防火墙是否阻止连接
- 浏览器控制台是否有错误信息

### 2. 画面卡顿

**解决方案：**
- 降低后端 FFmpeg 的推流分辨率
- 调整网络带宽
- 减少缓冲配置

### 3. 声音不同步

**解决方案：**
- 检查 FFmpeg 推流参数
- 调整 `enableStableBuffer` 配置
- 尝试不同的 `lazyLoadTimeout` 值

### 4. CORS 错误

如果遇到跨域问题，确保后端配置了：

```javascript
const config = {
  http: {
    allow_origin: '*'  // 允许所有来源
  }
};
```

## 性能优化建议

1. **降低延迟**：
   - 使用 `isLive: true` 启用直播模式
   - 减少缓冲时长配置

2. **提高稳定性**：
   - 启用 `enableStableBuffer`
   - 设置合理的 `lazyLoadTimeout`

3. **节省带宽**：
   - 根据网络情况调整视频码率
   - 使用适当的分辨率

## 扩展功能

可以添加的功能：
- [ ] 全屏播放
- [ ] 音量控制
- [ ] 截图功能
- [ ] 录制功能
- [ ] 多流切换
- [ ] 画质选择
- [ ] 弹幕功能

## 依赖 CDN 链接

```
<!-- Vue.js (Runtime 版本 - 推荐) -->
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.runtime.min.js"></script>

<!-- flv.js -->
<script src="https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js"></script>
```

**说明：**
- `vue.runtime.min.js` 是运行时版本，体积更小（~30KB），性能更好
- `vue.min.js` 是完整版（包含编译器），体积较大（~80KB）
- 本项目使用 runtime 版本即可满足需求

## 开发调试

打开浏览器开发者工具：
- **Console**: 查看详细日志
- **Network**: 监控网络请求
- **Performance**: 分析性能问题

## 许可证

MIT License
