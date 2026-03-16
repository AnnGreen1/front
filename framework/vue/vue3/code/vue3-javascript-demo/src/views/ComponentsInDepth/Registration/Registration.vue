<template>
    <div>
        <div class="demo-item">
            <ButtonCounter />
            <Button-Counter />
        </div>
        <div class="demo-item">
            Vue 支持将模板中使用 kebab-case 的标签解析为使用 PascalCase 注册的组件。这意味着一个以 MyComponent 为名注册的组件，在模板中可以通过 {{ cn }} 或
                {{ cnl }} 引用。
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ButtonCounter from './components/ButtonCounter.vue';
const cn = ref('<MyComponent>')
const cnl = ref('<my-component>')

</script>