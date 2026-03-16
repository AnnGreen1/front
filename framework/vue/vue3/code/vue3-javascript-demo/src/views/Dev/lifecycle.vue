<template>
    <div>
        lifecycle.vue
    </div>
</template>

<script setup>
import { 
 created, 
// beforeMount, mounted, 
// beforeUpdate, updated, 
// beforeUnmount, unmounted, 
// activated, deactivated, 
// errorCaptured, 
// renderTracked, 
// renderTriggered, 
// serverPrefetch 
} from 'vue'

beforeCreate(() => {
  // 文本内容应该与当前的 `count.value` 一致
  console.log('beforeCreate')
})
</script>