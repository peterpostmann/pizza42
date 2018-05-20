'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const AWS = require("aws-sdk");
const uuid = require('uuid/v4');
const isUUID = require('is-uuid');
const AUTH_CONFIG = require('./../config/auth0-variables.json')

var conf;

app.set('conf', function(config) {
  conf = config;

  AWS.config.update({
    region: conf.aws_region,
    endpoint: conf.aws_ddb_endpoint
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${AUTH_CONFIG.domain}/.well-known/jwks.json`
    }),
    // This is the identifier we set when we created the API
    audience: AUTH_CONFIG.audience,
    issuer: `https://${AUTH_CONFIG.domain}/`,
    algorithms: ['RS256']
});

function error_msg(code, msg) {
  return {
    'error': {
      'code': code,
      'message': msg
     }
  };
}

app.get('/', (req, res) => {
  res.json({
      _links : {
        self: { href: '/' },
        pizza: { href: '/pizza' },
        orders: { href: '/orders' },
      }
  });
});

const pizza = require('./pizza.json');

app.get('/pizza', (req, res) => {
  res.json({ "data": pizza });
});

app.get('/orders', authCheck, (req, res) => {

  if(!req.user[`${AUTH_CONFIG.namespace}/email_verified`]) {
    res.status(401).json(error_msg(401, 'Please verify your e-mail address before placing an order'));
    return
  }

  var userId = req.user[`${AUTH_CONFIG.namespace}/email`]

  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: conf.aws_ddb_table_orders,
    IndexName: 'Date',
    ScanIndexForward: false,
    KeyConditionExpression: 'user_id = :u',
    ExpressionAttributeValues: {
        ':u': userId
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.error('Unable to query orders. Error JSON:', JSON.stringify(err, null, 2));
      res.status(500).json(error_msg(500, 'Unable to query orders. Try again later'));
    } else {
      res.json({"data": data});
    }
  });
});

app.post('/orders', authCheck, (req, res) => {

  if(!req.user[`${AUTH_CONFIG.namespace}/email_verified`]) {
    res.status(401).json(error_msg(401, 'Please verify your e-mail address before placing an order'));
    return
  }

  var userId = req.user[`${AUTH_CONFIG.namespace}/email`]

  if(! ("order" in req.body)) {
    res.status(400).json(error_msg(400, 'missing key \'order\' in request body'));
    return;
  }

  var order = req.body.order;

  if(! (order.constructor === Object) || Object.keys(order).length <= 0) {
    res.status(400).json(error_msg(400, 'expected \'order\' to be an object with at least one key'));
    return;
  }

  var total = 0;

  for(var index in order) { 

      var id = parseInt(index);
      var data

      if (isNaN(id) || id < 0) {
        res.status(400).json(error_msg(400, 'id must be a positive integer number'))
        return
      }
      else if( id in pizza ) {
        data = { "data": pizza[id] };
      }
      else {
        res.status(404).json(error_msg(404, 'pizza not found'))
        return
      }

    var element = order[index];

    if(! ("quantity" in element)) {
      res.status(400).json(error_msg(400, 'missing key \'quantity\' for item'));
      return;
    }

    var quantity = parseInt(element.quantity);

    if (isNaN(quantity) || quantity < 0) {
      res.status(400).json(error_msg(400, 'quantity must be a positive integer number'));
      return;
    }

    total += data.data.price * quantity;
  }

  var docClient = new AWS.DynamoDB.DocumentClient();
  var date = new Date();

  var params = {
    TableName: conf.aws_ddb_table_orders,
    Item: {
      order_id: uuid(),
      user_id: userId,
      order: order,
      total: total,
      date: date.toISOString()
      }
    };

  docClient.put(params, function(err, data) {
    if (err) {
        console.error('Unable to add order. Error JSON:', JSON.stringify(err, null, 2));
        res.status(500).json(error_msg(500, 'Unable to create order. Try again later'));
    } else {
      res.json(params.Item);
    }
  });
});

app.use(function(err, req, res, next) {

  if(err.name === 'UnauthorizedError') {
    res.status(err.status).json(error_msg(err.status, err.message));
    return;
  }

  next();
});

module.exports = app;

