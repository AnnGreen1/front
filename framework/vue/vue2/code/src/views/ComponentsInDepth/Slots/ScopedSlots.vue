<template>
    <div>
        <span>
            <slot :user="user">{{ user.lastName }}</slot>
        </span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                lastName: '子组件lastname',
                firstName: '子组件firstName'
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>