
const db = require('@arangodb').db;
const aql = require('@arangodb').aql;
const invalidDatesMsg = 'Invalid dates: '

function buildCollectionId(sourceKeyFieldValue, sourceCollectionName){
  return sourceCollectionName.concat("/",sourceKeyFieldValue)
};

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
