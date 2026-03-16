<template>
    <div>
        <div class="demo-item">
            {{ data }}
        </div>
        <div class="demo-item">
            {{ dataEffect }}
        </div>
    </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'

const url = ref('https://api.uomg.com/api/rand.qinghua?format=json')
const data = ref(null)

async function fetchData() {
    const response = await fetch(url.value)
    data.value = await response.json()
}

// 立即获取
fetchData()
// ...再侦听 url 变化
watch(url, fetchData)

/**
 * 使用watchEffect
 */
const dataEffect = ref(null)
watchEffect(async () => {
    const response = await fetch(url.value)
    dataEffect.value = await response.json()
})
</script>