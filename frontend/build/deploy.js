const ora = require('ora')
const s3EasyDeploy = require('s3-easy-deploy');
const config = require('../config/config.deploy.json')

console.log('deploying to s3...')
//spinner.start()

// with callback
s3EasyDeploy.deploy({
  publicRoot: './dist',
  region: config.aws_region,
  bucket: config.aws_s3_bucket
}, function(error, result) {
  //spinner.stop()
  console.log(`website_endpoints:\n http://${config.aws_s3_bucket}.s3-website.${config.aws_region}.amazonaws.com\n https://${config.aws_s3_bucket}.s3.${config.aws_region}.amazonaws.com/index.html`)
});