<template>
    <div>
        <div class="common-style">
            Child.vue
            {{ props.foo }}-{{ props.bar }}
        </div>
        <div class="common-style">
            <button @click="emit('change')">emit('change')</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

const props = defineProps<{
    foo:string
    bar?:number
}>()

const emit = defineEmits(['change'])

</script>