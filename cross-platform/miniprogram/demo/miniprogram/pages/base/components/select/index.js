Component({
  properties: {
    // 下拉选项列表
    options: {
      type: Array,
      value: []
    },
    // 默认选中的值
    value: {
      type: String,
      value: ''
    },
    // 占位文本
    placeholder: {
      type: String,
      value: '请选择'
    }
  },

  data: {
    showDropdown: false, // 是否显示下拉框
    selectedOption: '' // 当前选中的选项文本
  },

  observers: {
    'value': function (val) {
      this.updateSelectedOption(val);
    }
  },

  methods: {
    // 更新选中的选项文本
    updateSelectedOption(value) {
      const selectedItem = this.data.options.find(item => item.value === value);
      this.setData({
        selectedOption: selectedItem ? selectedItem.label : ''
      });
    },

    // 切换下拉框显示状态
    toggleDropdown() {
      this.setData({
        showDropdown: !this.data.showDropdown
      });
    },

    // 选择选项
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

    // 关闭下拉框（可在页面中调用）
    closeDropdown() {
      this.setData({
        showDropdown: false
      });
    }
  }
});