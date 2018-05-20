'use strict';

console.log(`Starting app.local.js`);
const app = require('./../app/app')

const conf = require('./../config/config.local.json')
app.get('conf')(conf);

const port = process.env.PORT || conf.api_port
app.listen(port)
console.log(`listening on http://localhost:${port}`)
