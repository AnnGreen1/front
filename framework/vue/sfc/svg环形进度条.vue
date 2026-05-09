<template>
  <svg class="progress-ring" width="110" height="110">
    <circle 
      class="progress-ring-background"
      r="50" 
      cx="55" 
      cy="55"
      stroke="#D6E1FF"
      stroke-width="10"
      fill="none"
    />
    <circle 
      class="progress-ring-foreground"
      r="50" 
      cx="55" 
      cy="55"
      :stroke-dasharray="strokeDasharray"
      :stroke-dashoffset="progressOffset"
      stroke="#6B93FF"
      stroke-width="10"
      fill="none"
    />
  </svg>
</template>
<script setup>
const RADIUS = 50
const currentPercent = ref(0) // 0-100

// 计算圆周长
const strokeDasharray = computed(() => 2 * Math.PI * RADIUS)

// 根据百分比计算偏移量
const progressOffset = computed(() => {
  const progress = currentPercent.value / 100
  return strokeDasharray.value * (1 - progress)
})

// 倒计时逻辑
setInterval(() => {
  currentPercent.value = (currentSpeechTime.value / MAX_SPEECH_TIME) * 100
}, 1000)
</script>
