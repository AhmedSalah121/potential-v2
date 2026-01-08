# Store API

An e-commerce REST API built with NestJS, Prisma, and Postgresql.

## Description

This is a comprehensive e-commerce backend application with authentication, product management, cart functionality, orders, reviews, and categories.

## Project setup

```bash
$ npm install
```

## API Documentation

The API is documented using Swagger will be available at the following URL, once it is ready:
- **Production**: https://potential-v2.vercel.app/api/docs

## API Endpoints

### Base URLs
- **Production**: https://potential-v2.vercel.app/

### Authentication Endpoints

#### 1. Register User
- **URL**: `POST /auth/register`
- **Description**: Create a new user account
- **Authentication**: None required
- **Request Body**:
```json
{
  "username": "ahmed",
  "firstName": "Ahmed",
  "lastName": "Salah",
  "phone": "+201234567890",
  "password": "password",
  "email": "ahmed@gmail.com"
}
```
- **Response** (201):
```json
{
  "token": "jwt-token"
}
```

#### 2. Login
- **URL**: `POST /auth/login`
- **Description**: Authenticate user and receive JWT token
- **Authentication**: None required
- **Request Body**:
```json
{
  "username": "ahmed",
  "password": "password"
}
```
- **Response** (200):
```json
{
  "token": "jwt-token"
}
```

#### 3. Get Current User
- **URL**: `GET /auth/me`
- **Description**: Get authenticated user information
- **Authentication**: Required (Bearer Token)
- **Headers**:
```
Authorization: Bearer <your-token>
```
- **Response** (200):
```json
{
  "userId": "uuid",
  "username": "ahmed",
  "email": "ahmed@gmail.com",
  "role": "CUSTOMER"
}
```

---

### Product Endpoints

**Note**: All product endpoints require authentication (Bearer Token)

