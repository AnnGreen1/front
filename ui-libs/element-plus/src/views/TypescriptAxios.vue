<template>
    <div>
        <div class="common-style">
            TypescriptAxios.vue
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { randqinghua } from '../api/api'

onMounted(() => {
    let randqinghua_data = { 'format': 'json' }
    randqinghua(randqinghua_data).then((res) => {
        console.log(res)
    }).catch((error) => {
        console.log(error);
    })
});
</script>