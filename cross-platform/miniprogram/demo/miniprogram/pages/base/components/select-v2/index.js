Component({
  properties: {
    options: {
      type: Array,
      value: []
    },
    value: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: '请选择'
    }
  },

  data: {
    showDropdown: false,
    selectedOption: '',
    componentId: Math.random().toString(36).substring(2, 9) // 生成唯一ID
  },

  lifetimes: {
    attached() {
      // 将组件实例保存到页面中
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      currentPage.selectDropdowns = currentPage.selectDropdowns || {}
      currentPage.selectDropdowns[this.data.componentId] = this
    },
    detached() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage.selectDropdowns) {
        delete currentPage.selectDropdowns[this.data.componentId]
      }
    }
  },

  observers: {
    'value': function (val) {
      this.updateSelectedOption(val);
    }
  },

  methods: {
    updateSelectedOption(value) {
      const selectedItem = this.data.options.find(item => item.value === value);
      this.setData({
        selectedOption: selectedItem ? selectedItem.label : ''
      });
    },

    toggleDropdown() {
      this.setData({
        showDropdown: !this.data.showDropdown
      });

      // 关闭其他打开的下拉框
      if (this.data.showDropdown) {
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        if (currentPage.selectDropdowns) {
          Object.values(currentPage.selectDropdowns).forEach(instance => {
            if (instance !== this && instance.data.showDropdown) {
              instance.setData({
                showDropdown: false
              })
            }
          })
        }
      }
    },

    handleSelect(e) {
      const {
        value,
        label
      } = e.currentTarget.dataset;
      this.setData({
        value,
        selectedOption: label,
        showDropdown: false
      });
      this.triggerEvent('change', {
        value,
        label
      });
    },

    closeDropdown() {
      this.setData({
        showDropdown: false
      });
    }
  }
});