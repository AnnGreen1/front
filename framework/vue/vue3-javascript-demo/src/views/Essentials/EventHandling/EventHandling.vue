<template>
    <div>
        <div class="demo-item">
            {{ count }}
        </div>
        <div class="demo-item">
            <button @click="count++">内联事件处理器count++</button>
        </div>
        <div class="demo-item">
            <button @click="increase">方法事件处理器increase</button>
        </div>
        <div class="demo-item">
            <button @click="increaseParam(1)">内联事件处理器参数</button>
        </div>
        <div class="demo-item">
            函数名不加括号是方法事件处理器，函数名加了括号是内联事件处理器（这是在调用函数），这两种不一样
        </div>
        <div class="demo-item">
            <button @click="warn('msg', $event)">访问事件参数</button>
        </div>
        <div class="demo-item">
            <a @click.once="doThis">单击事件将停止传递</a>
        </div>
        <div class="demo-item">
            <input @keyup.enter="submit" />
            <input @keyup.a="inputa" />
        </div>
        <div class="demo-item">
            <button @click.left="left">left</button>
            <button @click.middle="middle">middle</button>
            <button @click.right="right">right</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
function increase() {
    count.value++
}
function increaseParam(parm) {
    count.value += parm
}
function warn(message, event) {
    console.log(event);
    // 这里可以访问原生事件
    if (event) {
        event.preventDefault()
    }
    alert(message)
}
function doThis() {
    console.log("doThis");
}
function submit() {
    console.log("submit");
}
function inputa() {
    console.log("输入了a");
}
function left() {
    console.log("left");
}
function middle() {
    console.log("middle");
}
function right() {
    console.log("right");
}
</script>