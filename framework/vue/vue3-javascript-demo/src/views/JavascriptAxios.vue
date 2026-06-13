<template>
  <div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue' 

onMounted(() => {
  console.log('mounted')

  console.log(localStorage.getItem('test'))
  console.log(sessionStorage.getItem('guy'))
})
</script>

<style lang="scss" scoped>

</style>