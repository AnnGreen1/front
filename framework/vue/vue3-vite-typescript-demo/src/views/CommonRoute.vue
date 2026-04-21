<template>
  <div>
    <div class="common-style">CommonRoute.vue</div>
    <button @click="handleClick">???</button>
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, isRef, inject, reactive } from "vue";
const commonRoute = ref("CommonRoute.vue");
const temp = reactive({ message: "Hello World" });

console.log(commonRoute)
console.log(temp);





console.log(isRef(commonRoute));

const num = 0;
console.log(isRef(num));

const message = inject("message");

const handleClick = () => {
  console.log("Button clicked!");
  message.value += "?";
};
</script>
