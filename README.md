# Amazon Clone - MERN Microservices E-Commerce Application

A complete, production-style, containerized **E-Commerce Microservices Application** built specifically for a **DevOps Fresher Resume & Portfolio Project**.

The project simulates an Amazon-like shopping platform with independent microservices running in Docker containers, coordinated by Docker Compose, automated via a Jenkins CI/CD pipeline, and backed by MongoDB with persistent storage.

---

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

## 5. How to Run Locally with Docker Compose

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / Mac) or Docker Engine + Docker Compose Plugin (Linux).
* Git installed.

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_GITHUB_USERNAME/ecommerce-microservices.git
cd ecommerce-microservices

# 2. Build all Docker container images
docker compose build

# 3. Launch all containers in detached (background) mode
docker compose up -d

# 4. Verify that all 6 containers are running
docker compose ps
```

### Accessing the Applications
* **Frontend Web Application**: [http://localhost:3000](http://localhost:3000)
* **Product Service API**: [http://localhost:5001/api/products](http://localhost:5001/api/products)
* **User Service API**: [http://localhost:5002/health](http://localhost:5002/health)
* **Order Service API**: [http://localhost:5003/health](http://localhost:5003/health)
* **Payment Service API**: [http://localhost:5004/health](http://localhost:5004/health)
* **MongoDB Database**: `localhost:27017`

### Automatic Fixed Data via Mount
The application uses Docker's `/docker-entrypoint-initdb.d` volume mount (`./mongo-init:/docker-entrypoint-initdb.d:ro`). 
When MongoDB boots up, it automatically loads all 10 fixed tech products and a demo customer account into MongoDB without requiring any manual seeding scripts or buttons.

---

## 6. Docker Commands Reference

Here is a guide to every essential Docker Compose command:

```bash
# Build (or rebuild) container images from Dockerfiles
docker compose build

# Start containers in detached mode (-d runs in background)
docker compose up -d

# Check running status, container names, and port mappings
docker compose ps

# View live real-time logs across all microservices
docker compose logs -f

# View logs for a specific service only
docker compose logs -f product-service

# Stop and remove containers and virtual networks (preserves database data)
docker compose down

# Stop containers AND delete persistent MongoDB data volume
docker compose down -v
```

### What does each command do?
* `docker compose build`: Reads each `Dockerfile` specified in `docker-compose.yml`, pulls the `node:21` base images, copies code, installs `npm` dependencies, and creates reusable container images.
* `docker compose up -d`: Creates a bridge network, initializes the `mongo-data` volume, and boots up all containers in the proper dependency order in the background.
* `docker compose ps`: Lists all containers managed by Docker Compose along with their ports and health state.
* `docker compose logs`: Streams terminal stdout/stderr logs from all services, crucial for debugging backend runtime issues.
* `docker compose down`: Gracefully stops all active containers and removes the bridge network, leaving database data intact.
* `docker compose down -v`: Same as `down`, but deletes the `mongo-data` volume, resetting the database completely.

---

## 7. Jenkins CI/CD Pipeline

The included `Jenkinsfile` provides a simple, declarative CI/CD pipeline tailored for Linux-based Jenkins nodes.

### CI/CD Workflow Diagram

```text
+---------------+
|   Developer   |
+-------+-------+
        | (git push)
        v
+---------------+
|    GitHub     |
+-------+-------+
        | (Webhook / Poll SCM)
        v
+---------------+
|    Jenkins    |
+-------+-------+
        |
        +---> [Stage 1: Checkout]     (Pulls latest code from Git)
        |
        +---> [Stage 2: Build]        (Validates environment & Docker tools)
        |
        +---> [Stage 3: Test]         (Validates docker-compose.yml config)
        |
        +---> [Stage 4: Docker Build] (Executes 'docker compose build')
        |
        +---> [Stage 5: Deploy]       (Executes 'docker compose up -d')
        v
+-----------------------------+
| Live Application Containers |
+-----------------------------+
```

### Setting Up the Jenkins Job
1. In Jenkins, select **New Item** > **Pipeline** > Click **OK**.
2. Under **Pipeline Definition**, select **Pipeline script from SCM**.
3. SCM: **Git**.
4. Repository URL: `https://github.com/YOUR_GITHUB_USERNAME/ecommerce-microservices.git`.
5. Script Path: `Jenkinsfile`.
6. Click **Save** and click **Build Now**.

---

## 8. API Testing Guide with cURL

You can test all microservice APIs independently using standard `curl` commands:

### Product Service (:5001)

```bash
# 1. Seed sample products
curl -X POST http://localhost:5001/api/products/seed

# 2. Get all products
curl -X GET http://localhost:5001/api/products

# 3. Search product by name
curl -X GET http://localhost:5001/api/products/search/laptop

# 4. Filter by category
curl -X GET "http://localhost:5001/api/products?category=Computers"

# 5. Create a new custom product
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mechanical Keyboard RGB",
    "description": "Tactile switch mechanical gaming keyboard with RGB backlighting.",
    "price": 89.99,
    "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
    "category": "Accessories",
    "stock": 15
  }'
```

