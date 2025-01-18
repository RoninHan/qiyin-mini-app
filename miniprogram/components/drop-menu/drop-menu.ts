// components/drop-menu/drop-menu.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    option: {
      type: Array,
      value: [],
    },
    value: {
      type: Number,
      value: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isDropdownOpen: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // Toggle the dropdown menu
    toggleDropdown() {
      this.setData({
        isDropdownOpen: !this.data.isDropdownOpen
      });
    },

    // Select an item from the dropdown
    selectItem(event) {
      const selectedItem = event.currentTarget.dataset.item;
      this.setData({
        value: selectedItem.value,
        isDropdownOpen: false, // 选择后关闭下拉菜单
      });

      // 触发父组件的事件，通知选中的项
      this.triggerEvent('change', {
        value: selectedItem.value,
        label: selectedItem.label,
      });
    }
  }
})