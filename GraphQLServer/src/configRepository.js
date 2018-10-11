const backendURL = 'http://bolbeck_arangodb_dev:8529/_db/Bolbeck_dev'
const foxxServMountPoints = {generic : "generic",
                             custKpiFormula : "custKpiFormula",
                             product: "product"}
const foxxServGenericEndPoints = {DocumentByKeyDeleteFull : "genericDocumentByKeyDeleteFull",
                                  DocumentByKeyDeleteLogical : "genericDocumentByKeyDeleteLogical",
                                  DocumentFieldByKeyGet : "genericDocumentFieldByKeyGet",
                                  DocumentByKeyGet: "genericDocumentByKeyGet",
                                  CollectionGet: "genericCollectionGet"}

module.exports = {
  backendURL,
  foxxServMountPoints,
  foxxServGenericEndPoints
}
