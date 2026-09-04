pipeline {

    agent {
        label 'ec2'
    }

    stages {

        stage('Git Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'
            }
        }

        stage('Check Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Start Application') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Check Container') {
            steps {
                sh 'docker compose ps'
            }
        }
    }

    post {

        success {
            echo 'Application deployed successfully!'
        }

        failure {
            echo 'Deployment failed!'
        }
    }
}