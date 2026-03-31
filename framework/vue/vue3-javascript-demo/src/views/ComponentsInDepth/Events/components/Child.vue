<template>
    <div>
        <div class="demo-item">
            <button @click="msgParent">msgParent</button>
        </div>
        <div class="demo-item">
            <button @click="msgParentValue">msgParentValue</button>
        </div>
        <div class="demo-item">
            <button @click="msgParentValues">msgParentValues</button>
        </div>
    </div>
</template>

<script setup>
/**
 * 如果一个原生事件的名字 (例如 click) 被定义在 emits 选项中，则监听器只会监听组件触发的 click 事件而不会再响应原生的 click 事件。
 */
// const emit = defineEmits(['msgParent', 'msgParentValue', 'msgParentValues'])
function msgParent() {
    emit('msgParent')
}
function msgParentValue() {
    emit('msgParentValue', 'emit抛出的值（事件参数）')
}
function msgParentValues() {
    emit('msgParentValues', 'emit抛出的值（事件参数）', '参数2', '参数3')
}
</script>