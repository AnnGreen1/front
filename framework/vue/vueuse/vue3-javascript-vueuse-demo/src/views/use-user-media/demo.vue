<script setup lang="ts">
import { useDevicesList, useUserMedia } from "@vueuse/core";
import { reactive, shallowRef, useTemplateRef, watchEffect, ref } from "vue";
import { ImageCapture } from "image-capture";

const currentCamera = shallowRef<string>();
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find((i) => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId;
  },
});

const video = useTemplateRef<HTMLVideoElement>("video");
const { stream, enabled } = useUserMedia({
  constraints: reactive({ video: { deviceId: currentCamera } }),
});

watchEffect(() => {
  if (video.value) video.value.srcObject = stream.value!;
  setTimeout(() => {
    video.value?.play();
    console.log(video.value?.readyState);
  });
});

function videoCanPlay(e) {
  console.log("videoCanPlay", e);
}

watchEffect(() => {
  console.log("cameras", cameras.value);
  console.log("stream changed", stream.value);
  console.log("stream changed", stream.value?.getVideoTracks());
  if (stream.value) {
    let captureDevice = new ImageCapture(stream.value?.getVideoTracks()[0]);
    if (captureDevice) {
      captureDevice
        .takePhoto()
        .then((blob) => {
          console.log(blob);
          img.value = URL.createObjectURL(blob);
        })
        .catch();
      // captureDevice.grabFrame().then(processFrame).catch(stopCamera);
    }
  }
});

const img = ref("");
</script>

<template>
  <div class="flex flex-col gap-4 text-center">
    <div>
      <button @click="enabled = !enabled">
        {{ enabled ? "Stop" : "Start" }}
      </button>
    </div>

    <div>
      currentCamera:{{ currentCamera }}
      <div
        v-for="camera of cameras"
        :key="camera.deviceId"
        class="px-2 py-1 cursor-pointer"
        :class="{ 'text-primary': currentCamera === camera.deviceId }"
        @click="currentCamera = camera.deviceId"
      >
        {{ camera.label }}🤣{{ camera.deviceId }}
      </div>
    </div>
    <div>
      <video
        ref="video"
        muted
        autoplay
        controls
        class="h-100 w-auto"
        @canplay="videoCanPlay"
      />
      <img :src="img" style="width: 300px" alt="" />
    </div>
  </div>
</template>
