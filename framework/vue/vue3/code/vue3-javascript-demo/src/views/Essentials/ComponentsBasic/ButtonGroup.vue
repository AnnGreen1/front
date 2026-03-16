<template>
    <div>
        <div class="demo-item">
            <h1>Here is a child component!</h1>
        </div>
        <div class="demo-item">
            <ButtonCounter />
            <ButtonCounter />
            <ButtonCounter />
            <ButtonCounter />
        </div>
        <div class="demo-item">
            <BlogPost title="My journey with Vue" />
            <BlogPost title="Blogging with Vue" />
            <BlogPost title="Why Vue is so fun" />
        </div>
        <div class="demo-item" :style="{ fontSize: postFontSize + 'em' }">
            <BlogPost v-for="post in posts" :key="post.id" :title="post.title" @enlarge-text="postFontSize += 0.1" />
        </div>
        <div class="demo-item">
            <AlertBox>
                Something bad happened.
            </AlertBox>
        </div>
        <div class="demo-item">
            <button
       v-for="(_, tab) in tabs"
       :key="tab"
       :class="['tab-button', { active: currentTab === tab }]"
       @click="currentTab = tab"
     >
      {{ tab }}
    </button>
	  <component :is="tabs[currentTab]" class="tab"></component>
        </div>
    </div>
</template>

<script setup>
import ButtonCounter from './components/ButtonCounter.vue'
import BlogPost from './components/BlogPost.vue'
import AlertBox from './components/AlertBox.vue'

import Home from './components/Home.vue'
import Posts from './components/Posts.vue'
import Archive from './components/Archive.vue'

import { ref } from 'vue'
const posts = ref([
    { id: 1, title: 'My journey with Vue' },
    { id: 2, title: 'Blogging with Vue' },
    { id: 3, title: 'Why Vue is so fun' }
])
const postFontSize = ref(1)


const currentTab = ref('Home')

const tabs = {
  Home,
  Posts,
  Archive
}
</script>

<style>


.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>