<script setup>
import { ref, computed, watch, reactive ,watchEffect} from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const name = reactive({
  lastName: 'Smith',
  firstName: 'Jane'
})

const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})

watch(firstName, () => {
  console.log('firstName changed')
}, {
  once: true
})

watch(lastName, () => {
  console.log('lastName changed')
})

watch(name, () => {
  console.log('name changed')
})


const todoId = ref(1)
const data = ref(null)
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
</script>

<template>
  <div>
    <p>First Name: {{ firstName }}</p>
    <p>Last Name: {{ lastName }}</p>
    <p>Full Name: {{ fullName }}</p>
    <input type="text" v-model="firstName">
    <input type="text" v-model="name.lastName">
    <input v-model="fullName" placeholder="Enter full name" />


    <input v-model="todoId" />
    {{ data }}
  </div>
</template>