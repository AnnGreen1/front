<template>
  <div class="jixiaokang">
    <div class="container">
      <div class="video"></div>
      <div class="info"></div>
      <div class="alarm"></div>
      <div class="action"></div>
      <div class="emotion"></div>
      <div class="heart-rate"></div>
    </div>
  </div>
</template>

<script></script>

<style scoped lang="scss">
.jixiaokang {
  width: 100%;
  height: 100%;

  .container {
    width: calc(100% - 20px - 20px);
    height: calc(100% - 30px - 15px);
    padding: 30px 20px 15px 20px;
    display: grid;
    // 定义 3 列，网格线分别为 1, 2, 3, 4
    grid-template-columns: 20% 20% 60%;
    // 定义 3 行，网格线分别为 1, 2, 3, 4
    grid-template-rows: 45% 27% 27%;
    gap: 10px;

    .video {
      // 占据第 1、2 列 (从网格线 1 到 3)
      grid-row: 1 / 2;
      grid-column: 1 / 3;
    }
    .info {
      // 占据第 1 列 (从网格线 1 到 2)
      grid-row: 2 / 3;
      grid-column: 1 / 2;
    }
    .action {
      // 占据第 2 列 (从网格线 2 到 3)
      grid-row: 2 / 3;
      grid-column: 2 / 3;
    }
    .emotion {
      // 占据第 1 列 (从网格线 1 到 2)
      grid-row: 3 / 4;
      grid-column: 1 / 2;
    }
    .heart-rate {
      // 占据第 2 列 (从网格线 2 到 3)
      grid-row: 3 / 4;
      grid-column: 2 / 3;
    }
    .alarm {
      // 占据第 3 列 (从网格线 3 到 4)，且跨越所有行 (1 到 4)
      grid-row: 1 / 4;
      grid-column: 3 / 4;
    }
  }
}
</style>
