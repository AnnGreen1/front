<template>
    <div>
        <div class="demo-item">
            <p>Has published books:</p>
            <span>{{ publishedBooksMessage }}</span>
        </div>
        <div class="demo-item">
            <input type="text" v-model="firstName"><br />
            <input type="text" v-model="lastName"><br />
            <input type="text" v-model="fullName"><br />
            {{ fullName }}
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const author = reactive({
    name: 'John Doe',
    books: [
        'Vue 2 - Advanced Guide',
        'Vue 3 - Basic Guide',
        'Vue 4 - The Mystery'
    ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
    return author.books.length > 0 ? 'Yes' : 'No'
})



const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
    // getter
    get() {
        console.log('get');
        return firstName.value + ' ' + lastName.value
    },
    // setter
    set(newValue) {
        console.log('set');
        // 注意：我们这里使用的是解构赋值语法
        [firstName.value, lastName.value] = newValue.split(' ')
    }
})
</script>