import Component from '@ember/component';
import nlp from 'compromise';

export default Component.extend({
  nlpText: '',
  actions: {
    goNlp(){

      let myPlugin = {
        "patterns": {
          "^. (product|prd|prod|prods|products|prds)": "Prodmodule",
          "^. (customer|cust|customers|custs)": "Custmodule",
          "^. (order|ord|ords|orders|orde)": "Ordemodule",
          "^. (Organization|orgs|Organizations|org)": "Orgamodule",
          // "^. (customer kpi formulas|custkpiformula|customer kpi formulas|custkpiformulas)": "Custkpiformulasmodule",
          "^. (custkpiformula|custkpiformulas)": "Custkpiformulasmodule",
          "^new": "Newitem",
          "^(open|edit|explore)": "Edititem",
          "^(delete|del|remove|rem)": "Deleteitem"
        }
      };
      nlp.plugin(myPlugin);
      var nlpDoc = nlp(this.nlpText);
      this.normalizeOptions? nlpDoc.normalize(this.normalizeOptions) : nlpDoc.normalize();
      // alert(nlpDoc.out('text'));
      // alert(nlpDoc.sentences().toNegative().out('text'));
          //nlpDoc.has('new (product|prod|prd)')
      //let prodSearch = '^. (product|prd|prod|prods|products|prds)'
      // if (nlpDoc.has(prodSearch)) {
      let moduleInfo = determineModule(nlpDoc,myPlugin);
      if (moduleInfo.module != ''){
        let myModule = moduleInfo.module
        let myModuleSingular = moduleInfo.moduleSingular
        let mySearchPattern = moduleInfo.searchPattern
        if (nlpDoc.has('#Newitem')) {
          this.set("nlpText", "") ;
          this.get('router').transitionTo(`${myModule}.new`)
        }else if (nlpDoc.has('#Edititem')) {
          let afterModule = nlpDoc.after(mySearchPattern);
          let id = afterModule.values()
          if (id.length  == 0){
            alert(`Hmmm, which ${myModuleSingular} would you like to see?`)
          }else if (id.length  == 1){
            this.set("nlpText", "") ;
            this.get('router').transitionTo(`${myModule}.show.show-detail`, id.values(0).toNumber().out('normal'))
          }else {
            alert(`Hmmm, cannot open multiple ${myModule} at the same time. Would you like to search for them instead?`)
          }
        }else if (nlpDoc.has('#Deleteitem')) {
          let afterModule = nlpDoc.after(mySearchPattern);
          let id = afterModule.values();
      //    this.set("nlpText", "") ;
          let myClone = nlpDoc.clone();
          myClone.insertAt(0, 'system');
          alert(myClone.sentences().toContinuous().out('text'));
          alert(nlpDoc.sentences().toPastTense().out('text'));
        }else {
          this.set("nlpText", "") ;
          this.get('router').transitionTo(`${myModule}`)
        }
      // if (nlpDoc.has('#Prodmodule')) {
      //   let myModule = 'products';
      //   let myModuleSingular = nlp(myModule).nouns(0).toSingular().out('text');
      //   if (nlpDoc.has('#Newitem')) {
      //     this.set("nlpText", "") ;
      //     this.get('router').transitionTo(`${myModule}`)
      //   }else if (nlpDoc.has('#Edititem')) {
      //     let afterModule = nlpDoc.after('#Prodmodule');
      //     let id = afterModule.values()
      //     if (id.length  == 0){
      //       alert(`Hmmm, which ${myModuleSingular} would you like to see?`)
      //     }else if (id.length  == 1){
      //       this.set("nlpText", "") ;
      //       this.get('router').transitionTo(`${myModule}.show.show-detail`, id.values(0).toNumber().out('normal'))
      //     }else {
      //       alert(`Hmmm, cannot open multiple ${myModule} at the same time. Would you like to search for them instead?`)
      //     }
      //   }else if (nlpDoc.has('#Deleteitem')) {
      //     let afterModule = nlpDoc.after('#Prodmodule');
      //     let id = afterModule.values();
      // //    this.set("nlpText", "") ;
      //     let myClone = nlpDoc.clone();
      //     myClone.insertAt(0, 'system');
      //     alert(myClone.sentences().toContinuous().out('text'));
      //     alert(nlpDoc.sentences().toPastTense().out('text'));
      //   }else {
      //     this.set("nlpText", "") ;
      //     this.get('router').transitionTo(`${myModule}`)
      //   }
    }else {
      alert(`I am not sure what you want to do with ${nlpDoc.nouns(0).toPlural().toCamelCase().trim().out('text')}`)
      }
    }  //End gonlp
  }

});

//// TODO: Fix this crappy code where everything is hardcoded
function determineModule(nlpDoc, myPlugin){

  let returnValue = {searchPattern: '', module: '', moduleSingular: '' };
  for (var key in myPlugin.patterns) {
    if (myPlugin.patterns.hasOwnProperty(key) && myPlugin.patterns[key].endsWith('module') ) {
        let searchPattern = `#${myPlugin.patterns[key]}`
        if (nlpDoc.has(searchPattern)) {
          switch (searchPattern) {
            case "#Prodmodule":
            returnValue.searchPattern = searchPattern;
            returnValue.module = 'products';
            returnValue.moduleSingular = 'product';
            break;
            case "#Custmodule":
            returnValue.searchPattern = searchPattern;
            returnValue.module = 'customers';
            returnValue.moduleSingular = 'customer';
            break;
            case "#Ordemodule":
            returnValue.searchPattern = searchPattern;
            returnValue.module = 'Orders';
            returnValue.moduleSingular = 'Order';
            break;
            case "#Orgamodule":
            returnValue.searchPattern = searchPattern;
            returnValue.module = 'Organizations';
            returnValue.moduleSingular = 'Organization';
            break;
            case "#Custkpiformulasmodule":
            returnValue.searchPattern = searchPattern;
            returnValue.module = 'cust-kpi-formulas';
            returnValue.moduleSingular = 'Customer KPI Formula';
            break;
            default:
            returnValue = {searchPattern: '', module: '', moduleSingular: '' };
          }
          break; //break out of loop
        }
    }
  }
  return returnValue
}
