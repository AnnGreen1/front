<template>
<div>
    {{ props.type }}
    {{ type }}
</div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
    type: Number
})

// const type = ref('hi')

onMounted(() => {
    console.log(props.type)
})
</script>

<style lang="scss" scoped></style>