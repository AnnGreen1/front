<template>
  <button @click="$emit('increaseBy', 1)">Increase by 1</button>
</template>

<script setup>
import { onMounted } from "vue";
</script>

<style lang="scss" scoped></style>
