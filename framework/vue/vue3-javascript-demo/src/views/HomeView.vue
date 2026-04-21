<template>
  <div>
    <!-- 在模板里多次使用同一个计算属性 -->
    <p>全名: {{ fullName }}</p>
    <p>全名: {{ fullName }}</p>
    <p>全名: {{ fullName }}</p>

    <button @click="updateName">更新名字</button>

    <div class="box"></div>

    <div class="box2"></div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const firstName = ref("张");
const lastName = ref("三");

const fullName = computed(() => {
  // 我们在里面放一个“探测器”
  console.log("计算属性 fullName 执行了！");
  return firstName.value + " " + lastName.value;
});

const updateName = () => {
  firstName.value = "李";
};
</script>

<style scoped lang="scss">
.box {
  width: 100px;
  height: 100px;
  // background-color: red;
  background: url(../assets/logo.svg);
}

.box2 {
  width: 100px;
  height: 100px;
  // background-color: red;
  background: url(@/assets/logo.svg);
}
</style>
