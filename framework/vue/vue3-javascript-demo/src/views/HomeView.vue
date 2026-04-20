<template>
  <div class="">
    <div style="background: pink;padding: 100px;" @click="pink">
      <div style="background: cyan;padding: 100px;" @click="cyan">
        <input type="text" v-model.number="a" />
        <input type="text" v-model.number="b" />
        <div style="background: red;" @click="red">{{ sum }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, isRef, onMounted, reactive, ref } from 'vue'

const a = ref(0)
const b = ref(0)
const sum = computed(() => {
  console.log('计算了')
  return a.value + b.value
})
onMounted(() => {
  sessionStorage.setItem('test', '123')

})

const pink = () => {
  console.log('pink')
}

const cyan = () => {
  console.log('cyan')
}

const red = () => {
  console.log('red');

}
</script>
