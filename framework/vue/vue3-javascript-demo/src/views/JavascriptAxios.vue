<template>
  <div>
    JavascriptAxios.vue
    <div>{{ count }}</div>
    <div>{{ ping() }}</div>
  </div>
</template>

<script setup>
// https://httpbin.org/get

// const res = await fetch("https://httpbin.org/get");
// res.json().then((data) => {
//   console.log(data);
// });

import { computed, onMounted } from "vue";

const count = computed(() => {
  console.log("count");
  return 1;
});

const ping = () => {
  console.log("ping");
  return "pong";
};

onMounted(() => {
  console.log(count.value);
  ping();
});
</script>
