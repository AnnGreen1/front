<template>
  <div class="app-layout">
    <div class="header">Header</div>
    <div class="sidebar">Sidebar</div>
    <div class="main" id="main-content">
      <el-button @click="showDialog = true">打开对话框</el-button>
      <!-- <div id="dia" style="width: 600px; height: 600px"></div> -->
      <el-dialog
        v-model="showDialog"
        title="自定义范围对话框"
        :append-to="'#dia'"
        :modal-append-to-body="false"
        custom-class="restricted-dialog"
      >
        <p>这个对话框的遮罩只会覆盖主要内容区域</p>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const showDialog = ref(false);
</script>

<style scoped>
.app-layout {
  display: grid;
  grid-template:
    "header header" 60px
    "sidebar main" 1fr
    / 200px 1fr;
}

.header {
  grid-area: header;
}
.sidebar {
  grid-area: sidebar;
}
.main {
  grid-area: main;
}
</style>

<style>
/* 全局样式 */
.el-overlay {
  position: absolute;
  left: 200px;
  top: 60px;
  width: calc(100% - 200px);
  height: calc(100% - 60px);
}

.restricted-dialog {
  margin-top: 60px !important;
  margin-left: 200px !important;
}
</style>
