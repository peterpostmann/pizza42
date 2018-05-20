var conf = require('./config.json')

module.exports = {
  NODE_ENV: '"production"',
  ROOT_API: '"' + conf.api_url + '"'
}
