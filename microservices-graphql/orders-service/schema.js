const { gql } = require('apollo-server');

const typeDefs = gql`
  type Order @key(fields: "id") {
    id: ID!
    userId: ID!
    productId: ID!
    quantity: Int!
    user: User @provides(fields: "id")
    product: Product @provides(fields: "id")
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    orders: [Order] @requires(fields: "id")
  }

  extend type Product @key(fields: "id") {
    id: ID! @external
    orders: [Order] @requires(fields: "id") # Важно: @requires(fields: "id") здесь указывает, что для разрешения поля orders для Product нужен id этого Product
  }

  type Query {
    orders: [Order]
    order(id: ID!): Order
    _service: _Service!
  }

  type Mutation {
    createOrder(userId: ID!, productId: ID!, quantity: Int!): Order
    deleteOrder(id: ID!): Boolean
    updateOrder(id: ID!, userId: ID, productId: ID, quantity: Int): Order
  }
`;

module.exports = typeDefs;