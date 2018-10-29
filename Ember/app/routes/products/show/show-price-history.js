import Route from '@ember/routing/route';


export default Route.extend({
    model(){
      return [{
          x: ['2013-10-04 22:23:00','2013-11-01 22:23:00', '2013-11-04 22:23:00', '2013-12-04 22:23:00'],
          y: [1, 2, 3, 6],
          type: 'scatter',
          name: 'Price'
      },{
        x: ['2013-10-10 22:23:00', '2013-11-01 22:23:00', '2013-11-14 22:23:00', '2013-12-30 22:23:00'],
        y: [3, 2, 1.8, 1.5],
        type: 'scatter',
        name: 'Cost'
      }]
    }

});
