import Component from '@ember/component';

export default Component.extend({
  actions: {
    updateParentData() {
      this.updateDate();
    },
    deleteParentData() {
      this.deleteData();
    }
  }
});
