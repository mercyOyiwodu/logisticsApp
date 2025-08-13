# Logistics App API

A comprehensive logistics management system with user authentication, order management, and real-time tracking capabilities.

## Features

- **User Management**: Registration, login, email verification, password reset
- **Order Management**: Create, track, and manage delivery orders
- **Real-time Tracking**: GPS-based location tracking for orders
- **Role-based Access**: Customer, Driver, and Admin roles
- **Email Notifications**: Automated email notifications for various events

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account for email notifications

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   - MongoDB connection string
   - JWT secret key
   - Gmail credentials for email notifications
   - Other required environment variables

5. Start the server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3000`

## API Endpoints

### User Authentication

#### Register User
- **POST** `/api/user/register`
- **Body**:
  ```json
  {
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "gender": "Male"
  }
  ```

#### Login
- **POST** `/api/user/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Verify Email
- **GET** `/api/user/verify-email/:token`

#### Forgot Password
- **POST** `/api/user/forgot-password`
- **Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```

#### Reset Password
- **GET** `/api/user/reset-password/:token`

#### Logout
- **GET** `/api/user/logout`

### Order Management

#### Create Order
- **POST** `/api/order/create`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "pickupLocation": "123 Main St, City A",
    "deliveryLocation": "456 Oak Ave, City B"
  }
  ```

#### Get User Orders
- **GET** `/api/order/my-orders`
- **Headers**: `Authorization: Bearer <token>`

#### Track Order (Public)
- **GET** `/api/order/track/:trackingId`

#### Get All Orders (Admin Only)
- **GET** `/api/order/all`
- **Headers**: `Authorization: Bearer <admin_token>`

#### Update Order Status (Admin Only)
- **PUT** `/api/order/:orderId/status`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Body**:
  ```json
  {
    "status": "in_transit"
  }
  ```

#### Assign Driver (Admin Only)
- **PUT** `/api/order/:orderId/assign-driver`
- **Headers**: `Authorization: Bearer <admin_token>`
- **Body**:
  ```json
  {
    "driverId": "driver_user_id"
  }
  ```

#### Update Location (Driver)
- **PUT** `/api/order/:orderId/location`
- **Headers**: `Authorization: Bearer <driver_token>`
- **Body**:
  ```json
  {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```

## User Roles

- **Customer**: Can create orders and track their own orders
- **Driver**: Can update location for assigned orders
- **Admin**: Full access to all orders, can assign drivers and update order status

## Order Status

- `pending`: Order created, waiting for driver assignment
- `in_transit`: Driver assigned, order in progress
- `delivered`: Order successfully delivered
- `canceled`: Order canceled

## Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // Response data (when applicable)
}
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Validation**: Joi
- **Password Hashing**: bcryptjs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.