#### 1. Create Product
- **URL**: `POST /products/create`
- **Description**: Create a new product (Admin/Seller only)
- **Authentication**: Required (Bearer Token) - Roles: ADMIN, SELLER
- **Headers**:
```
Authorization: Bearer <your-token>
```
- **Request Body**:
```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone with A17 Pro chip",
  "price": 999.99,
  "stock": 50,
  "sku": "IPHONE15PRO-256-BLK",
  "imageUrl": "https://example.com/images/iphone15.jpg",
  "isActive": true,
  "categoryId": "category-uuid"
}
```
- **Response** (201):
```json
{
  "id": "product-uuid",
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone with A17 Pro chip",
  "price": "999.99",
  "stock": 50,
  "sku": "IPHONE15PRO-256-BLK",
  "imageUrl": "https://example.com/images/iphone15.jpg",
  "isActive": true,
  "categoryId": "category-uuid",
  "userId": "user-uuid",
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 2. Get All Products
- **URL**: `GET /products/find`
- **Description**: Retrieve all products
- **Authentication**: Required (Bearer Token)
- **Response** (200):
```json
[
  {
    "id": "product-uuid",
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "price": "999.99",
    "stock": 50,
    "sku": "IPHONE15PRO-256-BLK",
    "imageUrl": "https://example.com/images/iphone15.jpg",
    "isActive": true,
    "categoryId": "category-uuid",
    "userId": "user-uuid",
    "createdAt": "2025-12-28T00:00:00.000Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  }
]
```

#### 3. Get Product by ID
- **URL**: `GET /products/:id`
- **Description**: Retrieve a single product by ID
- **Authentication**: Required (Bearer Token)
- **URL Parameters**: `id` (string) - Product UUID
- **Example**: `GET /products/123e4567-e89b-12d3-a456-426614174000`
- **Response** (200):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone",
  "price": "999.99",
  "stock": 50,
  "sku": "IPHONE15PRO-256-BLK",
  "imageUrl": "https://example.com/images/iphone15.jpg",
  "isActive": true,
  "categoryId": "category-uuid",
  "userId": "user-uuid",
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 4. Search Products
- **URL**: `GET /products/search/:name`
- **Description**: Search products by name with pagination
- **Authentication**: Required (Bearer Token)
- **URL Parameters**: `name` (string) - Search term
- **Query Parameters**: 
  - `limit` (number, optional) - Number of results per page (default: 10)
  - `offset` (number, optional) - Number of results to skip (default: 0)
- **Example**: `GET /products/search/iphone?limit=10&offset=0`
- **Response** (200):
```json
[
  {
    "id": "product-uuid",
    "name": "iPhone 15 Pro",
    "description": "Latest Apple smartphone",
    "price": "999.99",
    "stock": 50,
    "sku": "IPHONE15PRO-256-BLK",
    "imageUrl": "https://example.com/images/iphone15.jpg",
    "isActive": true,
    "categoryId": "category-uuid",
    "userId": "user-uuid",
    "createdAt": "2025-12-28T00:00:00.000Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  }
]
```

#### 5. Update Product
- **URL**: `PATCH /products/:id`
- **Description**: Update a product by ID
- **Authentication**: Required (Bearer Token)
- **URL Parameters**: `id` (string) - Product UUID
- **Request Body** (all fields optional):
```json
{
  "name": "iPhone 15 Pro Max",
  "price": 1099.99,
  "stock": 30,
  "description": "Updated description",
  "imageUrl": "https://example.com/images/new-image.jpg",
  "isActive": false
}
```
- **Response** (200):
```json
{
  "id": "product-uuid",
  "name": "iPhone 15 Pro Max",
  "description": "Updated description",
  "price": "1099.99",
  "stock": 30,
  "sku": "IPHONE15PRO-256-BLK",
  "imageUrl": "https://example.com/images/new-image.jpg",
  "isActive": false,
  "categoryId": "category-uuid",
  "userId": "user-uuid",
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 6. Delete Product
- **URL**: `DELETE /products/:id`
- **Description**: Delete a product by ID
- **Authentication**: Required (Bearer Token)
- **URL Parameters**: `id` (string) - Product UUID
- **Response** (200):
```json
{
  "message": "Product deleted successfully"
}
```

---

### Cart Endpoints

**Note**: All cart endpoints require authentication (Bearer Token)

#### 1. Get Cart
- **URL**: `GET /cart`
- **Description**: Retrieve current user's cart with items
- **Authentication**: Required (Bearer Token)
- **Headers**:
```
Authorization: Bearer <your-token>
```
- **Response** (200):
```json
{
  "id": "cart-uuid",
  "userId": "user-uuid",
  "status": "ACTIVE",
  "items": [
    {
      "id": "cart-item-uuid",
      "cartId": "cart-uuid",
      "productId": "product-uuid",
      "quantity": 2,
      "product": {
        "id": "product-uuid",
        "name": "iPhone 15 Pro",
        "price": "999.99",
        "imageUrl": "https://example.com/images/iphone15.jpg"
      }
    }
  ],
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 2. Update Cart Item
- **URL**: `PATCH /cart/update`
- **Description**: Add or update product quantity in cart
- **Authentication**: Required (Bearer Token)
- **Request Body**:
```json
{
  "productId": "product-uuid",
  "qty": 3
}
```
- **Response** (200):
```json
{
  "id": "cart-uuid",
  "userId": "user-uuid",
  "status": "ACTIVE",
  "items": [
    {
      "id": "cart-item-uuid",
      "cartId": "cart-uuid",
      "productId": "product-uuid",
      "quantity": 3
    }
  ],
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 3. Remove Cart Item
- **URL**: `DELETE /cart/items/:productId`
- **Description**: Remove a product from cart
- **Authentication**: Required (Bearer Token)
- **URL Parameters**: `productId` (string) - Product UUID
- **Example**: `DELETE /cart/items/123e4567-e89b-12d3-a456-426614174000`
- **Response** (200):
```json
{
  "id": "cart-uuid",
  "userId": "user-uuid",
  "status": "ACTIVE",
  "items": [],
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

---

### Category Endpoints

#### 1. Create Category
- **URL**: `POST /categories`
- **Description**: Create a new category
- **Authentication**: None required
- **Request Body**:
```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "slug": "electronics"
}
```
- **Response** (201):
```json
{
  "id": "category-uuid",
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "slug": "electronics",
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 2. Get All Categories
- **URL**: `GET /categories`
- **Description**: Retrieve all categories
- **Authentication**: None required
- **Response** (200):
```json
[
  {
    "id": "category-uuid",
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "slug": "electronics",
    "createdAt": "2025-12-28T00:00:00.000Z",
    "updatedAt": "2025-12-28T00:00:00.000Z"
  }
]
```

#### 3. Get Category by ID
- **URL**: `GET /categories/:id`
- **Description**: Retrieve a single category by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Category ID
- **Example**: `GET /categories/1`
- **Response** (200):
```json
{
  "id": "category-uuid",
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "slug": "electronics",
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 4. Update Category
- **URL**: `PATCH /categories/:id`
- **Description**: Update a category by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Category ID
- **Request Body** (all fields optional):
```json
{
  "name": "Consumer Electronics",
  "description": "Updated description"
}
```
- **Response** (200):
```json
{
  "id": "category-uuid",
  "name": "Consumer Electronics",
  "description": "Updated description",
  "slug": "electronics",
  "createdAt": "2025-12-28T00:00:00.000Z",
  "updatedAt": "2025-12-28T00:00:00.000Z"
}
```

#### 5. Delete Category
- **URL**: `DELETE /categories/:id`
- **Description**: Delete a category by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Category ID
- **Response** (200):
```json
{
  "message": "Category deleted successfully"
}
```

---

### Order Endpoints

#### 1. Create Order
- **URL**: `POST /orders`
- **Description**: Create a new order
- **Authentication**: None required
- **Request Body**: To be implemented
- **Response** (201): Order object

#### 2. Get All Orders
- **URL**: `GET /orders`
- **Description**: Retrieve all orders
- **Authentication**: None required
- **Response** (200): Array of order objects

#### 3. Get Order by ID
- **URL**: `GET /orders/:id`
- **Description**: Retrieve a single order by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Order ID
- **Response** (200): Order object

#### 4. Update Order
- **URL**: `PATCH /orders/:id`
- **Description**: Update an order by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Order ID
- **Request Body**: To be implemented
- **Response** (200): Updated order object

#### 5. Delete Order
- **URL**: `DELETE /orders/:id`
- **Description**: Delete an order by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Order ID
- **Response** (200): Deletion confirmation

---

### Review Endpoints

#### 1. Create Review
- **URL**: `POST /reviews`
- **Description**: Create a new product review
- **Authentication**: None required
- **Request Body**: To be implemented
- **Response** (201): Review object

#### 2. Get All Reviews
- **URL**: `GET /reviews`
- **Description**: Retrieve all reviews
- **Authentication**: None required
- **Response** (200): Array of review objects

#### 3. Get Review by ID
- **URL**: `GET /reviews/:id`
- **Description**: Retrieve a single review by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Review ID
- **Response** (200): Review object

#### 4. Update Review
- **URL**: `PATCH /reviews/:id`
- **Description**: Update a review by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Review ID
- **Request Body**: To be implemented
- **Response** (200): Updated review object

#### 5. Delete Review
- **URL**: `DELETE /reviews/:id`
- **Description**: Delete a review by ID
- **Authentication**: None required
- **URL Parameters**: `id` (number) - Review ID
- **Response** (200): Deletion confirmation

### User Roles
- **CUSTOMER**: Default role for registered users
- **SELLER**: Can create and manage their products
- **ADMIN**: Full access to all resources
---

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run dev
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database

This project uses PostgreSQL with Prisma ORM. Run migrations:

```bash
# Generate Prisma Client
$ npm run prisma:generate

# Run migrations
$ npx prisma migrate deploy
```
