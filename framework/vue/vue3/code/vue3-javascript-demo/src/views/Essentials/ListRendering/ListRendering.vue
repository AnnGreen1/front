<template>
    <div>
        <div class="demo-item">
            <li v-for="item in items">
                {{ item.message }}
            </li>
        </div>
        <div class="demo-item">
            <li v-for="(item, index) in items">
                {{ parentMessage }} - {{ index }} - {{ item.message }}
            </li>
        </div>
        <div class="demo-item">
            <li v-for="item of items">
                {{ item.message }}
            </li>
        </div>
        <div class="demo-item">

            <li v-for="value in myObject">
                {{ value }}
            </li>
        </div>
        <div class="demo-item">
            <li v-for="(value, key, index) in myObject">
                {{ index }}. {{ key }}: {{ value }}
            </li>
        </div>
        <div class="demo-item">
            <span v-for="n in 10">{{ n }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])

const myObject = reactive({
    title: 'How to do lists in Vue',
    author: 'Jane Doe',
    publishedAt: '2016-04-10'
})
</script>