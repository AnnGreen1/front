Component({
  data: {
    value: 'app',
    list: [{
        value: 'home',
        label: '首页'
      },
      {
        value: 'app',
        label: '应用'
      },
      {
        value: 'chat',
        label: '聊天'
      },
      {
        value: 'user',
        label: '我的'
      },
    ],
  },

  lifetimes: {
    ready() {
      const pages = getCurrentPages();
      const curPage = pages[pages.length - 1];
      if (curPage) {
        const nameRe = /pages\/(\w+)\/index/.exec(curPage.route);
        if (nameRe === null) return;
        if (nameRe[1] && nameRe) {
          this.setData({
            value: nameRe[1],
          });
        }
      }
    },
  },
  methods: {
    onChange(e) {
      const {
        value
      } = e.detail;
      wx.switchTab({
        url: `/pages/${value}/index`
      });
    },
  },
});