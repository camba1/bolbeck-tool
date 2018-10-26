import Route from '@ember/routing/route';


export default Route.extend({
    model(){
      return [{
        x: [1,2,3],
        y: [2,4,6],
        type: 'scatter'
      },{
        x: [0,10],
        y: [10,-10],
        type: 'scatter'
      }]
    }

});
