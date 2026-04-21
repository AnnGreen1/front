<template>
  <div class="provide-container" :style="{ backgroundColor: themeColor, color: textColor }">
    <h2>Provide 示例 (提供者)</h2>
    <p>当前主题: {{ theme }}</p>
    <button @click="toggleTheme">切换主题</button>
    
    <div class="child-component">
      <!-- 这里可以嵌套 InjectExample 组件来测试跨层级通信 -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue';

// 定义提供的数据类型接口
interface ThemeContext {
  theme: string;
  toggleTheme: () => void;
}

// 响应式状态
const theme = ref<'light' | 'dark'>('light');

// 计算属性，根据主题返回颜色
const themeColor = computed(() => theme.value === 'light' ? '#ffffff' : '#333333');
const textColor = computed(() => theme.value === 'light' ? '#000000' : '#ffffff');

// 切换主题的方法
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

// 提供数据和方法
// 使用 Symbol 作为 key 可以避免命名冲突，特别是在大型项目中
const themeKey = Symbol('themeKey');

provide(themeKey, {
  theme,
  toggleTheme
} as ThemeContext);

// 为了方便子组件直接注入，也可以提供一个字符串 key 的版本，或者导出 symbol
export { themeKey };
</script>

<style scoped>
.provide-container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 200px;
  transition: background-color 0.3s, color 0.3s;
}

.child-component {
  margin-top: 20px;
  padding: 10px;
  border: 1px dashed #999;
}

button {
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 10px;
}
</style>