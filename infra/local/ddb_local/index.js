const conf = require('./../conf')
const DynamoDbLocal = require('dynamodb-local');
const jre = require('node-jre');

DynamoDbLocal.configureInstaller({
  installPath: './dynamodblocal-bin'
});

var jre_path = jre.driver()
jre_path = jre_path.substring(0, jre_path.lastIndexOf("/"))
process.env.PATH = process.env.PATH + ":" + jre_path

DynamoDbLocal.launch(conf.ddb_port, '.', ['-sharedDb'], true, false).then(function (child) {
  child.stdout.on('data', function(data) {
      console.log(data.toString()); 
  });
});
