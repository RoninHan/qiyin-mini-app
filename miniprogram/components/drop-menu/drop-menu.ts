// components/drop-menu/drop-menu.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    option:[],
    value: '設備連接',
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedItem:{},
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
        selectedItem,
        isDropdownOpen: false
      });
    }
  }
})