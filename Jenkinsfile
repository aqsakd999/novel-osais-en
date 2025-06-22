pipeline {
  environment {
    ENV_MODE                 = "${'production'.equalsIgnoreCase(params.ECS_ENVIRONMENT) ? 'PRODUCTION' : 'TEST'}"
    AWS_CREDENTIALS          = "AWS-ACCESS-KEY"
    AWS_REGION               = "AWS-REGION"
    AWS_S3_FE_BUCKET         = "AWS-S3-FE-BUCKET-${ENV_MODE}"
    TODAY                    = new Date().format("yyMMdd", TimeZone.getTimeZone("Asia/Tokyo"))
    APP_ENV_FILE             = "FE-ENV-${ENV_MODE}"
    APP_VERSION              = "v${TODAY}"
  }
  tools {
    nodejs "node"
  }
  agent any

  stages {
    stage("initialize app") {
      steps {
        withCredentials([file(credentialsId: APP_ENV_FILE, variable: 'envFile')]) {
          sh "cp \$envFile .env"
        }
        sh 'sed -i "s|REACT_APP_VERSION=.*|REACT_APP_VERSION=${APP_VERSION}|" .env'
        sh 'yarn install --network-timeout 100000'
      }
    }
    stage("run tests") {
      steps {
        sh '''
          yarn test --watchAll=false
          yarn lint:build
        '''
      }
    }
    stage("build app") {
      steps {
        sh 'yarn build'
      }
    }
    stage('deploy to S3') {
      steps {
        script {
          withCredentials([
            string(credentialsId: AWS_REGION, variable: 'awsRegion'),
            string(credentialsId: AWS_S3_FE_BUCKET, variable: 'awsS3FeBucket')
            ]) {
              withAWS(region: awsRegion, credentials: AWS_CREDENTIALS) {
                s3Delete(bucket: awsS3FeBucket, path: "**/*")
                s3Upload(bucket: awsS3FeBucket, workingDir: 'build', includePathPattern: "**/*")
              }
          }
        }
      }
    }
  }
}