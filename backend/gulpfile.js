const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const lambda = require('gulp-lambda-deploy');
const zip = require('gulp-zip');

gulp.task('default', function(){

    const local_conf = require('./config/config.local.json')
   
    nodemon({
    script: 'local/app.local.js',
    ext: 'js',
    env: {
      PORT: local_conf.api_port
    },
    ignore: ['./node_modules/**']
  })
  .on('restart', function(){
   console.log('Restarting');
  });
});

gulp.task('deploy', function(cb) {

  const deploy_conf = require('./config/config.deploy.json')

  let params = {
    name: deploy_conf.aws_lambda_main_name,
    role: deploy_conf.aws_lambda_main_role,
    handler: deploy_conf.aws_lambda_main_handler,
    runtime: deploy_conf.aws_lambda_main_runtime
  };

  let options = {
    profile: 'default',
    region: deploy_conf.aws_region
  };

  return gulp.src(['**/*', '!local/*'])
    .pipe(zip('package.zip'))
    .pipe(lambda(params, options))
    .on('end', cb);
});
