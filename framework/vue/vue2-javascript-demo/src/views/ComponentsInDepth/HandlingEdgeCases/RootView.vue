<template>
    <div>
        <button @click="$root.foo++">{{ $root.foo }}</button>
        <ParentView ref="parentviewref" />
    </div>
</template>

<script>
import ParentView from './ParentView.vue';
export default {
    components: { ParentView },
    data() {
        return {
            count: 0
        }
    },
    mounted() {
        setTimeout(() => {
            this.$refs.parentviewref.text = '父组件中更改默认内容'
        }, 3000)
        setTimeout(() => {
            // 先访问到子组件实例，再通过子组件的 $refs 访问到子组件中模板中的 ref
            this.$refs.parentviewref.$refs.input.focus()
        }, 3000)
    }
}
</script>

<style lang="scss" scoped></style>