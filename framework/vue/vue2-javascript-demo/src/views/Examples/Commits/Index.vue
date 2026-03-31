<template>
  <div class="Commits">
    <h1>Latset Vue.js Commits</h1>
    <div v-for="branch in branches" :key="branch">
      <input
        type="radio"
        name="branch"
        :id="branch"
        :value="branch"
        :key="branch"
        v-model="currentBranch"
      />
      <label :for="branch" >{{ branch }}</label>
    </div>
    <p>vuejs/vue@{{ currentBranch }}</p>
    <ul>
      <li v-for="record in commits" :key="record.html_url">
        <a :href="record.html_url" target="_blank" class="commit">{{
          record.sha.slice(0, 7)
        }}</a>
        - <span class="message">{{ record.commit.message | truncate }}</span
        ><br />
        by<span class="author">
          <a :href="record.author.html_url" target="_blank">{{
            record.commit.author.name
          }}</a>
        </span>
        at<span class="date">{{ record.commit.author.date | formatDate }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      branches: ["main", "dev"],
      currentBranch: "main",
      commits: null,
    };
  },
  watch: {
    currentBranch: "fetchData",
  },
  filters: {
    truncate: function (v) {
      var newline = v.indexOf("\n");
      return newline > 0 ? v.slice(0, newline) : v;
    },
    formatDate: function (v) {
      return v.replace(/T|Z/g, " ");
    },
  },
  methods: {
    fetchData: function () {
      var apiURL =
        "https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha=";
      var xhr = new XMLHttpRequest();
      var self = this;
      xhr.open("GET", apiURL + self.currentBranch);
      xhr.onload = function () {
        self.commits = JSON.parse(xhr.responseText);
        console.log(self.commits[0].html_url);
      };
      xhr.send();
    },
  },
  created:function(){
    this.fetchData()
  }
};
</script>

<style lang="scss" scoped>
.Commits {
  font-family: "Helvetica", Arial, sans-serif;
  a {
    text-decoration: none;
    color: #f66;
  }
  li {
    line-height: 1.5em;
    margin-bottom: 20px;
  }
  .author,
  .date {
    font-weight: bold;
  }
}
</style>