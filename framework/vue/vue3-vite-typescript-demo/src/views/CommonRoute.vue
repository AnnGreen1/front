<script setup lang="ts">
import MarkdownRender from 'markstream-vue'
import { ref, onMounted } from 'vue'

const content = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/content.md')
    const fullContent = await response.text()
    
    let i = 0
    const interval = setInterval(() => {
      if (i < fullContent.length) {
        content.value += fullContent[i]
        i++
      } else {
        clearInterval(interval)
      }
    }, 50)
  } catch (error) {
    console.error('Failed to load markdown file:', error)
  }
})
</script>

<template>
  <MarkdownRender :content="content" />
</template>
