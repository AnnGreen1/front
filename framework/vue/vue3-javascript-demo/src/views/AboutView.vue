<template>
  <Comp @increaseBy="plus"></Comp>
</template>

<script setup>
import { ref } from "vue";
import Comp from "./comp.vue";
const theme = {
  color: "pink",
};
const size = ref(10);
const plus = () => {
  console.log(size.value);
};
</script>
