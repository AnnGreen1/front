<template>
    <div>
        <div class="demo-item">
            <h1>{{ title }}</h1>
            <span>BlogPostPropArray</span>
        </div>
    </div>
</template>
    
<script setup>
const props = defineProps({title:String})

console.log(props.title);
</script>