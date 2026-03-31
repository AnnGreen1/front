<template>
    <div>
        <hello-slots>Slots</hello-slots>
        <hello-slots></hello-slots>
        <named-slots>
            <template v-slot:header>
                <h1>Here might be a page title</h1>
            </template>

            <p>A paragraph for the main content.</p>
            <p>And another one.</p>

            <template v-slot:footer>
                <p>Here's some contact info</p>
            </template>
        </named-slots>

        <scoped-slots>
            <!-- 从文件的写法上来看，这里好像属于父组件鹅作用域，但是通过这种方法确实是访问到了子组件作用域-->
            <template v-slot:default="slotProps">
                {{ slotProps.user.firstName }}
            </template>
        </scoped-slots>
        <!--另一种缩写语法-->
        <scoped-slots v-slot:default="slotProps">{{ slotProps.user.firstName }}</scoped-slots>
    </div>
</template>

<script>
import HelloSlots from './HelloSlots.vue';
import NamedSlots from './NamedSlots.vue';
import ScopedSlots from './ScopedSlots.vue'
export default {
    components: { HelloSlots, NamedSlots, ScopedSlots }
}
</script>

<style lang="scss" scoped></style>