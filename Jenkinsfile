pipeline {
    agent {
        label 'aws'
    }

    environment {
        
        REPO_URL = 'https://github.com/VIGNESHWARAN-DEV54/Microservice-application-deploy-ec2.git'
    }

    stages {
        
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/VIGNESHWARAN-DEV54/Microservice-application-deploy-ec2.git'
            }
        }

        
        stage('Build') {
            steps {
                sh 'docker compose version'
            }
        }
        stage('Docker Compose Down') {
            steps {
        sh 'docker compose down'
            }
        }
        stage('Test') {
            steps {
                sh 'docker compose config'
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }
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
            echo 'deploy app'
        }
        failure {
            echo 'Pipeline failed'
            
        }
    }
}
