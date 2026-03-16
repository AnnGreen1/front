<template>
    RootView
    <FooterViewVue />
</template>

<script setup>
/**
 * ! provide 和 inject 必须使用在一个组件与其深层组件（包括子组件）之间，而不能是兄弟组件之间
 */
import { ref, provide, readonly  } from "vue"
import FooterViewVue from "./FooterView.vue";
provide("message", 'Message to deep child!')
const refValue = ref('ref value')
provide("refvalue", refValue)



const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})

const readonlyCount = ref(0)
provide("readonlyCount", readonly(readonlyCount))
</script>