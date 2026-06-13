<template>
    <div>
        {{ Essentials }}
    </div>
</template>

<script>
export default {
    name: 'Essentials',
    data() {
        return {
            Essentials: 'Essentials'
        }
    },
    setup() {
        console.log('Essentials setup')
        return {}
    },
    beforeCreate() {
        console.log('Essentials beforeCreate')
    },
    created() {
        console.log('Essentials created')
    },
    beforeMount() {
        console.log('Essentials beforeMount')
    },
    mounted() {
        console.log('Essentials mounted')
    },
}
</script>