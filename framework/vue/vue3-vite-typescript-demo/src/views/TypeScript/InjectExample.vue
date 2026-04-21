<template>
  <div class="inject-container">
    <h3>Inject 示例 (消费者)</h3>
    <p>注入的主题: {{ injectedTheme }}</p>
    <p>注意：点击上方 Provide 组件的按钮，这里的主题也会同步更新。</p>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { themeKey } from './ProvideExample.vue'; // 导入相同的 Symbol key

// 定义注入数据的类型接口
interface ThemeContext {
  theme: string;
  toggleTheme: () => void;
}

// 注入数据
// 第二个参数是默认值，以防没有找到提供者
const themeContext = inject<ThemeContext>(themeKey, {
  theme: 'default',
  toggleTheme: () => console.warn('No provider found')
});

// 使用注入的数据
const injectedTheme = computed(() => themeContext?.theme || 'unknown');
</script>

<style scoped>
.inject-container {
  padding: 15px;
  border: 1px solid #aaa;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.05);
}
</style>