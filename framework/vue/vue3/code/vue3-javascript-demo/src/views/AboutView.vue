<script setup>
import { reactive, ref } from "vue";
import Comp from "./comp.vue";
const theme = {
  color: "pink",
};
const size = ref(10);
const plus = () => {
  size.value *= 2;
  console.log(size.value);
};


// const countR = reactive({count: 0})
// console.log(countR);
// console.log(countR.count);
// countR.count++;
// console.log(countR);



// let state = reactive({ count: 0 })
// console.log(state);
// state.count++
// console.log(state);
// // 上面的 ({ count: 0 }) 引用将不再被追踪
// // (响应性连接已丢失！)
// state = reactive({ count: 1 })
// console.log(state);
// state.count++
// console.log(state);



// const count = ref(0)
// const state = reactive({
//   count
// })

// console.log(state.count) // 0

// state.count = 1
// console.log(count.value) // 1


const count = ref(0)
const object = { id: ref(1) }

</script>

<template>
<p @click="plus">hello</p>
{{ count + 1 }}
{{ object.id + 1 }}
{{ theme.color }}

<Comp :type="1"></Comp>
</template>

<style scoped>
p {
  color: v-bind("theme.color");

  font-size: v-bind(`$ { size}px`);
}
</style>