<template>
  <div>
    <FancyButton>
      Click me!
      <!-- 插槽内容 -->
    </FancyButton>

    <FancyButton>
      <span style="color:red">Click me!</span>
      <!-- 插槽内容 -->
    </FancyButton>
    <FancyButton>
      {{ clickmeref }}
      <!-- 插槽内容 -->
    </FancyButton>

    <DefaultSlots></DefaultSlots>
    <DefaultSlots>自定义的内容</DefaultSlots>



    <NamedSlots>
      <template v-slot:header>
        标题内容放这里
      </template>
      <template v-slot:default>
        主要内容放这里
      </template>
      <template v-slot:footer>
        底部内容放这里
      </template>
    </NamedSlots>

    <div class="demo-item">
      <NamedSlots>
        <template v-slot:[slotName]>
          {{ slotName }}
        </template>
      </NamedSlots>
    </div>

    <button @click="slotName = 'header'">slotName='header'</button>
    <button @click="slotName = 'footer'">slotName='footer'</button>
    <button @click="slotName = 'default'">slotName='default'</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import FancyButton from "@/views/ComponentsInDepth/Slots/components/FancyButton.vue";
import DefaultSlots from "@/views/ComponentsInDepth/Slots/components/DefaultSlots.vue";
const clickmeref = ref('click me ref')

import NamedSlots from "./components/NamedSlots.vue";

const slotName = ref('header')
</script>
