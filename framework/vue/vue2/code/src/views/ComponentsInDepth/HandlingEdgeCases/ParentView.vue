<template>
    <div>
        <button @click="$parent.count++">{{ $parent.count }}</button>
        <input type="text" ref="input" v-model="text" name="" id="">
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: "输入框文本"
        }
    }
}
</script>

<style lang="scss" scoped></style>