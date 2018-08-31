 'use strict';
 const db = require('@arangodb').db;
 const aql = require('@arangodb').aql;
 const errors = require('@arangodb').errors;
// const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
// const COLL_NOT_FOUND = errors.ERROR_ARANGO_COLLECTION_NOT_FOUND.code;
// const DOC_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
// const DOC_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
// const httpError = require('http-errors');
// const status = require('statuses');
// const HTTP_NOT_FOUND = status('not found');
// const HTTP_CONFLICT = status('conflict');
//
// const g_MaxRecordsByQuery = 2;
//
//
//
// var custKpiFormulaPost =  (collection, documents) => {
//   const multiple = Array.isArray(documents);
//   const arrayofDocuments = multiple ? documents : [documents];
//   let postedDocuments = [];
//   try {
//      for (var document of arrayofDocuments) {
//        const meta = collection.save(document);
//        postedDocuments.push(Object.assign(document, meta));
//      }
//   }
//   catch (e) {
//     if (e.isArangoError && e.errorNum === DOC_DUPLICATE) {
//       throw httpError(HTTP_CONFLICT, e.message);
//     }
//     throw e;
//   }
//   return postedDocuments;
// };
//
//
// //// TODO: modify put and patch to use the array functionality
// var custKpiFormulaPut = (collection, key, document) => {
//   let postedDocument;
//   try {
//     const meta = collection.replace(key, document);
//     postedDocument = Object.assign(document,meta);
//   }
//     catch(e) {
//       if (e.isArangoError && e.errorNum === DOC_NOT_FOUND) {
//         throw httpError(HTTP_NOT_FOUND, e.message);
//       }
//       if (e.isArangoError && e.errorNum === DOC_CONFLICT) {
//         throw httpError(HTTP_CONFLICT, e.message);
//       }
//       throw e;
//     }
//     return postedDocument
//   };
//
//
// var custKpiFormulaPatch = (collection, key, document) => {
//   let patchedDocument;
//   try {
//     const meta = collection.update(key, document);
//     patchedDocument = Object.assign(document, meta);
//   }
//     catch(e) {
//       if (e.isArangoError && e.errorNum === DOC_NOT_FOUND) {
//         throw httpError(HTTP_NOT_FOUND, e.message);
//       }
//       if (e.isArangoError && e.errorNum === DOC_CONFLICT) {
//         throw httpError(HTTP_CONFLICT, e.message);
//       }
//       throw e;
//     }
//     return patchedDocument
//   };
//
//
//
// var genericCollectionObjectGet =  (collectionName) => {
//   const collection =  db._collection(collectionName);
//   if (!collection) {
//     throw httpError(HTTP_NOT_FOUND, "Collection not found");
//   }
//   return collection;
// };
//
//
// module.exports.custKpiFormulaPost = custKpiFormulaPost;
// module.exports.genericCollectionObjectGet = genericCollectionObjectGet;
// module.exports.custKpiFormulaPut = custKpiFormulaPut;
// module.exports.custKpiFormulaPatch = custKpiFormulaPatch;
