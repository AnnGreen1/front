<template>
    <div>
        <div class="demo-item">
            在script标签使用setup
            <button @click="increment">
                {{ state.count }}
            </button>
        </div>
        <div class="demo-item">
            <button @click="mutateDeeply">
                深层响应性
            </button>
            <div>{{ obj.nested }} {{ obj.arr }}</div>
        </div>
        <div class="demo-item">
            <button @click="incrementRef">
                {{ count }} <!-- 无需 .value -->
            </button>
        </div>
        <div class="demo-item">
            {{ object.foo + 1 }}
        </div>
        <div class="demo-item">
            {{ object.foo + 1 }}
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const state = reactive({ count: 0 })

function increment() {
    state.count++
}

const obj = reactive({
    nested: { count: 0 },
    arr: ['foo', 'bar']
})

function mutateDeeply() {
    // 以下都会按照期望工作
    obj.nested.count++
    obj.arr.push('baz')
}
/**
 * 为保证访问代理的一致性，对同一个原始对象调用reactive() 会总是返回同样的代理对象，
 * 而对一个已存在的代理对象调用 reactive() 会返回其本身
 */
console.log(reactive(state) === state)


const count = ref(0)

function incrementRef() {
    count.value++
}

const object = { foo: ref(1) }


const countII = ref(0)
const stateII = reactive({
  countII
})

console.log(stateII.countII) // 0

stateII.countII = 1
console.log(countII.value) // 1






const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
map.get('count').value++
console.log(map.get('count').value)
</script>