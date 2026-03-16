<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const msg = ref("");
const toA = () => {
  router.push({ path: "/BuiltInComponents/KeepAlive/CompA" });
};
</script>
<script>
export default {
  name: "CompB",
};
</script>
<template>
  <p>Current component: B</p>
  <span>Message is: {{ msg }}</span>
  <input v-model="msg" />
  <button @click="toA">toA</button>
</template>
