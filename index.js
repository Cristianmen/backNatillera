'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
const DynamoDBClass = require('./controllers/database');
const UserClass = require('./controllers/createUser');
const ResponseClass = require('./commons/response');

let usersDB = null,
  data;

app.post('/login', cors(), async (req, res) => {
  try {

    const body = JSON.parse(req.apiGateway.event.body);
    const { username, password } = body;
    
    console.log('/username ', username);
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery.Item) {
      if (resulquery.Item.userId === username && resulquery.Item.password === password) {
        console.log('success 200');
        res.json(resp.success);
      } else {
        console.log('error en validacion de usuario  ');
        res.status(404).json(resp.NOT_FOUND_RESOURCE);
      }
    } else {
      console.log('error en consulta de usuario');
      res.status(404).json(resp.NOT_FOUND_RESOURCE);
    }

  } catch (error) {
    console.log('catch/error: ', error);
    res.status(500).json({
      error: error
    });
  }
   
});






module.exports.generic = serverless(app);