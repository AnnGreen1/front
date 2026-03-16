<template>
    {{ store.state.count }}
   <button @click="incrementFun">state.count++</button>
</template>

<script setup>
import store from '@/store/index.js'

console.log(store.state.count);

function incrementFun(){
    store.commit('increment');
    console.log(store.state.count);
}

</script>