<template>
    <div>
        <div class="demo-item">
            <h1>{{ title }}</h1>
            <span>BlogPostPropArray</span>
        </div>
    </div>
</template>
    
<script setup>
const props = defineProps(['title'])
// ❌ 警告！prop 是只读的！
// props.title = "修改"
console.log(props.title);
</script>