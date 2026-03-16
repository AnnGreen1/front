<template>
   <div>
    <div class="demo-item">
        <button @click="count++">You clicked me {{ count }} times.</button>
    </div>
   </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>