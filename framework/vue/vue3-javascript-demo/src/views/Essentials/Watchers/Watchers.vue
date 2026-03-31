<template>
    <div>
        <div class="demo-item">
            <p>
                Ask a yes/no question:
                <input v-model="question" />
            </p>
            <p>{{ answer }}</p>
        </div>
        <div class="demo-item">
            <button @click="x++">x++</button>
            <button @click="y++">y++</button>
            <button @click="obj.count++">{{ obj.count }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 可以直接侦听一个 ref
watch(question, async (newQuestion, oldQuestion) => {
    if (newQuestion.indexOf('?') > -1) {
        answer.value = 'Thinking...'
        try {
            const res = await fetch('https://yesno.wtf/api')
            console.log(res);
            answer.value = (await res.json()).answer
        } catch (error) {
            answer.value = 'Error! Could not reach the API. ' + error
        }
    }
})

const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})

// 侦听响应式对象的属性值
const obj = reactive({ count: 0 })

watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)

watch(
  obj,
  (newValue, oldValue) => {
    console.log(newValue === oldValue);
    console.log(`count is: ${obj.count}`)
  },
  { deep:true }
)
</script>