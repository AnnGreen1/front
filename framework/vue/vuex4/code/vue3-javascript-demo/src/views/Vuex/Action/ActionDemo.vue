<template>
  {{ store.state.count }}
  <button @click="incrementActionFun">incrementActionFun</button>
  <button @click="incrementAsyncPayloadFun">incrementActionFun</button>
</template>

<script setup>
import store from "@/store/index.js";

console.log(store.state.count);

function incrementActionFun() {
  store.dispatch("incrementAsync");
  console.log(new Date() + " ", store.state.count);
}

function incrementAsyncPayloadFun() {
  store.dispatch("incrementAsyncPayload", {
    amount: 10,
  });
  console.log(new Date() + " ", store.state.count);
}
</script>
