<template>
    <div>
        <BaseButton BaseButtonText="BaseButtonText"></BaseButton>
        <div class="demo-item">
            {{ MyButtonIIText }}
        </div>
    </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue';
const props = defineProps(['MyButtonIIText','BaseButtonText'])
</script>