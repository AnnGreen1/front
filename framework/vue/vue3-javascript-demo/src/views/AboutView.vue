<template>
  <div class="jixiaokang">
    <button @click="pushNum">push</button>
    <button @click="popNum">pop</button>
    <button @click="update">update</button>
    <div>{{ nums }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nums: []
    }
  },
  methods: {
    pushNum() {
      this.nums.push(Math.floor(Math.random() * 100))
    },
    popNum() {
      this.nums.pop()
    },
    update() {
      this.nums[0] = Math.floor(Math.random() * 100)
    }
  }
}
</script>
