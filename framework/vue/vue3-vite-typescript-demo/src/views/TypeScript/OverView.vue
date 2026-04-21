<template>
  <div class="overview-container">
    <h1>TypeScript Overview</h1>
    
    <div class="common-style">
      over
    </div>

    <div class="demo-section">
      <h2>Provide / Inject 演示</h2>
      <ProvideExample>
        <InjectExample />
      </ProvideExample>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProvideExample from './ProvideExample.vue';
import InjectExample from './InjectExample.vue';

</script>

<style scoped>
.overview-container {
  padding: 20px;
}

.common-style {
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: 20px;
}

.demo-section {
  margin-bottom: 20px;
}

</style>
