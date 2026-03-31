<template>
    <div>
        <div class="demo-item">
            <BlogPostPropArray title="BlogPostPropArrayProps" />
        </div>
        <div class="demo-item">
            <BlogPostPropObject title="BlogPostPropObject" />
        </div>
        <div class="demo-item">
            <BlogPostWithoutSetup title="BlogPostWithoutSetup" />
        </div>
        <div class="demo-item">
            <BlogPostPropArray :title="BlogPostPropArrayPropsDynamic" />
        </div>
        <div class="demo-item">
            传入Number类型值
            <BlogPostPropArray :title="12" />
            <BlogPostPropArray :title="NumberProp" />
        </div>
        <div class="demo-item">
            传入Boolean类型值
            <BlogPostPropArray title />
            <BlogPostPropArray :title="false" />
            <BlogPostPropArray :title="BooleanProp" />
        </div>
        <div class="demo-item">
            传入Array类型值
            <BlogPostPropArray :title="[234, 266, 273]" />
            <BlogPostPropArray :title="ArrayProp" />
        </div>
        <div class="demo-item">
            传入Object类型值
            <BlogPostPropArray :title="{
                name: '屈原',
                words: '路漫漫其修远兮，吾将上下而求索。'
            }" />
            <BlogPostPropArray :title="ObjectProp" />
        </div>
        <div class="demo-item">
            <BlogPostUpdateTitle title="修改prop" />
        </div>
        <div class="demo-item">
            <BlogPostPropCheck :propId="propId"  propTitle="合适的标题" propContent="这一定是lenght大于5的内容" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

import BlogPostPropArray from './components/BlogPostPropArray.vue';
import BlogPostPropObject from './components/BlogPostPropObject.vue';
import BlogPostWithoutSetup from './components/BlogPostWithoutSetup.vue';
import BlogPostUpdateTitle from './components/BlogPostUpdateTitle.vue';
import BlogPostPropCheck from './components/BlogPostPropCheck.vue';
const ComponentsInDepth = ref('ComponentsInDepth')

const BlogPostPropArrayPropsDynamic = ref('动态prop')
const NumberProp = ref('99')
const BooleanProp = ref(true)
const ArrayProp = ref([1, 2, 3, 4, 5])
const ObjectProp = ref({
    name: '屈原',
    words: '路漫漫其修远兮，吾将上下而求索。'
})
const ObjectAsProp = {
    name: '屈原',
    words: '路漫漫其修远兮，吾将上下而求索。'
}
const propId = ref(1)
</script>