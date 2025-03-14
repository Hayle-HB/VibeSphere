# RealTimeChat - Server Architecture

## Project Structure

```
server/
├── config/                     # Configuration files
│   ├── database.js             # Database connection configuration
│   ├── socket.js               # Socket.io configuration
│   ├── passport.js             # Authentication strategies
│   └── aws.js                  # AWS S3 configuration for media storage
│
├── controllers/                # Request handlers
│   ├── authController.js       # Authentication logic
│   ├── userController.js       # User management
│   ├── messageController.js    # Message handling
│   ├── groupController.js      # Group chat management
│   ├── mediaController.js      # Media file handling
│   └── notificationController.js # Notification logic
│
├── middleware/                 # Express middleware
│   ├── auth.js                 # Authentication middleware
│   ├── errorHandler.js         # Global error handler
│   ├── rateLimiter.js          # Rate limiting for API abuse prevention
│   ├── validation.js           # Request validation
│   └── upload.js               # File upload middleware
│
├── models/                     # Database models
│   ├── User.js                 # User model
│   ├── Message.js              # Message model
│   ├── Group.js                # Group chat model
│   ├── Media.js                # Media files model
│   └── Notification.js         # Notification model
│
├── routes/                     # API routes
│   ├── authRoutes.js           # Authentication endpoints
│   ├── userRoutes.js           # User management endpoints
│   ├── messageRoutes.js        # Message endpoints
│   ├── groupRoutes.js          # Group management endpoints
│   ├── mediaRoutes.js          # Media handling endpoints
│   └── notificationRoutes.js   # Notification endpoints
│
├── services/                   # Business logic
│   ├── authService.js          # Authentication services
│   ├── messageService.js       # Message handling services
│   ├── notificationService.js  # Push notification services
│   ├── socketService.js        # WebSocket event handlers
│   ├── storageService.js       # File storage service
│   └── encryptionService.js    # End-to-end encryption utilities
│
├── sockets/                    # Socket.io event handlers
│   ├── chatHandler.js          # Chat message events
│   ├── presenceHandler.js      # Online/offline status
│   ├── typingHandler.js        # Typing indicators
│   └── notificationHandler.js  # Real-time notifications
│
├── utils/                      # Utility functions
│   ├── logger.js               # Logging utility
│   ├── validators.js           # Input validation helpers
│   ├── formatters.js           # Response formatters
│   └── encryption.js           # Encryption utilities
│
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── fixtures/               # Test fixtures
│
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── app.js                      # Express app setup
├── server.js                   # Server entry point
├── socket.js                   # Socket.io initialization
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Setup and Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/realtimechat.git
   cd realtimechat/server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **For production**
   ```bash
   npm start
   ```

## Database Setup

The application uses MongoDB as its primary database. You can configure the connection in `config/database.js`.

```javascript
// Example database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

## WebSocket Implementation

Real-time features are implemented using Socket.io. The main socket server is initialized in `socket.js` and event handlers are organized in the `sockets/` directory.

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/facebook` - Facebook OAuth authentication
- `POST /api/auth/2fa/enable` - Enable two-factor authentication
- `POST /api/auth/2fa/verify` - Verify 2FA code

### User Management

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/status` - Get user online status
- `PUT /api/users/status` - Update user status
- `POST /api/users/block` - Block a user
- `POST /api/users/report` - Report a user
- `GET /api/users/search` - Search for users

### Messages

- `GET /api/messages/:chatId` - Get messages in a chat
- `POST /api/messages` - Send a new message
- `PUT /api/messages/:messageId` - Edit a message
- `DELETE /api/messages/:messageId` - Delete a message
- `POST /api/messages/:messageId/react` - React to a message
- `POST /api/messages/pin` - Pin a message
- `GET /api/messages/search` - Search messages

### Groups

- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/:groupId` - Get group details
- `PUT /api/groups/:groupId` - Update group details
- `POST /api/groups/:groupId/members` - Add member to group
- `DELETE /api/groups/:groupId/members/:userId` - Remove member from group
- `PUT /api/groups/:groupId/admin` - Assign admin role

### Media

- `POST /api/media/upload` - Upload media files
- `GET /api/media/:mediaId` - Get media file
- `DELETE /api/media/:mediaId` - Delete media file

### Notifications

- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:notificationId/read` - Mark notification as read
- `POST /api/notifications/settings` - Update notification settings

## Security Implementation

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent brute force attacks
- Input validation and sanitization
- End-to-end encryption for messages
- CORS configuration

## Environment Variables

```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/realtimechat

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_aws_region

# Push Notifications
FIREBASE_SERVER_KEY=your_firebase_server_key
```

## Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


















```
WebSocket Implementation
Real-time features are implemented using Socket.io. The main socket server is initialized in socket.js and event handlers are organized in the sockets/ directory.
API Endpoints
Authentication
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
POST /api/auth/refresh-token - Refresh JWT token
POST /api/auth/google - Google OAuth authentication
POST /api/auth/facebook - Facebook OAuth authentication
POST /api/auth/2fa/enable - Enable two-factor authentication
POST /api/auth/2fa/verify - Verify 2FA code
User Management
GET /api/users/profile - Get current user profile
PUT /api/users/profile - Update user profile
GET /api/users/status - Get user online status
PUT /api/users/status - Update user status
POST /api/users/block - Block a user
POST /api/users/report - Report a user
GET /api/users/search - Search for users
Messages
GET /api/messages/:chatId - Get messages in a chat
POST /api/messages - Send a new message
PUT /api/messages/:messageId - Edit a message
DELETE /api/messages/:messageId - Delete a message
POST /api/messages/:messageId/react - React to a message
POST /api/messages/pin - Pin a message
GET /api/messages/search - Search messages
Groups
POST /api/groups - Create a new group
GET /api/groups - Get user's groups
GET /api/groups/:groupId - Get group details
PUT /api/groups/:groupId - Update group details
POST /api/groups/:groupId/members - Add member to group
DELETE /api/groups/:groupId/members/:userId - Remove member from group
PUT /api/groups/:groupId/admin - Assign admin role
Media
POST /api/media/upload - Upload media files
GET /api/media/:mediaId - Get media file
DELETE /api/media/:mediaId - Delete media file
Notifications
GET /api/notifications - Get user notifications
PUT /api/notifications/:notificationId/read - Mark notification as read
POST /api/notifications/settings - Update notification settings
Security Implementation
JWT-based authentication
Password hashing with bcrypt
Rate limiting to prevent brute force attacks
Input validation and sanitization
End-to-end encryption for messages
CORS configuration
Environment Variables
Testing
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.


```




















## License

This project is licensed under the MIT License - see the LICENSE file for details.

