'use strict';
const graphql = require('graphql');
const chai = require('chai');
const expect  = require('chai').expect;
const genericHelper = require('./../resolver/genericHelper');
const configRepository = require('./../configRepository')
const backendURL = configRepository.backendURL
const foxxServMountPoints = configRepository.foxxServMountPoints
const foxxServGenericEndPoints = configRepository.foxxServGenericEndPoints


const documents = [{ _key: "testGQL2", name : "name2", formula: "formula2", type : "type2", validityDate : "1999-01-01", calculationOrder : 2 },
                   { _key: "testGQL3", name : "name3", formula: "formula3", type : "type3", validityDate : "1999-01-01", calculationOrder : 3 }];
const document = { _key: "testGQL1", name : "name1", formula: "formula1", type : "type1", validityDate : "1999-01-01", calculationOrder : 1 }
const document3Replacement = { _key: "testGQL3", name : "name3_1", formula: "formula3", type : "type31", validityDate : "1999-01-01", calculationOrder : 3 }
const document2Update = { color : "color2"};
const collectionName = 'custKpiFormula'



//Single test
const foo = 'bar';
describe('test1',() => {
  describe('myTest', () => {
    it('is a dummy test', () => {
      expect(foo).to.be.a('string');
      expect(foo).to.equal('bar');
      expect(foo).to.have.lengthOf(3);
    });
  });
})

var emtpyHandler = (serverResponse) => serverResponse

describe('Generic query helper tests', () => {
  after(
    () => {
      genericHelper.fetchMutation(backendURL,foxxServMountPoints.generic,
        `${foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`,
        'delete',emtpyHandler, undefined, 'testGQL1')

        genericHelper.fetchMutation(backendURL,foxxServMountPoints.generic,
          `${foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`,
          'delete',emtpyHandler, undefined, 'testGQL2')

          genericHelper.fetchMutation(backendURL,foxxServMountPoints.generic,
            `${foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`,
            'delete',emtpyHandler, undefined, 'testGQL3')
     }
  );
  it('tests', () => { expect(1==1) });
  it('Post a document using the generic function', async () => {
    const documentPosted = await genericHelper.fetchMutation(backendURL,foxxServMountPoints.custKpiFormula,
              `${collectionName}Post`, 'post',emtpyHandler,document)
    expect(1).to.equal(1, documentPosted );
     expect(documentPosted._key).to.equal('testGQL1',JSON.stringify(documentPosted, null, 4));
     expect(documentPosted.name).to.equal('name1');
  //  expect(collection.count()).to.equal(1);
  });
  it('Post two documents using the generic function', async () => {
    const documentsPosted = await genericHelper.fetchMutation(backendURL,foxxServMountPoints.custKpiFormula,
              `${collectionName}Post`, 'post',emtpyHandler,documents)
    expect(documentsPosted[0]._key).to.equal('testGQL2');
    expect(documentsPosted[0].name).to.equal('name2');
    expect(documentsPosted[1]._key).to.equal('testGQL3');
    expect(documentsPosted[1].name).to.equal('name3');
    expect(documentsPosted[1]._id).to.equal(`${collectionName}/testGQL3`);
  //  expect(collection.count()).to.equal(3);
  });
  it('Gets a document from the collection using the generic query', async () => {
    const documentFromDB = await genericHelper.fetchQuery(backendURL,foxxServMountPoints.generic,
      `${foxxServGenericEndPoints.DocumentByKeyGet}/${collectionName}/testGQL2`,emtpyHandler);
    const data = documentFromDB;
    expect(data[0]._id).to.equal(`${collectionName}/testGQL2`);
  });
  it("Get a document's specified field from a collection based on the key", async () => {
    const documentFromDB = await genericHelper.fetchQuery(backendURL,foxxServMountPoints.generic,
      `${foxxServGenericEndPoints.DocumentFieldByKeyGet}/${collectionName}/testGQL2/type`,
      emtpyHandler)
    expect(documentFromDB[0]._key).to.equal('testGQL2');
    expect(documentFromDB[0].fieldName).to.equal('type');
    expect(documentFromDB[0].fieldValue).to.equal('type2');
  });
  it('Put a document using the generic function (replace)', async () => {
    const documentUpdated = await genericHelper.fetchMutation(backendURL,foxxServMountPoints.custKpiFormula,
       `${collectionName}Put`,'put',emtpyHandler, document3Replacement, 'testGQL3')
    expect(documentUpdated._key).to.equal('testGQL3',JSON.stringify(documentUpdated, null, 4));
    expect(documentUpdated.type).to.equal('type31');
  });
  it('Patch a document by key in the collection', async () => {
    const documentPatched = await genericHelper.fetchMutation(backendURL,foxxServMountPoints.custKpiFormula,
       `${collectionName}Patch`,'patch',emtpyHandler, document2Update, 'testGQL2')
    expect(documentPatched._key).to.equal('testGQL2');
    expect(documentPatched.color).to.equal('color2');
  });
  it('Logically deletes a document by setting the status to d', async () => {
    await genericHelper.fetchMutation(backendURL,foxxServMountPoints.generic,
      `${foxxServGenericEndPoints.DocumentByKeyDeleteLogical}/${collectionName}`,
      'delete',emtpyHandler, undefined, 'testGQL2')
    const documentFromDB = await genericHelper.fetchQuery(backendURL,foxxServMountPoints.generic,
        `${foxxServGenericEndPoints.DocumentFieldByKeyGet}/${collectionName}/testGQL2/type`,
        emtpyHandler)
    expect(JSON.stringify(documentFromDB)).to.equal('[]', JSON.stringify(documentFromDB, null, 4))

    //const documentsInLogicalCollection = queriedb.genericCollectionGet(collection).toArray();
    //expect(collection.count()).to.equal(3);
    //expect(documentsInLogicalCollection).to.have.lengthOf(2);
  });
  it('Deletes a document', async () => {
    await genericHelper.fetchMutation(backendURL,foxxServMountPoints.generic,
      `${foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`,
      'delete',emtpyHandler, undefined, 'testGQL3')
    const documentFromDB = await genericHelper.fetchQuery(backendURL,foxxServMountPoints.generic,
        `${foxxServGenericEndPoints.DocumentFieldByKeyGet}/${collectionName}/testGQL3/type`,
        emtpyHandler)
    expect(JSON.stringify(documentFromDB)).to.equal('[]', JSON.stringify(documentFromDB, null, 4))
    //expect(collection.count()).to.equal(2);
  });
})
