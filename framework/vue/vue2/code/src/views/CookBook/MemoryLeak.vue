<template>
  <div>
    <button v-if="showChoices" @click="hide">Hide</button>
    <button v-if="!showChoices" @click="show">Show</button>
    <div v-if="showChoices">
      <select id="choices-single-default"></select>
    </div>
  </div>
</template>

<script>
import Choices from "choices.js";
export default {
  data() {
    return {
      showChoices: true,
    };
  },
  mounted: function () {
    this.initializeChoices();
  },
  methods: {
    initializeChoices: function () {
      let list = [];
      // 我们来为选择框载入很多选项
      // 这样的话它会占用大量的内存
      for (let i = 0; i < 1000; i++) {
        list.push({
          label: "Item " + i,
          value: i,
        });
      }
      new Choices("#choices-single-default", {
        searchEnabled: true,
        removeItemButton: true,
        choices: list,
      });
    },
    show: function () {
      this.showChoices = true;
      this.$nextTick(() => {
        this.initializeChoices();
      });
    },
    hide: function () {
      this.showChoices = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>