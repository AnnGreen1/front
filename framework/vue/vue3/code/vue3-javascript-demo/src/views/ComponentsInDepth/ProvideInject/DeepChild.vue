<template>
    {{ message }}-{{ refvalue }}
    <button @click="updateLocation">{{ location }}</button>
</template>

<script setup>
import { inject } from 'vue';

const message = inject('message')
console.log(message);
const refvalue = inject('refvalue')
console.log(refvalue);
console.log(refvalue.value);

const blank = inject('black')
console.log(blank);

const defaultValue = inject('default', '默认值')
console.log(defaultValue);


const { location, updateLocation } = inject('location')

const readonlyCount = inject('readonlyCount')
console.log(readonlyCount);
console.log(readonlyCount.value);   // 0
// 尝试修改一个 readOnly 的 provide
readonlyCount.value = 100; // [Vue warn] Set operation on key "value" failed: target is readonly. 
console.log(readonlyCount.value);   // 0 修改失败
</script>