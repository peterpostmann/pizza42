const fs = require('fs');

conf = {}

var array = fs.readFileSync('./../local.auto.tfvars').toString().split("\n");
for(i in array) {
  if(array[i].trim()) {
    try {
        data = array[i].split('"', 2)
        key  = data[0].split('=',2)[0].trim()
        conf[key] = data[1]
    }
    catch(e) {
      console.log(e)
    }
  }
}

module.exports = conf;
