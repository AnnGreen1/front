<template>
  <div class="demo">
    <div>嵌套路由</div>

    <router-view v-slot="{ Component }">
      <!-- <keep-alive :include="['ComA', 'ComB']"> -->
      <keep-alive :include="['CompA']">
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
  </div>
</template>
