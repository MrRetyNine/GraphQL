const { ApolloServer } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const mongoose = require('mongoose');
const typeDefs = require('./schema');

// Подключение к MongoDB
async function connectToMongoDB() {
  try {
    // useNewUrlParser и useUnifiedTopology теперь необязательны для Mongoose 6+
    await mongoose.connect('mongodb://127.0.0.1:27017/orders', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

// Определение модели Order для MongoDB
const Order = mongoose.model('Order', {
  userId: String,
  productId: String,
  quantity: Number,
});

const resolvers = {
  Query: {
    // Убрали .exec(), await достаточно
    orders: async () => await Order.find({}),
    order: async (_, { id }) => await Order.findById(id),
    _service: () => ({ sdl: typeDefs.loc.source.body })
  },
  Mutation: {
    createOrder: async (_, { userId, productId, quantity }) => {
      const order = new Order({ userId, productId, quantity });
      await order.save();
      return order;
    },
    deleteOrder: async (_, { id }) => {
      const result = await Order.deleteOne({ _id: id });
      return result.deletedCount > 0;
    },
    updateOrder: async (_, { id, userId, productId, quantity }) => {
      const order = await Order.findById(id);
      if (!order) {
        throw new Error(`Order with ID ${id} not found.`);
      }
      if (userId !== undefined) order.userId = userId;
      if (productId !== undefined) order.productId = productId;
      if (quantity !== undefined) order.quantity = quantity;
      await order.save();
      return order;
    }
  },
  Order: {
    __resolveReference: async (reference) => {
      // Убрали .exec(), await достаточно
      return await Order.findById(reference.id);
    },
    user: (order) => ({ id: order.userId }),
    product: (order) => ({ id: order.productId }),
  },
  User: {
    orders: async (user) => {
      // Это правильный резолвер для User.orders
      return await Order.find({ userId: user.id });
    }
  },
  Product: {
    // ИСПРАВЛЕНО: Теперь этот резолвер корректно запрашивает из MongoDB
    orders: async (productRef) => {
      return await Order.find({ productId: productRef.id });
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
  introspection: true,
  playground: true,
  context: ({ req }) => ({ req }),
  formatError: (err) => {
    console.error(err);
    return err;
  }
});

async function startServer() {
  await connectToMongoDB();
  const { url } = await server.listen({ port: 4002 });
  console.log(`🚀 Orders service ready at ${url}`);
}

startServer().catch(err => {
  console.error('Failed to start Orders service:', err);
  process.exit(1);
});