var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var conf = require('./config.local.json')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROOT_API: '"' + conf.api_url + '"'
})
