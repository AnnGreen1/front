<template>
    <div>
        {{ ComponentsInDepth }}
    </div>
</template>

<script setup>
import { ref } from 'vue'
const ComponentsInDepth = ref('ComponentsInDepth')
</script>