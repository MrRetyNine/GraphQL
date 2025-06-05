const { gql } = require('apollo-server');

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
    # УДАЛЕНО: orders: [Order]
    # Это поле будет добавлено через extend type Product в orders-service
  }

  # Оставляем extend type Order, если Products Service когда-либо ссылается на Order
  # Но сейчас Products Service не имеет прямых связей с Order, поэтому можно удалить,
  # если нет других причин для его наличия.
  # extend type Order @key(fields: "id") {
  #   id: ID! @external
  #   productId: ID! @external # Это поле тоже, вероятно, не нужно здесь
  # }

  type Query {
    products: [Product]
    product(id: ID!): Product
    _service: _Service!
  }

  type Mutation {
    createProduct(name: String!, price: Float!): Product
    updateProduct(id: ID!, name: String, price: Float): Product
    deleteProduct(id: ID!): Boolean
  }
`;

module.exports = typeDefs;