### User Service (:5002)

```bash
# 1. Register a new user
curl -X POST http://localhost:5002/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }'

# 2. Login user
curl -X POST http://localhost:5002/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Order Service (:5003)

```bash
# 1. Create a new order
curl -X POST http://localhost:5003/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "664b8a1c92ef9a0014b43210",
    "products": [
      {
        "productId": "664b8a1c92ef9a0014b43201",
        "name": "Ultra Slim Laptop Pro 15",
        "price": 899.99,
        "quantity": 1
      }
    ],
    "totalAmount": 899.99,
    "address": "123 Main Street, Suite 400, Austin, TX"
  }'

# 2. Get all orders
curl -X GET http://localhost:5003/api/orders
```

### Payment Service (:5004)

```bash
# 1. Simulate checkout payment (UPI, CARD, or COD)
curl -X POST http://localhost:5004/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "664b8a1c92ef9a0014b43999",
    "userId": "664b8a1c92ef9a0014b43210",
    "amount": 899.99,
    "paymentMethod": "UPI"
  }'
```

---

## 9. Deploying on an Ubuntu EC2 Server (AWS)

Follow this quick guide to deploy this project live on an AWS EC2 instance:

```bash
# Step 1: Connect to your Ubuntu EC2 instance
ssh -i "your-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>

# Step 2: Update packages and install Docker & Docker Compose
sudo apt update -y && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin git

# Step 3: Add ubuntu user to docker group (avoids needing sudo for docker)
sudo usermod -aG docker ubuntu
newgrp docker

# Step 4: Clone your repository
git clone https://github.com/YOUR_GITHUB_USERNAME/ecommerce-microservices.git
cd ecommerce-microservices

# Step 5: Open AWS Security Group inbound ports:
# 3000 (React), 5001 (Products), 5002 (Users), 5003 (Orders), 5004 (Payments)

# Step 6: Start all microservices in the background
docker compose up -d --build

# Step 7: Check running containers
docker compose ps
```

---

## 10. DevOps Fresher Interview Questions & Answers

### Q1: Why did you choose a Microservices architecture instead of a Monolith for this project?
**Answer:**
> In a monolithic architecture, the entire application (products, users, checkout, payments) is bundled into a single codebase and deployed as one unit. If one component fails (e.g., a memory leak in payments), the entire application goes down. In this microservices architecture, each domain (Product, User, Order, Payment) is an independent service with its own dependencies, port, and database. They can be developed, scaled, and deployed independently without affecting other services.

### Q2: How do containers communicate with MongoDB inside Docker Compose? Why not use `localhost`?
**Answer:**
> Inside a Docker container, `localhost` refers to the container's own loopback network interface, not the host machine or other containers. Docker Compose creates an isolated bridge network (here `ecommerce-network`). Docker runs an internal DNS server that automatically maps the service name `mongo` to the MongoDB container's internal IP address. Therefore, the connection string `mongodb://mongo:27017/products` allows microservices to resolve and talk to MongoDB across containers.

### Q3: How is database persistence handled? What happens if the MongoDB container crashes or is deleted?
**Answer:**
> Containers are ephemeral by default; when a container is deleted, any data stored inside its writable layer is lost. To prevent data loss, we configured a Docker named volume called `mongo-data` and mounted it to MongoDB's internal data directory `/data/db`:
> ```yaml
> volumes:
>   - mongo-data:/data/db
> ```
> Named volumes are stored on the host filesystem outside the container lifecycle. Even if the `mongo` container is stopped or recreated with `docker compose down` and `docker compose up -d`, the database files remain intact in the volume.

### Q4: Why does each microservice use a separate database name in MongoDB?
**Answer:**
> This follows the fundamental microservice pattern: **Database-per-Service**. Product Service writes to the `products` database, User Service to `users`, Order Service to `orders`, and Payment Service to `payments`. This ensures loose coupling—no service can directly query or modify another service's tables/collections, guaranteeing that each microservice manages its own data integrity.

### Q5: What is the purpose of the `depends_on` tag in `docker-compose.yml`?
**Answer:**
> `depends_on` defines startup order dependencies between containers. For example, `product-service` specifies `depends_on: - mongo`, which instructs Docker Compose to start the MongoDB container before launching the Product Service container. Similarly, the React frontend specifies `depends_on` for the four backend microservices.

### Q6: How does the Jenkins CI/CD pipeline automate the deployment?
**Answer:**
> The Jenkins pipeline defined in `Jenkinsfile` uses declarative syntax:
> 1. **Checkout**: Automatically pulls the latest code pushed to GitHub.
> 2. **Build**: Checks the Docker environment and Compose binaries.
> 3. **Test**: Executes `docker compose config` to validate syntax and configuration without running containers.
> 4. **Docker Build**: Builds fresh Docker images for all services.
> 5. **Deploy**: Runs `docker compose up -d`, updating any modified containers with zero downtime.

---

## 11. License & Acknowledgements
This project is open-source and intended for educational and career portfolio purposes. Designed for DevOps freshers to demonstrate practical microservices, Docker, Docker Compose, and CI/CD skills.
