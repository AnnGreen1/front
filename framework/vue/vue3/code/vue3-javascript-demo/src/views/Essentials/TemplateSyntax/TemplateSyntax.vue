<template>
    <div>
        <div class="demo-item">
            文本插值，“Mustache”语法 (即双大括号){{ Essentials }}
        </div>
        <div class="demo-item">
            原始 HTML， 使用<span v-html="rawHtml"></span>指令
        </div>
        <div class="demo-item">
            布尔型 Attribute 绑定，使用<button :disabled="isButtonDisabled">v-bind</button><button :disabled="''">:disabled="''"</button>
        </div>
        <div class="demo-item">
            <div id="container" class="wrapper">
                动态绑定多个值
            </div>
        </div>
        <div class="demo-item">
            使用 JavaScript 表达式
            <div>{{ number + 1 }}</div>
            <div>{{ ok ? 'YES' : 'NO' }}</div>
            <div>{{ message.split('').reverse().join('') }}</div>
            <div :id="`list-${id}`">:id="`list-${id}`"</div>
            <div :id="'list-'+id">:id="'list-'+id"</div>
        </div>
        <div class="demo-item">
            调用函数{{ datenow() }}
        </div>
        <div class="demo-item">
            动态参数<a v-bind:[attributeName]="url">Vue3 </a>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const Essentials = ref('即双大括号')
const rawHtml = "<span style='color:pink;'>v-html</span>"
const isButtonDisabled = ref(true)
const objectOfAttrs = {
    id: 'container',
    class: 'wrapper'
}
const number = ref(8)
const OK = ref(0)
const message = ref('Hello Vue3')
const id = ref('item')
const datenow = function(){
    return new Date()
}
const url = ref('https://cn.vuejs.org/')
const attributeName = ref('href')
</script>

<style lang="scss" scoped>
#container {
    width: 100px;
    height: 100px;
}

.wrapper {
    background-color: rgb(109, 209, 176);
    color: hotpink;
}

#list-item{
    background: pink;
}
</style>