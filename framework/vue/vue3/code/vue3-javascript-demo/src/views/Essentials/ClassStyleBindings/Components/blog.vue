<template>
    <div class="blog">
        <div class="blog-title">
            blog title
        </div>
        <div class="blog-body">
            blog body
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style lang="scss" scoped>
.blog{
    border: solid;
    width:200px;
    height:100px;
    padding:5px;
    &-title{
        margin:5px;
        border: solid;
    }
    &-body{
        margin:5px;
        border: solid;
    }
}
</style>