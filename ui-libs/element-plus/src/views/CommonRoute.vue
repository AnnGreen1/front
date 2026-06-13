<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="name" label="名称" width="180" />
    <el-table-column label="输入值">
      <template #default="{ row }">
        <el-input v-model="row.inputValue" placeholder="请输入内容" />
      </template>
    </el-table-column>
    <el-table-column prop="desc" label="描述" />
  </el-table>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: '第一项', inputValue: '', desc: '这是第一行' },
  { id: 2, name: '第二项', inputValue: '', desc: '这是第二行' },
  { id: 3, name: '第三项', inputValue: '', desc: '这是第三行' },
])
</script>