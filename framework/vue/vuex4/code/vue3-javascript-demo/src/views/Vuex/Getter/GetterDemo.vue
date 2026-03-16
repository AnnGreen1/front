<template>
    <!-- {{ store.state.count }} -->
   <!-- <button @click="incrementFun">state.count++</button> -->
</template>

<script setup>
import store from '@/store/main.js'

console.log(store.state.todos);
console.log(store.getters.doneTodos);
console.log(store.getters.doneTodosCount);
console.log(store.getters.getTodoById(2));
// function incrementFun(){
//     store.commit('increment');
//     console.log(store.state.count);
// }

</script>