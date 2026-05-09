<template>
  <video ref="videoRef" autoplay playsinline></video>
</template>

<script setup>
import { onMounted, onUnmounted, nextTick, ref } from "vue";
import { acquireStream, releaseStream, cameraStream } from "../../composables/useSharedMedia";

const videoRef = ref(null);

onMounted(async () => {
  const stream = await acquireStream({
    video: {
      deviceId: localStorage.getItem("cameraDeviceId") || undefined,
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
    },
    audio: false
  });

  nextTick(() => {
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.play();
    }
  });
});

onUnmounted(() => {
  releaseStream();
});
</script>