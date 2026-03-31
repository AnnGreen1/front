<template>
    <div>
        <div class="demo-item">
            <input ref="input" />
        </div>
        <div class="demo-item" ref="demo" id="test">

        </div>
        <div class="demo-item">
            <ul>
                <li v-for="item in list" ref="itemRefs">
                    {{ item }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)
const demo = ref(null)

const list = ref([
    "张三",
    "李四",
    "王五"
])
const itemRefs = ref([])

onMounted(() => {
    console.log(input);
    console.log(input.value);
    input.value.focus()


    console.log(demo);
    console.log(demo.value);
    const div = document.getElementById('test')
    console.log(div.className);
    div.style.border = 'solid'

    console.log(itemRefs.value)
})
</script>