const { ApolloServer } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const typeDefs = require('./schema');
const db = require('./db');

const resolvers = {
  Query: {
    users: () => db.users,
    user: (_, { id }) => db.users.find(user => user.id === id),
    _service: () => ({ sdl: typeDefs.loc.source.body })
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const newId = String(db.users.length > 0 ? Math.max(...db.users.map(u => parseInt(u.id))) + 1 : 1);
      const newUser = { id: newId, name, email };
      db.users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, name, email }) => {
      const userIndex = db.users.findIndex(u => u.id === id);
      if (userIndex === -1) {
        throw new Error(`User with ID ${id} not found.`);
      }
      const user = db.users[userIndex];
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      return user;
    },
    deleteUser: (_, { id }) => {
      const initialLength = db.users.length;
      db.users = db.users.filter(u => u.id !== id);
      return db.users.length < initialLength;
    }
  },
  User: {
    __resolveReference(user) {
      return db.users.find(u => u.id === user.id);
    },
    // УДАЛЕНО: orders: (user) => { ... }
    // Это поле будет разрешаться в orders-service
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  context: ({ req }) => ({ req }),
  introspection: true,
  playground: true
});

server.listen({ port: 4001 })
  .then(({ url }) => {
    console.log(`🚀 Users service ready at ${url}`);
  })
  .catch(err => {
    console.error('❌ Users service failed to start:', err);
    process.exit(1);
  });