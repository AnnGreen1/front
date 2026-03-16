<template>
    <div>
        <div class="common-style">
            {{ cr }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const cr = ref('CommonRoute.vue')
</script>