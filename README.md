## 1. System Architecture

```text
                               +---------------------------------+
                               |    React.js Frontend Client     |
                               |          (Port: 3000)           |
                               +----------------+----------------+
                                                |
               +--------------------------------+--------------------------------+
               |                                |                                |
               v                                v                                v
     +-------------------+            +-------------------+            +-------------------+
     |  Product Service  |            |   User Service    |            |   Order Service   |
     |   (Port: 5001)    |            |   (Port: 5002)    |            |   (Port: 5003)    |
     +---------+---------+            +---------+---------+            +---------+---------+
               |                                |                                |
               |                                |         +----------------------+
               |                                |         | (Processes payment)
               |                                |         v
               |                                |  +-------------------+
               |                                |  |  Payment Service  |
               |                                |  |   (Port: 5004)    |
               |                                |  +---------+---------+
               |                                |            |
               +----------------+---------------+------------+
                                |
                                v
               +---------------------------------+
               |       MongoDB Database          |
               |         (Port: 27017)           |
               |   Databases: products, users,   |
               |         orders, payments        |
               +----------------+----------------+
                                |
                                v
               +---------------------------------+
               | Docker Volume: `mongo-data`     |
               |      (Persistent Storage)       |
               +---------------------------------+
```

---

## 2. Technologies Used

* **Frontend**: React.js 18 (HTML5, Vanilla CSS3, Modern ES6+ JavaScript)
* **Backend Microservices**: Node.js & Express.js
* **Database**: MongoDB (Official Docker image `mongo:8.0.4` with Mongoose ODM)
* **API Style**: RESTful JSON APIs
* **Containerization**: Docker
* **Local Container Orchestration**: Docker Compose
* **Continuous Integration & Deployment (CI/CD)**: Jenkins (Declarative Pipeline)
* **Version Control**: Git & GitHub

---

## 3. Project Structure

```text
ecommerce-microservices/
│
├── services/
│   │
│   ├── product-service/
│   │   ├── models/Product.js               # Mongoose schema for products
│   │   ├── controllers/productController.js # CRUD, search, and seed controllers
│   │   ├── routes/productRoutes.js         # Express routes for /api/products
│   │   ├── seed.js                         # Standalone DB seeder script
│   │   ├── seedData.json                   # 10 realistic tech products
│   │   ├── server.js                       # Express app entrypoint (Port 5001)
│   │   ├── package.json                    # Dependencies and scripts
│   │   ├── .env                            # Environment variables
│   │   ├── .env.example                    # Template environment variables
│   │   └── Dockerfile                      # Container build definition
│   │
│   ├── user-service/
│   │   ├── models/User.js                  # Mongoose schema for users
│   │   ├── controllers/userController.js   # Register, login, profile controllers
│   │   ├── routes/userRoutes.js            # Express routes for /api/users
│   │   ├── server.js                       # Express app entrypoint (Port 5002)
│   │   ├── package.json                    # Dependencies and scripts
│   │   ├── .env                            # Environment variables
│   │   ├── .env.example                    # Template environment variables
│   │   └── Dockerfile                      # Container build definition
│   │
│   ├── order-service/
│   │   ├── models/Order.js                 # Mongoose schema for orders
│   │   ├── controllers/orderController.js  # Create, view, update order controllers
│   │   ├── routes/orderRoutes.js           # Express routes for /api/orders
│   │   ├── server.js                       # Express app entrypoint (Port 5003)
│   │   ├── package.json                    # Dependencies and scripts
│   │   ├── .env                            # Environment variables
│   │   ├── .env.example                    # Template environment variables
│   │   └── Dockerfile                      # Container build definition
│   │
│   └── payment-service/
│       ├── models/Payment.js               # Mongoose schema for payments
│       ├── controllers/paymentController.js# Payment simulation controller
│       ├── routes/paymentRoutes.js         # Express routes for /api/payments
│       ├── server.js                       # Express app entrypoint (Port 5004)
│       ├── package.json                    # Dependencies and scripts
│       ├── .env                            # Environment variables
│       ├── .env.example                    # Template environment variables
│       └── Dockerfile                      # Container build definition
│
├── client/
│   ├── public/
│   │   └── index.html                      # HTML template with Google Fonts
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js                   # Header, search, categories, auth, cart
│   │   │   ├── ProductCard.js              # Product display tile
│   │   │   ├── ProductList.js              # Responsive product grid
│   │   │   ├── Cart.js                     # Cart items and total calculation
│   │   │   └── Footer.js                   # Amazon-style footer & architecture info
│   │   ├── pages/
│   │   │   ├── Home.js                     # Landing hero banner & featured gadgets
│   │   │   ├── Products.js                 # Catalog filterable by category
│   │   │   ├── ProductDetails.js           # Product specifications & Buy Now
│   │   │   ├── Login.js                    # User authentication sign-in
│   │   │   ├── Register.js                 # Account creation
│   │   │   ├── CartPage.js                 # Shopping cart view
│   │   │   ├── Orders.js                   # Orders history & status tracker
│   │   │   └── PaymentPage.js              # Checkout & payment simulation (UPI/CARD/COD)
│   │   ├── services/
│   │   │   └── api.js                      # REST API client connecting to all 4 ports
│   │   ├── App.js                          # Main routing & state coordinator
│   │   ├── App.css                         # Polished Amazon-like CSS design
│   │   ├── index.js                        # React DOM mounting
│   │   └── index.css                       # Global styles and resets
│   ├── package.json                        # React scripts and dependencies
│   ├── .env                                # Client environment configuration
│   ├── .env.example                        # Template environment variables
│   └── Dockerfile                          # Client container build definition
│
├── docker-compose.yml                      # Multi-container orchestration specification
├── Jenkinsfile                             # Declarative CI/CD pipeline
├── .gitignore                              # Git ignore rules
└── README.md                               # Complete project documentation
```

---

## 4. Microservices Breakdown

| Service | Port | Database / Collection | Key Responsibilities | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Product Service** | `5001` | `products` | CRUD products, search by name, category filtering, sample seed | `GET /api/products`<br>`GET /api/products/:id`<br>`POST /api/products`<br>`PUT /api/products/:id`<br>`DELETE /api/products/:id`<br>`GET /api/products/search/:name`<br>`POST /api/products/seed` |
| **User Service** | `5002` | `users` | User registration, login authentication, user profile lookup | `POST /api/users/register`<br>`POST /api/users/login`<br>`GET /api/users/:id` |
| **Order Service** | `5003` | `orders` | Create orders, fetch user orders, update order status | `POST /api/orders`<br>`GET /api/orders`<br>`GET /api/orders/:id`<br>`PUT /api/orders/:id` |
| **Payment Service**| `5004` | `payments` | Payment simulation (UPI, CARD, COD), status verification | `POST /api/payments`<br>`GET /api/payments/:id` |

---
importtanet:
pre-requirememnt: 
ec2: docker and compose, java, enable port 3000,5001,5002,5003,5004(security groups)

---

