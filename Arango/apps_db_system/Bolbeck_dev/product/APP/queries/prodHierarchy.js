
const db = require('@arangodb').db;
const aql = require('@arangodb').aql;
const invalidDatesMsg = 'Invalid dates: '

/**
 * DB requires a document _id instead of a document _key to allow graph traversals
 * This function takes a Key and converts it to an _id by combining the collection
 * name and the _key
 * @param {String} sourceKeyFieldValue _key value of the record to be used as starting node pf traversal
 * @param {String} sourceCollectionName Name of the collection which contains the record to be used as starting node
 * @returns {String} collection _id
 */
function buildCollectionId(sourceKeyFieldValue, sourceCollectionName){
  return sourceCollectionName.concat("/",sourceKeyFieldValue)
};

/**
 * Traverse a single edge collection that represents a hierachy
 * @param {String} sourceDocumentKeyFieldValue Primary Key of record to be used as starting node pf traversal
 * @param {String} sourceCollectionName Name of the collection which contains the record to be used as starting node
 * @param {Object} edgeCollectionToTraverse Edge collection to be traversed
 * @param {Int} maxTraversalDepth Number of hops for the traversal to execute
 * @param {Date} validFrom hierarchy relationship validity lower bound
 * @param {Date} validThru hierarchy relationship validity upper bound
 * @param {Sring} traversaldirection Indicates in which direction to perform traversal (inbound, outboud, any)
 * @returns{[Object]}
 */
var traverseEdgeCollectionWithValidDates = function(sourceDocumentKeyFieldValue,
              sourceCollectionName, edgeCollectionToTraverse, maxTraversalDepth,
              validFrom, validThru, traversaldirection) {

  let documents
  const sourceDocumentId = buildCollectionId(sourceDocumentKeyFieldValue, sourceCollectionName);
  const returnAqlLiteral = aql.literal(`RETURN { _key: v._key,
                                        _id: v._id,
                                        name: v.name,
                                        validFrom: v.validFrom,
                                        validThru: v.validThru,
                                        hierarchyLevel: v.hierarchyLevel,
                                        eFrom: e._from,
                                        eTo: e._to,
                                        e_key: e._key,
                                        eValidFrom: e.validFrom,
                                        eValidThru: e.validThru}`)

  if (!(validFrom instanceof Date) || !(validThru instanceof Date)){
    throw invalidDatesMsg.concat(validFrom, ", ",validThru)
  }

  if (traversaldirection.toLowerCase() == 'outbound') {
    documents = db._query(aql`
        FOR v, e, p IN 1..${maxTraversalDepth}
        OUTBOUND ${sourceDocumentId}
                 ${edgeCollectionToTraverse}
                 FILTER p.edges[*].validFrom ALL <= ${validThru}
                 AND p.edges[*].validThru ALL >= ${validFrom}
        ${returnAqlLiteral}`
        );
  } else if (traversaldirection.toLowerCase() == 'inbound'){
    documents = db._query(aql`
          FOR v, e, p IN 1..${maxTraversalDepth}
          INBOUND ${sourceDocumentId}
                   ${edgeCollectionToTraverse}
                   FILTER p.edges[*].validFrom ALL <= ${validThru}
                   AND p.edges[*].validThru ALL >= ${validFrom}
          ${returnAqlLiteral}`
          );
  } else {
    documents = db._query(aql`
          FOR v, e, p IN 1..${maxTraversalDepth}
          ANY ${sourceDocumentId}
                   ${edgeCollectionToTraverse}
                   FILTER p.edges[*].validFrom ALL <= ${validThru}
                   AND p.edges[*].validThru ALL >= ${validFrom}
          ${returnAqlLiteral}`
          );
  }
  return documents;
};

module.exports.traverseEdgeCollectionWithValidDates = traverseEdgeCollectionWithValidDates;
