<template>
<div>

</div>
</template>

<script setup>
import { watchEffect } from 'vue'
import { useWebSocket } from '@vueuse/core'

const { status, data, close } = useWebSocket('ws://localhost:8080', {
    autoReconnect: true,
})

watchEffect(() => {
    console.log(status.value)
    console.log(data.value)
})
</script>

<style lang="scss" scoped></style>