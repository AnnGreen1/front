<template>
    <div class="blog-title" v-bind="$attrs">
        blog title
    </div>
    <div class="blog-body">
        blog body
    </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style lang="scss" scoped>
.blog-title {
    margin: 5px;
    border: solid;
}

.blog-body {
    margin: 5px;
    border: solid;
}
.blog-color{
    color:pink;
}
</style>