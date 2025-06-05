const { ApolloServer } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const typeDefs = require('./schema');
const db = require('./db');

const resolvers = {
  Query: {
    products: () => db.products,
    product: (_, { id }) => db.products.find(p => p.id === id),
    _service: () => ({ sdl: typeDefs.loc.source.body })
  },
  Mutation: {
    createProduct: (_, { name, price }) => {
      const newId = String(db.products.length > 0 ? Math.max(...db.products.map(p => parseInt(p.id))) + 1 : 1);
      const newProduct = { id: newId, name, price };
      db.products.push(newProduct);
      return newProduct;
    },
    updateProduct: (_, { id, name, price }) => {
      const productIndex = db.products.findIndex(p => p.id === id);
      if (productIndex === -1) {
        throw new Error(`Product with ID ${id} not found.`);
      }
      const product = db.products[productIndex];
      if (name !== undefined) product.name = name;
      if (price !== undefined) product.price = price;
      return product;
    },
    deleteProduct: (_, { id }) => {
      const initialLength = db.products.length;
      db.products = db.products.filter(p => p.id !== id);
      return db.products.length < initialLength;
    }
  },
  Product: {
    __resolveReference(product) {
      return db.products.find(p => p.id === product.id);
    },
    // УДАЛЕНО: orders: (product) => { ... }
    // Это поле будет разрешаться в orders-service
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  introspection: true,
  playground: true,
  formatError: (err) => {
    console.error(err);
    return err;
  }
});

server.listen({ port: 4003 })
  .then(({ url }) => {
    console.log(`🚀 Products service ready at ${url}`);
  })
  .catch(err => {
    console.error('❌ Products service failed to start:', err);
    process.exit(1);
  });