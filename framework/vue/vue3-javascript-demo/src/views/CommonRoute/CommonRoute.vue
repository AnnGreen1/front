<template>
    <div>
        <div class="demo-item">
            {{ cr }}
        </div>
        <div class="demo-item">
            <input type="text" :value="text">
        </div>
        <div class="demo-item">
            <button @click="log">log text</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const cr = ref('CommonRoute.vue')

const text = ref('aaaa')
function log(){
    console.log(text);
    console.log(text.value);
}
</script>