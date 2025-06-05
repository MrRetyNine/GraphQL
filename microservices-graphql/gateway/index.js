console.log('=== CURRENT INDEX.JS STARTED ===');

const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

// Упрощенная конфигурация шлюза без проблемного логирования
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'users', url: 'http://localhost:4001/graphql' },
    { name: 'orders', url: 'http://localhost:4002/graphql' },
    { name: 'products', url: 'http://localhost:4003/graphql' }
  ],
  debug: true
});

// Минимальная конфигурация Apollo Server
const server = new ApolloServer({
  gateway,
  subscriptions: false,
  introspection: true,
plugins: [{
  async serverWillStart() {
    console.log('Gateway starting with configuration:');
    console.log('Supergraph composed from subgraphs:', gateway.config?.supergraphSdl ? 'Yes' : 'No');
    return {
      async drainServer() {
        console.log('Gateway shutting down');
      }
    };
  }
}]
});

server.listen({ port: 4000 })
  .then(({ url }) => {
    console.log(`\n🚀 Gateway ready at ${url}`);
    console.log('Try querying: { users { id name } products { id name } }');
  })
  .catch(err => {
    console.error('\n❌ Gateway failed to start:', err.message);
    process.exit(1);
  });