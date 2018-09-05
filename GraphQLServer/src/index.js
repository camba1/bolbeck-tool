'use strict'

//Note how the url uses the port on the arango container, not the port mapped
//to in the docker-compose file

const { GraphQLServer } = require('graphql-yoga')
const Query = require('./resolver/query')
const Mutation = require('./resolver/mutation')
const configRepository = require('./configRepository')
const backendURL = configRepository.backendURL
const foxxServMountPoints = configRepository.foxxServMountPoints
const foxxServGenericEndPoints = configRepository.foxxServGenericEndPoints


let links = [{
  id: 'Tamu',
  url: 'www.tamu.edu',
  description: 'University in Texas'
}]
let idCount = links.length

//Moved this section to schema.graphql and added the typedef to the const server
// initialization

// const typeDefs = `
// type Query {
//   info: String!
//   feed: [Link!]!
// }
//
// type Mutation {
//   post(url: String!, description: String!): Link!
// }
//
// type Link {
//   id: ID!
//   description: String!
//   url: String!
// }
// `


 // const fetch = require('node-fetch')
 // const collectionName = 'custKpiFormula'


// This is the actual implementation of the GraphQL schema.
// Note how it is indentical tothe typeDefs, except that it actually
// gets the data that needs to be returned on each field
//  const resolvers = {
//   Query: {
//     info: () => 'This is the API for my program',
//     feed: () => links,
//      custKpiFormulas: () => {
//        return fetch(`${backendURL}/genericCollectionGet/custKpiFormula`).then(res => res.json())
//      },
//      custKpiFormula: function (parent, args) {
//        const  id  = args._key
//        //return fetch(`${backendURL}/genericDocumentByKeyGet/custKpiFormula/${id}`).then(res => res.json())
//        return fetch(`${backendURL}/genericDocumentByKeyGet/custKpiFormula/${id}`).then(function(res) {
//          return res.json()
//        })
//      },
//   },
//     Link: {
//       id: (root) => root.id,
//       description: (root) => root.description,
//       url: (root) => root.url
//     },
//     Mutation: {
//       post: (root, args) => {
//         const link = {
//           id:`link-${idCount++}`,
//           description: args.description,
//           url: args.url
//         }
//         links.push(link)
//         return link
//       },
//       customerKpiPost:  (root, args, context) => {
//           const backendURL = context.backendURL
//           const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
//           const data = args.input
//           return fetch(`${backendURL}/${foxxMountPoint}/${collectionName}Post`,
//             {
//               method: "POST",
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//               },
//               body: JSON.stringify(data)
//             }
//           ).then(function(res) {
//             return res.json()
//           })
//         },
//          customerKpiPatch: (root, args, context) => {
//           const backendURL = context.backendURL
//           const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
//           const data = args.input
//           const id  = args._key
//           return fetch(`${backendURL}/${foxxMountPoint}/${collectionName}Patch/${id}`,
//             {
//               method: "PATCH",
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//               },
//               body: JSON.stringify(data)
//             }
//           ).then(res => res.json())
//           //.then(response => console.log('Success:', JSON.stringify(response)))
//         //  .catch(error => console.error('Error:', error));
//         }
//     }
// }


const resolvers = {
  Query,
  Mutation
}

// Server setup and start
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    myLinkObj :  links,
    myLinkIdCount : idCount,
    backendURL : backendURL,
    foxxServMountPoints : foxxServMountPoints,
    foxxServGenericEndPoints : foxxServGenericEndPoints
  }
})

server.start( () => console.log('Server is running on http://localhost:4000'))
