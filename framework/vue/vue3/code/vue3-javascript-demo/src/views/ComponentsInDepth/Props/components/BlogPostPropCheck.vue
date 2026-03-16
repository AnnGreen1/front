<template>
    <div>
        <div class="demo-item">
            <h1>{{ propId }}-{{ propTitle }}</h1>
            <span>{{ propContent }}</span>
        </div>
    </div>
</template>
    
<script setup>
const props = defineProps({
    propId:Number,
    propTitle:String,
    propContent:{
        validator(value){
            return value.length > 5 
        }
    }
})
</script>
    