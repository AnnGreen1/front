Page({
  data: {
    options: [{
        label: '北京',
        value: 'beijing'
      },
      {
        label: '上海',
        value: 'shanghai'
      },
      {
        label: '广州',
        value: 'guangzhou'
      },
      {
        label: '深圳',
        value: 'shenzhen'
      },
      {
        label: '杭州',
        value: 'hangzhou'
      }
    ],
    selectedValue: '',
    selectedLabel: '',
    cityOptions: [{
        label: '北京',
        value: 'beijing'
      },
      {
        label: '上海',
        value: 'shanghai'
      },
      {
        label: '广州',
        value: 'guangzhou'
      },
      {
        label: '深圳',
        value: 'shenzhen'
      }
    ],
    jobOptions: [{
        label: '工程师',
        value: 'engineer'
      },
      {
        label: '设计师',
        value: 'designer'
      },
      {
        label: '产品经理',
        value: 'pm'
      },
      {
        label: '市场运营',
        value: 'marketing'
      }
    ],
    selectedCity: '',
    selectedJob: '',
    selectedCityLabel: '',
    selectedJobLabel: ''
  },

  onLoad() {
    // 初始化选中项
    this.updateSelectedLabel(this.data.selectedValue);

    // 初始化页面点击事件处理
    this.handlePageTap = (e) => {
      // 获取所有下拉组件实例
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]

      if (currentPage.selectDropdowns) {
        Object.values(currentPage.selectDropdowns).forEach(instance => {
          if (instance.data.showDropdown) {
            // 获取组件位置信息
            instance.createSelectorQuery().select('.select-container').boundingClientRect(rect => {
              if (rect) {
                const {
                  x,
                  y
                } = e.detail
                const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
                if (!isInside) {
                  instance.closeDropdown()
                }
              }
            }).exec()
          }
        })
      }
    }
  },

  onCityChange(e) {
    const {
      value,
      label
    } = e.detail
    this.setData({
      selectedCity: value,
      selectedCityLabel: label
    })
  },

  onJobChange(e) {
    const {
      value,
      label
    } = e.detail
    this.setData({
      selectedJob: value,
      selectedJobLabel: label
    })
  },

  // 更新选中项的标签
  updateSelectedLabel(value) {
    const selectedItem = this.data.options.find(item => item.value === value);
    if (selectedItem) {
      this.setData({
        selectedLabel: selectedItem.label
      });
    }
  },

  // 选择变化事件
  onSelectChange(e) {
    const {
      value,
      label
    } = e.detail;
    this.setData({
      selectedValue: value,
      selectedLabel: label
    });
    console.log('选中值:', value, '选中标签:', label);
  },

  // 如果需要手动关闭下拉框
  closeDropdown() {
    this.selectComponent('#mySelect').closeDropdown();
  }
});