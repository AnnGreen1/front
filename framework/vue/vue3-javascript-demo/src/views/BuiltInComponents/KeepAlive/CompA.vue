<template>
  <p>Current component: A</p>
  <span>count: {{ count }}</span>
  <button @click="count++">+</button>
  <button @click="toB">toB</button>
</template>

<script>
export default {
  name: "CompA",
};
</script>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const count = ref(0);
const toB = () => {
  router.push({ path: "/BuiltInComponents/KeepAlive/CompB" });
};
</script>
