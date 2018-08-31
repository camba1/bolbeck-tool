'use strict';
const expect  = require('chai').expect;
const db = require('@arangodb').db;
const queriedb = require('../queries')



const documents = [{ _key: "test2", name : "name2", type : "type2"},{ _key: "test3", name: "name3", type : "type3"}];
const document = { _key: "test1", name : "name1" , type : "type1"};
const document3Replacement = { _key: "test3", name : "name3_1" , type : "type3_1"};
const document2Update = { color : "color2"};
const collectionName = 'testCollection';

//Single test
const foo = 'bar';
test('myTest', () => {
  it('is a dummy test', () => {
    expect(foo).to.be.a('string');
    expect(foo).to.equal('bar');
    expect(foo).to.have.lengthOf(3);
  });
});

// Test suite
describe('Test generic queries', () => {
  let collection;
  before(
    () => {collection = db._create(collectionName);}
  );
  after(
    () => { db._drop(collection); }
  );
  it('Checks if collection was created', () => {
    var mycollection = queriedb.genericCollectionObjectGet(collectionName);
    expect(mycollection).to.exist;
  });
  it('Post a document using the generic function', () => {
    const documentPosted = queriedb.genericDocumentPost(collection, document);
    expect(documentPosted[0]._key).to.equal('test1');
    expect(documentPosted[0].name).to.equal('name1');
    expect(collection.count()).to.equal(1);
  });
  it('Post two documents using the generic function', () => {
    const documentsPosted = queriedb.genericDocumentPost(collection, documents);
    expect(documentsPosted[0]._key).to.equal('test2');
    expect(documentsPosted[0].name).to.equal('name2');
    expect(documentsPosted[1]._key).to.equal('test3');
    expect(documentsPosted[1].name).to.equal('name3');
    expect(documentsPosted[1]._id).to.equal('testCollection/test3');
    expect(collection.count()).to.equal(3);
  });
  it('Gets a document from the collection using the generic query', () => {
    const documentFromDB = queriedb.genericDocumentByKeyGet(collection, 'test2');
    const data = documentFromDB.toArray();
    expect(data[0]._id).to.equal('testCollection/test2');
  });
  it("Get a document's specified field from a collection based on the key", () => {
    const documentFromDB = queriedb.genericDocumentFieldByKeyGet(collection, 'test2', 'type').toArray();
    expect(documentFromDB[0]._key).to.equal('test2');
    expect(documentFromDB[0].fieldName).to.equal('type');
    expect(documentFromDB[0].fieldValue).to.equal('type2');
  });
  it('Put a document by key in the collection (replace)', () => {
    const documentUpdated = queriedb.genericDocumentPut(collection, 'test3', document3Replacement);
    expect(documentUpdated._key).to.equal('test3');
    expect(documentUpdated.type).to.equal('type3_1');
  });
  it('Patch a document by key in the collection', () => {
    const documentPatched = queriedb.genericDocumentPatch(collection, 'test2', document2Update);
    expect(documentPatched._key).to.equal('test2');
    expect(documentPatched.color).to.equal('color2');
  });
  it('Logically deletes a document by setting the status to d', () => {
    queriedb.genericDocumentByKeyLogicallyDelete(collection, 'test2');
    const documentsInLogicalCollection = queriedb.genericCollectionGet(collection).toArray();
    expect(collection.count()).to.equal(3);
    expect(documentsInLogicalCollection).to.have.lengthOf(2);
  });
  it('Fully deletes a document using the generic delete', () => {
    queriedb.genericDocumentByKeyDelete(collection, 'test3');
    expect(collection.count()).to.equal(2);
  });
});
