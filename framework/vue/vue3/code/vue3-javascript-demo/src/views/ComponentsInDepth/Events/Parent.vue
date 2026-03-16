<template>
    <div>
        <div class="demo-item">
            <ChildWithoutSetup @msgParent="msgParentFun" @msgParentValue="msgParentValueFun" @msgParentValues="msgParentValuesFun" />
        </div>
        <div class="demo-item">
            <Child @msgParent="msgParentFun" @msgParentValue="msgParentValueFun" @msgParentValues="msgParentValuesFun" />
        </div>
        <div class="demo-item">
            <CustomInput v-model="searchText" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ChildWithoutSetup from './components/ChildWithoutSetup.vue';
import Child from './components/Child.vue';
import CustomInput from './components/CustomInput.vue'
function msgParentFun(){
    console.log("msgParentFun");
}
function msgParentValueFun(value){
    console.log(value);
}
function msgParentValuesFun(value1,value2,value3){
    console.log(value1);
    console.log(value2);
    console.log(value3);
}
const searchText = ref('searchText')
</script>