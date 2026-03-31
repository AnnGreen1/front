<template>
  <div>
    <div class="demo-item">
      <p v-mydirective>这是一个自定义指令示例</p>
    </div>
    <div class="demo-item">
      <input v-focus />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  directives: {
    mydirective: {
      inserted(el) {
        el.style.color = "red";
      },
    },
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.focus();
      },
    },
  },
};
</script>