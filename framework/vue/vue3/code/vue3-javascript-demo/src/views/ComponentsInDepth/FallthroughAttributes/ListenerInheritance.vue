<template>
    <div>
        <MyButtonCom @click="onClickFun"></MyButtonCom>
    </div>
</template>

<script setup>
import MyButtonCom from './components/MyButton.vue';

function onClickFun() {
    console.log('ListenerInheritance onClick');
}

</script>