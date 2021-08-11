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

        if (resulquery.Item.status) {
          console.log('success 200');
          const data = {
            userId: resulquery.Item.userId,
            name: resulquery.Item.name,
            lastName: resulquery.Item.lastName,
            admin: resulquery.Item.admin

          }
          res.json({
            statusCode: 200,
            message: "Success",
            detail: "Success",
            body: data
          });

        } else {
          console.log('error en validacion de usuario  ');
          res.status(404).json(resp.NOT_FOUND_RESOURCE);

        }

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

app.post('/user', cors(), async (req, res) => {
  try {

    const body = JSON.parse(req.apiGateway.event.body);
    const { username } = body;

    console.log('/username ', username);
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery.Item) {

      console.log('success 200');
      const data = {
        userId: resulquery.Item.userId,
        id: resulquery.Item.id,
        status: resulquery.Item.status,
        name: resulquery.Item.name,
        lastName: resulquery.Item.lastName,
        admin: resulquery.Item.admin,
        email: resulquery.Item.email

      }
      res.json({
        statusCode: 200,
        message: "Success",
        detail: "Success",
        body: data
      });


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

app.post('/createUser', cors(), async (req, res) => {
  try {

    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);


    const usersClass = new UserClass(body);
    console.log('body ', body);
    const resulquery = await usersClass.createUser();
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery) {
      console.log('success 200');
      res.json(resp.SUCCESS);
    } else {
      console.log('error en validacion de usuario  ');
      res.status(404).json(resp.NOT_FOUND_RESOURCE);

    }


  } catch (error) {
    console.log('catch/error: ', error);
    res.status(500).json({
      error: error
    });
  }

});

app.get('/users', cors(), async (req, res) => {
  try {
    console.log('/user ');
    const resp = new ResponseClass();
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.scanUser();

    console.log('resulquery ', resulquery);



    if (resulquery) {
      console.log('success 200');

      res.json({
        statusCode: 200,
        message: "Success query",
        detail: "Success",
        body: resulquery.Items
      });
    } else {
      console.log('error en validacion de usuario  ');
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