const { gql } = require('apollo-server');

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String!
    email: String!
    # УДАЛЕНО: orders: [Order] @requires(fields: "id")
    # Это поле будет добавлено через extend type User в orders-service
  }

  # Расширение типа Order, вероятно, не нужно в этом сервисе,
  # если нет других причин для его наличия.
  # extend type Order @key(fields: "id") {
  #   id: ID! @external
  # }

  type Query {
    users: [User]
    user(id: ID!): User
    _service: _Service!
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean
  }
`;

module.exports = typeDefs;