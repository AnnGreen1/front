// composables/useSharedMedia.js
import { ref, watch } from "vue";

// 全局单例
let sharedStream = null;
let currentConstraints = null;
let usersCount = 0; // 引用计数

export const cameraStream = ref(null);

/**
 * 获取共享 MediaStream
 * @param {MediaStreamConstraints} constraints
 */
export async function acquireStream(constraints) {
  usersCount++;

  // 如果已有流且约束相同，复用
  if (
    sharedStream &&
    JSON.stringify(constraints) === JSON.stringify(currentConstraints)
  ) {
    cameraStream.value = sharedStream;
    return sharedStream;
  }

  // 不同约束或没有流 → 创建新流
  if (sharedStream) {
    stopStream(); // 停掉之前的流
  }

  sharedStream = await navigator.mediaDevices.getUserMedia(constraints);
  currentConstraints = constraints;
  cameraStream.value = sharedStream;

  // 监听 track 结束
  sharedStream.getTracks().forEach((track) => {
    track.onended = () => {
      sharedStream = null;
      cameraStream.value = null;
    };
  });

  return sharedStream;
}

/**
 * 释放流引用
 */
export function releaseStream() {
  usersCount--;

  if (usersCount <= 0) {
    stopStream();
    usersCount = 0;
  }
}

/**
 * 停掉流
 */
export function stopStream() {
  if (sharedStream) {
    sharedStream.getTracks().forEach((track) => track.stop());
    sharedStream = null;
    cameraStream.value = null;
    currentConstraints = null;
  }
}