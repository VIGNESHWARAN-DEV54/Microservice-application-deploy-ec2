pipeline {
    agent any

    environment {
        // Change this to your GitHub repo URL when deploying in Jenkins
        REPO_URL = 'https://github.com/YOUR_GITHUB_USERNAME/ecommerce-microservices.git'
    }

    stages {
        // Stage 1: Checkout Source Code
        stage('Checkout') {
            steps {
                echo 'Checking out source code from Git repository...'
                // When running with multibranch pipeline or webhook, checkout scm is automatic.
                // For standalone pipelines, replace with your git repo URL:
                checkout scm
            }
        }

        // Stage 2: Build Verification
        stage('Build') {
            steps {
                echo 'Validating Docker Compose configuration and preparing build...'
                sh 'docker compose version'
            }
        }

        // Stage 3: Test Configuration & Syntax
        stage('Test') {
            steps {
                echo 'Testing docker-compose.yml configuration syntax...'
                sh 'docker compose config'
            }
        }

        // Stage 4: Docker Build Images
        stage('Docker Build') {
            steps {
                echo 'Building Docker container images for all microservices...'
                sh 'docker compose build'
            }
        }

        // Stage 5: Deploy Services with Docker Compose
        stage('Docker Compose Deploy') {
            steps {
                echo 'Deploying application containers in detached mode...'
                sh 'docker compose up -d'
                echo 'Checking container health and status...'
                sh 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo '=================================================='
            echo ' Pipeline Succeeded! All services deployed:      '
            echo ' Frontend:        http://<SERVER_IP>:3000         '
            echo ' Product Service: http://<SERVER_IP>:5001         '
            echo ' User Service:    http://<SERVER_IP>:5002         '
            echo ' Order Service:   http://<SERVER_IP>:5003         '
            echo ' Payment Service: http://<SERVER_IP>:5004         '
            echo '=================================================='
        }
        failure {
            echo 'Pipeline failed! Printing docker compose logs for debugging:'
            sh 'docker compose logs --tail=50'
        }
    }
}
