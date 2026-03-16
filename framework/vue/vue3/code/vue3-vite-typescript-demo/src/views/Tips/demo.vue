<template>
  <Child foo="fooprops" :bar="barprops" @change="changefun" />
  <div class="common-style">
      {{ title }}
  </div>
  <div class="common-style">
    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { ref, reactive} from 'vue'
import Child from "./components/Child.vue";

const title = ref("title");
const barprops = ref(9)
const data = reactive({
  userName:"xiaoming",
  age:18
})

const changefun = () =>{
  console.log('changefun');
  
}
</script>
