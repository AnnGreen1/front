
<template>
<div class="demo-item">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>

<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
