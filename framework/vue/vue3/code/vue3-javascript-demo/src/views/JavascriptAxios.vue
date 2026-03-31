<template>
    <div>
        JavascriptAxios.vue,{{ msg }}
    </div>
</template>

<script>
import { randqinghua } from '@/api/api'
export default {
    data() {
        return {
            msg: "Hello, JavascriptAxios!"
        }
    },
    methods: {

    },
    beforeCreate() {
        console.log("beforeCreate")
        // console.log(this.msg)
        // this.msg = "beforeCreate"
        // console.log(this.msg)
    },
    created() {
        console.log(this.msg)
    }
}
</script>