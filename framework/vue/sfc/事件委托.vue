<template>
    <div>
        <ul @click="handleListClick">
            <li id="item1">Item 1</li>
            <li id="item2">Item 2</li>
            <li id="item3">Item 3</li>
            <li id="item4">Item 4</li>
        </ul>
    </div>
</template>

<script setup>
const handleListClick = (event) => {
    // 检查被点击的元素是否是 LI 元素
    if (event.target && event.target.tagName === 'LI') {
        console.log('List item ', event.target.id.replace('item', ''), ' was clicked!');
        alert('你点击了: ' + event.target.textContent);
    }
};
</script>

<style lang="scss" scoped>

</style>