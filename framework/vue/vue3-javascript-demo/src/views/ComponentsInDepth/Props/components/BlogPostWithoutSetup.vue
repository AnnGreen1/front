<template>
    <div>
        <div class="demo-item">
            <h1>{{ title }}</h1>
            <span>BlogPostWithoutSetup</span>
        </div>
    </div>
</template>
    
<script>
export default {
  props: ['title'],
  setup(props) {
    // setup() 接收 props 作为第一个参数
    console.log(props.title)
  }
}
</script>
    