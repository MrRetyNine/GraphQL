# 🚀 GraphQL Microservices Architecture

Микросервисная система на GraphQL с Apollo Federation, состоящая из 4 сервисов и клиентского приложения.

## 📦 Состав системы

| Сервис           | Порт  | Описание                  |
|------------------|-------|---------------------------|
| Gateway          | 4000  | Входная точка Federation  |
| Users Service    | 4001  | Управление пользователями |
| Orders Service   | 4002  | Управление заказами       |
| Products Service | 4003  | Управление товарами       |
| Client App       | 3000  | React-приложение          |


## 🚀 Запуск системы

### 1. Запуск сервисов

Откройте отдельные терминалы для каждого сервиса:

```bash
# Сервис пользователей
cd users-service
node index.js

# Сервис заказов
cd orders-service
node index.js

# Сервис товаров
cd products-service
node index.js

# API Gateway (тажке можно просто через Run code)
cd gateway
node index.js
```

### 2. Запуск клиентского приложения
