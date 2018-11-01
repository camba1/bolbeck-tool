import Component from '@ember/component';
import nlp from 'compromise';

export default Component.extend({
  nlpText: '',
  actions: {
    goNlp(){
      var nlpDoc = nlp(this.nlpText);
      nlpDoc.normalize();
      alert(nlpDoc.out('text'));
      alert(nlpDoc.sentences().toNegative().out('text'));
          //nlpDoc.has('new (product|prod|prd)')
      if (nlpDoc.has('(product|prd|prod|prods|products|prds)')) {
        let myModule = 'products';
        if (nlpDoc.has('^new')) {
        //  this.transitionToRoute(`${module}.show`);
        }else if (nlpDoc.has('^(open|edit)')) {
          let afterModule = nlpDoc.match(('product|prd|prod|prods|products|prds')).after();
          let id = afterModule.numbers()[0];
        }else if (nlpDoc.has('^(delete|remove)')) {
          let afterModule = nlpDoc.match(('product|prd|prod|prods|products|prds')).after();
          let id = afterModule.numbers()[0];
        }
      }

    }  //End gonlp
  }

});
