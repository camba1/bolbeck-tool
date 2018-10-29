import Controller from '@ember/controller';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.chartLayout = {title: 'Price History'};
    //this.chartOptions = {displayModeBar: false};
  }//,
  // actions: {
  //   chartEvent(eventName, pointsClicked){
  //     console.log(eventName)
  //   }
  // }
});
