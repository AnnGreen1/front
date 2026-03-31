<template>
    <div>
        <div class="demo-item">
            {{ state.count }}
        </div>
        <div class="demo-item">
            <button @click="increment">
                {{ state.count }}
            </button>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue'

export default {
    setup() {
        const state = reactive({ count: 0 })

        function increment() {
            state.count++
        }

        // 不要忘记同时暴露 increment 函数
        return {
            state,
            increment
        }
    }
}
</script>