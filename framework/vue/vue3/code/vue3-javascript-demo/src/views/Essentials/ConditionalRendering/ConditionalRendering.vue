<template>
    <div>
        <div class="demo-item" v-if="vif">
            v-if
        </div>
        <div class="demo-item" v-if="vifelse">
            v-if
        </div>
        <div class="demo-item" v-else>
            v-else
        </div>
        <div class="demo-item" v-if="velseif === 'A'">
            A
        </div>
        <div class="demo-item" v-else-if="velseif === 'B'">
            B
        </div>
        <div class="demo-item" v-else="velseif === 'C'">
            C
        </div>
        <div class="demo-item">
            <button @click="vif=!vif">v-if</button>
            <button @click="vifelse=!vifelse">v-if-else</button>
            <button @click="velseif='A'">A</button>
            <button @click="velseif='B'">B</button>
            <button @click="velseif='C'">C</button>
        </div>
        <div class="demo-item" v-show="show">
            路漫漫其修远兮，吾将上下而求索。
        </div>
        <div class="demo-item">
            <button @click="show=!show">I got it.</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const vif = ref(true)
const vifelse = ref(true)
const velseif = ref('A')
const show = ref(true)
</script>