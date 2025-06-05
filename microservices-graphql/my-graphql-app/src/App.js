import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// --- GraphQL Operations ---

// Запрос для получения всех пользователей, товаров и заказов с их связями
const GET_ALL_DATA = gql`
  query GetAllData {
    users {
      id
      name
      email
      orders { # Запрашиваем заказы, связанные с пользователем
        id
        quantity
        product { # Внутри заказа запрашиваем информацию о продукте
          id
          name
          price
        }
      }
    }
    products {
      id
      name
      price
      orders { # Запрашиваем заказы, связанные с товаром
        id
        quantity
        user { # Внутри заказа запрашиваем информацию о пользователе
          id
          name
        }
      }
    }
    orders {
      id
      quantity
      userId
      productId
      user { # Получаем полную информацию о пользователе, связанном с заказом
        id
        name
        email
      }
      product { # Получаем полную информацию о продукте, связанном с заказом
        id
        name
        price
      }
    }
  }
`;

// Мутации для User
const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// Мутации для Product
const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($name: String!, $price: Float!) {
    createProduct(name: $name, price: $price) {
      id
      name
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $name: String, $price: Float) {
    updateProduct(id: $id, name: $name, price: $price) {
      id
      name
      price
    }
  }
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

// Мутации для Order
const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($userId: ID!, $productId: ID!, $quantity: Int!) {
    createOrder(userId: $userId, productId: $productId, quantity: $quantity) {
      id
      userId
      productId
      quantity
    }
  }
`;

const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($id: ID!, $userId: ID, $productId: ID, $quantity: Int) {
    updateOrder(id: $id, userId: $userId, productId: $productId, quantity: $quantity) {
      id
      userId
      productId
      quantity
    }
  }
`;

const DELETE_ORDER_MUTATION = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

function App() {
  const { loading, error, data, refetch } = useQuery(GET_ALL_DATA);

  // State for Create User form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // State for Update User form
  const [updateUserId, setUpdateUserId] = useState('');
  const [updateUserName, setUpdateUserName] = useState('');
  const [updateUserEmail, setUpdateUserEmail] = useState('');

  // State for Delete User form
  const [deleteUserId, setDeleteUserId] = useState('');

  // State for Create Product form
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  // State for Update Product form
  const [updateProductId, setUpdateProductId] = useState('');
  const [updateProductName, setUpdateProductName] = useState('');
  const [updateProductPrice, setUpdateProductPrice] = useState('');

  // State for Delete Product form
  const [deleteProductId, setDeleteProductId] = useState('');

  // State for Create Order form
  const [newOrderUserId, setNewOrderUserId] = useState('');
  const [newOrderProductId, setNewOrderProductId] = useState('');
  const [newOrderQuantity, setNewOrderQuantity] = useState('');

  // State for Update Order form
  const [updateOrderId, setUpdateOrderId] = useState('');
  const [updateOrderUserId, setUpdateOrderUserId] = useState('');
  const [updateOrderProductId, setUpdateOrderProductId] = useState('');
  const [updateOrderQuantity, setUpdateOrderQuantity] = useState('');

  // State for Delete Order form
  const [deleteOrderId, setDeleteOrderId] = useState('');


  // --- Apollo Client Hooks ---
  const [createUser] = useMutation(CREATE_USER_MUTATION, { onCompleted: () => refetch() });
  const [updateUser] = useMutation(UPDATE_USER_MUTATION, { onCompleted: () => refetch() });
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, { onCompleted: () => refetch() });

  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION, { onCompleted: () => refetch() });
  const [updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION, { onCompleted: () => refetch() });
  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION, { onCompleted: () => refetch() });

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION, { onCompleted: () => refetch() });
  const [updateOrder] = useMutation(UPDATE_ORDER_MUTATION, { onCompleted: () => refetch() });
  const [deleteOrder] = useMutation(DELETE_ORDER_MUTATION, { onCompleted: () => refetch() });


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // --- Handlers for Forms ---

  const handleCreateUser = () => {
    createUser({ variables: { name: newUserName, email: newUserEmail } });
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleUpdateUser = () => {
    updateUser({ variables: { id: updateUserId, name: updateUserName || undefined, email: updateUserEmail || undefined } });
    setUpdateUserId('');
    setUpdateUserName('');
    setUpdateUserEmail('');
  };

  const handleDeleteUser = () => {
    deleteUser({ variables: { id: deleteUserId } });
    setDeleteUserId('');
  };

  const handleCreateProduct = () => {
    createProduct({ variables: { name: newProductName, price: parseFloat(newProductPrice) } });
    setNewProductName('');
    setNewProductPrice('');
  };

  const handleUpdateProduct = () => {
    updateProduct({ variables: { id: updateProductId, name: updateProductName || undefined, price: parseFloat(updateProductPrice) || undefined } });
    setUpdateProductId('');
    setUpdateProductName('');
    setUpdateProductPrice('');
  };

  const handleDeleteProduct = () => {
    deleteProduct({ variables: { id: deleteProductId } });
    setDeleteProductId('');
  };

  const handleCreateOrder = () => {
    createOrder({ variables: { userId: newOrderUserId, productId: newOrderProductId, quantity: parseInt(newOrderQuantity) } });
    setNewOrderUserId('');
    setNewOrderProductId('');
    setNewOrderQuantity('');
  };

  const handleUpdateOrder = () => {
    updateOrder({
      variables: {
        id: updateOrderId,
        userId: updateOrderUserId || undefined,
        productId: updateOrderProductId || undefined,
        quantity: parseInt(updateOrderQuantity) || undefined
      }
    });
    setUpdateOrderId('');
    setUpdateOrderUserId('');
    setUpdateOrderProductId('');
    setUpdateOrderQuantity('');
  };

  const handleDeleteOrder = () => {
    deleteOrder({ variables: { id: deleteOrderId } });
    setDeleteOrderId('');
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>GraphQL Microservices Demo</h1>

      {/* Users Section */}
      <section style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '15px' }}>
        <h2>Users</h2>
        <h3>Create User</h3>
        <input type="text" placeholder="Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
        <input type="email" placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
        <button onClick={handleCreateUser}>Add User</button>

        <h3>Update User</h3>
        <input type="text" placeholder="User ID" value={updateUserId} onChange={(e) => setUpdateUserId(e.target.value)} />
        <input type="text" placeholder="New Name (optional)" value={updateUserName} onChange={(e) => setUpdateUserName(e.target.value)} />
        <input type="email" placeholder="New Email (optional)" value={updateUserEmail} onChange={(e) => setUpdateUserEmail(e.target.value)} />
        <button onClick={handleUpdateUser}>Update User</button>

        <h3>Delete User</h3>
        <input type="text" placeholder="User ID to delete" value={deleteUserId} onChange={(e) => setDeleteUserId(e.target.value)} />
        <button onClick={handleDeleteUser}>Delete User</button>

        <h3>All Users ({data.users.length})</h3>
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              ID: {user.id}, Name: {user.name}, Email: {user.email}
              {user.orders && user.orders.length > 0 && (
                <div>
                  <h4>Orders for {user.name}:</h4>
                  <ul>
                    {user.orders.map(order => (
                      <li key={order.id}>
                        Order ID: {order.id}, Qty: {order.quantity}
                        {order.product && ` (Product: ${order.product.name}, Price: $${order.product.price})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Products Section */}
      <section style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '15px' }}>
        <h2>Products</h2>
        <h3>Create Product</h3>
        <input type="text" placeholder="Product Name" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
        <input type="number" placeholder="Price" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} />
        <button onClick={handleCreateProduct}>Add Product</button>

        <h3>Update Product</h3>
        <input type="text" placeholder="Product ID" value={updateProductId} onChange={(e) => setUpdateProductId(e.target.value)} />
        <input type="text" placeholder="New Name (optional)" value={updateProductName} onChange={(e) => setUpdateProductName(e.target.value)} />
        <input type="number" placeholder="New Price (optional)" value={updateProductPrice} onChange={(e) => setUpdateProductPrice(e.target.value)} />
        <button onClick={handleUpdateProduct}>Update Product</button>

        <h3>Delete Product</h3>
        <input type="text" placeholder="Product ID to delete" value={deleteProductId} onChange={(e) => setDeleteProductId(e.target.value)} />
        <button onClick={handleDeleteProduct}>Delete Product</button>

        <h3>All Products ({data.products.length})</h3>
        <ul>
          {data.products.map((product) => (
            <li key={product.id}>
              ID: {product.id}, Name: {product.name}, Price: ${product.price}
              {product.orders && product.orders.length > 0 && (
                <div>
                  <h4>Orders for {product.name}:</h4>
                  <ul>
                    {product.orders.map(order => (
                      <li key={order.id}>
                        Order ID: {order.id}, Qty: {order.quantity}
                        {order.user && ` (User: ${order.user.name})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Orders Section */}
      <section style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '15px' }}>
        <h2>Orders</h2>
        <h3>Create Order</h3>
        <input type="text" placeholder="User ID" value={newOrderUserId} onChange={(e) => setNewOrderUserId(e.target.value)} />
        <input type="text" placeholder="Product ID" value={newOrderProductId} onChange={(e) => setNewOrderProductId(e.target.value)} />
        <input type="number" placeholder="Quantity" value={newOrderQuantity} onChange={(e) => setNewOrderQuantity(e.target.value)} />
        <button onClick={handleCreateOrder}>Create Order</button>

        <h3>Update Order</h3>
        <input type="text" placeholder="Order ID" value={updateOrderId} onChange={(e) => setUpdateOrderId(e.target.value)} />
        <input type="text" placeholder="New User ID (optional)" value={updateOrderUserId} onChange={(e) => setUpdateOrderUserId(e.target.value)} />
        <input type="text" placeholder="New Product ID (optional)" value={updateOrderProductId} onChange={(e) => setUpdateOrderProductId(e.target.value)} />
        <input type="number" placeholder="New Quantity (optional)" value={updateOrderQuantity} onChange={(e) => setUpdateOrderQuantity(e.target.value)} />
        <button onClick={handleUpdateOrder}>Update Order</button>

        <h3>Delete Order</h3>
        <input type="text" placeholder="Order ID to delete" value={deleteOrderId} onChange={(e) => setDeleteOrderId(e.target.value)} />
        <button onClick={handleDeleteOrder}>Delete Order</button>

        <h3>All Orders ({data.orders.length})</h3>
        <ul>
          {data.orders.map((order) => (
            <li key={order.id}>
              ID: {order.id}, Qty: {order.quantity}
              {order.user && ` (User: ${order.user.name}, ID: ${order.user.id})`}
              {order.product && ` (Product: ${order.product.name}, ID: ${order.product.id})`}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;