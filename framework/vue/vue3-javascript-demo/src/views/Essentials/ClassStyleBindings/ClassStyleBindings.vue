<template>
    <div>
        <div class="demo-item">
            绑定数组
            <div :class="[square, pink]"></div>
        </div>
        <div class="demo-item">
            绑定对象
            <div :class="{ square: isRound, round: !isRound, pink: isHotpink, 'hot-pink': !isHotpink }"></div>
        </div>
        <div class="demo-item">
            <button @click="isRound = !isRound">Round or Square</button>
            <button @click="isHotpink = !isHotpink">Pink or Hotpink</button>
        </div>
        <div class="demo-item">
            在组件上使用，单个根元素
            <blog class="blog-color blog-fontsize"></blog>
        </div>
        <div class="demo-item">
            在组件上使用，多个根元素（传过去的class需要在子组件已经有了）
            <blogMultipleRoots class="blog-color"></blogMultipleRoots>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import blog from './Components/blog.vue'
import blogMultipleRoots from './Components/blogMultipleRoots.vue';
const square = ref('square')
const pink = ref('pink')


const isRound = ref(true)
const isHotpink = ref(true)
</script>

<style lang="scss" scoped>
.square {
    width: 100px;
    height: 100px;
}

.round {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.pink {
    background: pink;
}

.hot-pink {
    background: hotpink;
}
.blog-color{
    color:pink;
}
.blog-fontsize{
    font-size: 20px;
}
</style>