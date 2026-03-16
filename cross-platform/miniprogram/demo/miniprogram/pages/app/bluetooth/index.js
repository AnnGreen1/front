const {
  TextDecoder,
  TextEncoder
} = require('text-encoding');
Page({
  data: {
    // 设备信息
    devices: [],
    connectedDeviceId: '',
    // 设备服务与特征值 (连接后根据实际情况确定)
    targetServiceId: '',
    targetCharReadId: '',
    targetCharWriteId: '',
    // 状态控制
    bluetoothEnabled: false,
    isOperating: false,
    isScanning: false,
    canRead: false,
    canWrite: false,
    statusText: '',
    // 日志
    logs: []
  },

  // 添加日志
  addLog(msg) {
    const time = new Date().toLocaleTimeString();
    const newLogs = [`[${time}] ${msg}`, ...this.data.logs.slice(0, 20)];
    this.setData({
      logs: newLogs
    });
    console.log(msg);
  },

  // 1. 初始化蓝牙模块
  initBluetooth() {
    this.setData({
      isOperating: true
    });
    this.addLog('初始化蓝牙模块...');
    wx.openBluetoothAdapter({
      success: (res) => {
        this.addLog('蓝牙适配器初始化成功');
        this.setData({
          bluetoothEnabled: true,
          isOperating: false
        });
        // 监听设备发现
        wx.onBluetoothDeviceFound(this.onDeviceFound.bind(this));
      },
      fail: (err) => {
        this.addLog(`初始化失败: ${err.errMsg}`);
        this.setData({
          isOperating: false
        });
        wx.showToast({
          title: '请开启手机蓝牙',
          icon: 'none'
        });
      }
    });
  },

  // 2. 开始扫描设备
  startScan() {
    this.addLog('开始扫描蓝牙设备...');
    this.setData({
      isScanning: true,
      devices: []
    }); // 清空列表重新扫描
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      success: () => this.addLog('扫描指令下发成功'),
      fail: (err) => {
        this.addLog(`扫描启动失败: ${err.errMsg}`);
        this.setData({
          isScanning: false
        });
      }
    });
  },

  // 2.1 发现设备的回调
  onDeviceFound(res) {
    const devices = res.devices;
    if (devices.length) {
      // 【关键修改】移除名称过滤，只过滤掉完全无名称且无信号的设备
      const newDevices = devices.filter(device =>
        // 保留有名称、或信号强度较好的设备
        device.name || (device.RSSI !== undefined && device.RSSI > -100)
      ).map(device => ({
        deviceId: device.deviceId,
        name: device.name || '[未知设备]',
        RSSI: device.RSSI,
        localName: device.localName || '',
        advertisServiceUUIDs: device.advertisServiceUUIDs || []
      }));

      if (newDevices.length) {
        const allDevices = [...this.data.devices, ...newDevices];
        // 去重逻辑
        const deviceMap = new Map();
        allDevices.forEach(device => {
          // 以deviceId为唯一标识
          if (!deviceMap.has(device.deviceId)) {
            deviceMap.set(device.deviceId, device);
          }
        });
        // 转换为数组并按信号强度排序（信号强的排前面）
        const uniqueDevices = Array.from(deviceMap.values()).sort((a, b) => {
          return (b.RSSI || -1000) - (a.RSSI || -1000);
        });

        this.setData({
          devices: uniqueDevices
        });
      }
    }
  },

  // 3. 停止扫描
  stopScan() {
    wx.stopBluetoothDevicesDiscovery({
      success: () => {
        this.addLog('已停止扫描');
        this.setData({
          isScanning: false
        });
      }
    });
  },

  // 4. 连接设备
  connectDevice(e) {
    const deviceId = e.currentTarget.dataset.id;
    const device = this.data.devices.find(d => d.deviceId === deviceId);
    this.addLog(`正在连接: ${device ? device.name : deviceId}`);

    this.setData({
      isOperating: true
    });
    wx.createBLEConnection({
      deviceId,
      timeout: 10000,
      success: () => {
        this.addLog('蓝牙连接成功');
        this.setData({
          connectedDeviceId: deviceId,
          isOperating: false,
          isScanning: false
        });
        this.stopScan();
        // 连接成功后，发现服务
        setTimeout(() => this.getServices(deviceId), 300);
      },
      fail: (err) => {
        this.addLog(`连接失败: ${err.errMsg}`);
        this.setData({
          isOperating: false
        });
      }
    });
  },

  // 5. 获取设备服务
  getServices(deviceId) {
    this.addLog('发现服务中...');
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        this.addLog(`发现 ${res.services.length} 个服务`);
        // 显示所有服务供调试
        res.services.forEach((service, index) => {
          this.addLog(`服务 ${index}: ${service.uuid} ${service.isPrimary ? '主要' : '次要'}`);
        });
        // 尝试查找通用或第一个可用的服务
        let targetService = null;
        // 可以在这里添加逻辑优先寻找特定服务，比如电池、设备信息服务等
        if (res.services.length > 0) {
          targetService = res.services[0];
          this.setData({
            targetServiceId: targetService.uuid
          });
          this.addLog(`将使用第一个服务: ${targetService.uuid}`);
          this.getCharacteristics(deviceId, targetService.uuid);
        } else {
          this.addLog('该设备没有发现任何服务');
        }
      },
      fail: (err) => this.addLog(`获取服务失败: ${err.errMsg}`)
    });
  },

  // 6. 获取服务特征值
  getCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        this.addLog(`发现 ${res.characteristics.length} 个特征值`);
        const chars = res.characteristics;
        // 显示所有特征值属性供调试
        chars.forEach((char, index) => {
          const props = [];
          if (char.properties.read) props.push('读');
          if (char.properties.write) props.push('写');
          if (char.properties.notify) props.push('通知');
          if (char.properties.indicate) props.push('指示');
          this.addLog(`特征值 ${index}: ${char.uuid} [${props.join(',')}]`);
        });
        // 判断特征值属性
        const canRead = chars.some(c => c.properties.read);
        const canWrite = chars.some(c => c.properties.write);
        const canNotify = chars.some(c => c.properties.notify || c.properties.indicate);

        // 保存第一个可读/可写的特征值ID（可根据需要修改为更智能的选择逻辑）
        const readChar = chars.find(c => c.properties.read);
        const writeChar = chars.find(c => c.properties.write);

        this.setData({
          canRead,
          canWrite,
          targetCharReadId: readChar ? readChar.uuid : '',
          targetCharWriteId: writeChar ? writeChar.uuid : ''
        });
        this.addLog(`功能: 读${canRead?'√':'×'} 写${canWrite?'√':'×'} 通知${canNotify?'√':'×'}`);

        // 如果设备支持通知，自动启用
        if (canNotify) {
          const notifyChar = chars.find(c => c.properties.notify || c.properties.indicate);
          if (notifyChar) {
            this.enableNotify(deviceId, serviceId, notifyChar.uuid);
          }
        }
      },
      fail: (err) => this.addLog(`获取特征值失败: ${err.errMsg}`)
    });
  },

  // 7. 启用特征值通知 (监听设备主动推送)
  enableNotify(deviceId, serviceId, characteristicId) {
    wx.notifyBLECharacteristicValueChange({
      deviceId,
      serviceId,
      characteristicId,
      state: true,
      success: () => {
        this.addLog('已启用数据通知监听');
        // 监听特征值变化
        wx.onBLECharacteristicValueChange(res => {
          if (res.deviceId === deviceId && res.characteristicId === characteristicId) {
            this.onCharValueChange(res.value);
          }
        });
      },
      fail: (err) => this.addLog(`启用通知失败: ${err.errMsg}`)
    });
  },

  // 7.1 处理接收到的数据
  onCharValueChange(buffer) {
    try {
      // 将ArrayBuffer转为16进制字符串显示 (通用方式)
      const hex = Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ');
      this.addLog(`收到数据(HEX): ${hex}`);
      // 尝试转为UTF-8字符串
      const text = new TextDecoder('utf-8', {
        fatal: false
      }).decode(buffer);
      if (text && text.length > 0) {
        this.setData({
          statusText: `收到: ${text.substring(0, 20)}${text.length > 20 ? '...' : ''}`
        });
      }
    } catch (e) {
      console.error('数据解析错误:', e);
    }
  },

  // 8. 读取数据
  readData() {
    const {
      connectedDeviceId,
      targetServiceId,
      targetCharReadId
    } = this.data;
    if (!connectedDeviceId || !targetCharReadId) {
      this.addLog('无可读特征值');
      return;
    }
    this.addLog('读取数据...');
    wx.readBLECharacteristicValue({
      deviceId: connectedDeviceId,
      serviceId: targetServiceId,
      characteristicId: targetCharReadId,
      success: () => this.addLog('读取指令发送成功'),
      fail: (err) => this.addLog(`读取失败: ${err.errMsg}`)
    });
  },

  // 9. 写入数据 (示例：发送 "Hello")
  writeData() {
    const {
      connectedDeviceId,
      targetServiceId,
      targetCharWriteId
    } = this.data;
    if (!connectedDeviceId || !targetCharWriteId) {
      this.addLog('无可写特征值');
      return;
    }
    const message = 'Hello'; // 要发送的数据
    const buffer = new TextEncoder().encode(message).buffer;

    this.addLog(`发送: "${message}"`);
    wx.writeBLECharacteristicValue({
      deviceId: connectedDeviceId,
      serviceId: targetServiceId,
      characteristicId: targetCharWriteId,
      value: buffer,
      success: () => this.addLog('写入成功'),
      fail: (err) => this.addLog(`写入失败: ${err.errMsg}`)
    });
  },

  // 10. 断开连接
  disconnect() {
    if (this.data.connectedDeviceId) {
      wx.closeBLEConnection({
        deviceId: this.data.connectedDeviceId
      });
      this.addLog('已断开连接');
    }
    wx.closeBluetoothAdapter();
    this.addLog('蓝牙模块已关闭');

    // 重置状态
    this.setData({
      devices: [],
      connectedDeviceId: '',
      bluetoothEnabled: false,
      canRead: false,
      canWrite: false,
      statusText: ''
    });
  },

  // 页面卸载时清理
  onUnload() {
    this.disconnect();
  }
});