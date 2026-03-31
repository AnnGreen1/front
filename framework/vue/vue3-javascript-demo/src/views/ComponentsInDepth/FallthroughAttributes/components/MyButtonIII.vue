<template>
    <button>button</button>
    <span>Fallthrough attribute: {{ $attrs }}</span>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { useAttrs } from 'vue';
const attrs = useAttrs()
console.log(attrs);
console.log(attrs.style);
</script>
