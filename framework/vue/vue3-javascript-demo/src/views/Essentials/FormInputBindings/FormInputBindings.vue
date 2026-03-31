<template>
    <div>
        <div class="demo-item">
            <span>Multiline message is:</span>
            <p style="white-space: pre-line;">{{ message }}</p>
            <textarea v-model="message" placeholder="add multiple lines"></textarea>
        </div>
        <div class="demo-item">
            <textarea>{{ textareaA }}</textarea>
            <textarea v-model="textareaB"></textarea>
        </div>
        <div class="demo-item">
            <button @click="textarea">textarea</button>
        </div>
        <div class="demo-item">
            <input type="checkbox" id="checkbox" v-model="checked" />
            <label for="checkbox">{{ checked }}</label>
        </div>
        <div class="demo-item">
            <div>Checked names: {{ checkedNames }}</div>

            <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
            <label for="jack">Jack</label>

            <input type="checkbox" id="john" value="John" v-model="checkedNames" />
            <label for="john">John</label>

            <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
            <label for="mike">Mike</label>
        </div>
        <div class="demo-item">
            <div>Picked: {{ picked }}</div>

            <input type="radio" id="one" value="One" v-model="picked" />
            <label for="one">One</label>

            <input type="radio" id="two" value="Two" v-model="picked" />
            <label for="two">Two</label>
        </div>
        <div class="demo-item">
            <div>Selected: {{ selected }}</div>

            <select v-model="selected">
                <option disabled value="">Please select one</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
            </select>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const message = ref('')
const textareaA = ref('textareaA')
const textareaB = ref('textareaB')
function textarea() {
    console.log(textareaA);
    console.log(textareaA.value);
    console.log(textareaB);
    console.log(textareaB.value);
}
const checked = ref(true)
const checkedNames = ref([]);
const picked = ref('')
const selected = ref('')
</script>