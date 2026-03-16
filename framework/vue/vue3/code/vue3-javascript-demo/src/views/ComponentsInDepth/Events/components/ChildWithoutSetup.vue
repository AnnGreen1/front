<template>
    <div>
        <div class="demo-item">
            <button @click="$emit('msgParent')">msgParent</button>
        </div>
        <div class="demo-item">
            <button @click="$emit('msgParentValue', 'emit抛出的值（事件参数）')">msgParentValue</button>
        </div>
        <div class="demo-item">
            <button @click="$emit('msgParentValues', 'emit抛出的值（事件参数）','参数2','参数3')">msgParentValues</button>
        </div>
    </div>
</template>
