<template>
    {{ store.state.count }}
        <button @click="incrementPayloadFun">incrementPayloadFun</button>
        <button @click="incrementPayloadObjectFun">incrementPayloadObjectFun</button>
</template>

<script setup>
import store from '@/store/index.js'

function incrementPayloadFun(){
    store.commit('incrementPayload', 10)
}

function incrementPayloadObjectFun(){
    store.commit('incrementPayloadObject', {plus:1, minus:2, multiple:3, division:4})
}
</script>