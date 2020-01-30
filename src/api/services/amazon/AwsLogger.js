const aws = require('aws-sdk');
class AwsLogger {

  constructor() {
    this.cloudwatch = new aws.CloudWatch();


  }

}
