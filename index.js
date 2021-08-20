'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
const DynamoDBClass = require('./controllers/database');
const UserClass = require('./controllers/createUser');
const ResponseClass = require('./commons/response');
const shareClass = require('./controllers/createCuotaAssociated')

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

app.get('/dues', cors(), async (req, res) => {
  const duesDB = new DynamoDBClass();
  const Dues = await duesDB.getDUES();
  console.log('getUser -> uu:  ', Dues);
  //validar usaurio
  if (Dues) {
    res.json({
      success: 'true',
      Dues: Dues
    });
  } else {
    res.status(400).json({
      error: 'error'
    });
  }
});

app.post('/saving', cors(), async (req, res) => {
  try {
    const body = JSON.parse(req.apiGateway.event.body);
    const { username } = body;

    console.log('/username ', username);
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    const duesDB = new shareClass();

    

    if (resulquery.Item) {

        if (resulquery.Item.status) {

         

          console.log('success 200');
          const data = {
            savingId: resulquery.Item.saving.length,     
            disbursementDate: resulquery.Item.disbursementDate,
            amount: resulquery.Item.amount,

          }


          console.log(data);
          const resul = await duesDB.createShare(savingId);
          res.json({
            statusCode: 200,
            message: "Success",
            detail: "Success",
            body: data
          });

        } else {
          console.log('error en validacion de usuario  ');      
        }
    } else {
      console.log('error en consulta de usuario');

    }

  } catch (error) {
    console.log('catch/error: ', error);
    res.status(500).json({
      error: error
    });
  }
});

app.delete('/dues', cors(), async (req, res) => {
  const duesDB = new DynamoDBClass();
  console.log('req: ', req);
  console.log("....")

  const { loanId } = req.body;
  const data = {
    loanId: loanId
  }
  console.log('data: ', data.loanId);

  const response = await duesDB.deleteEvent(data.loanId);

  if (response) {
    res.json({
      success: 'true',
      Dues: response
    });
  } else {
    res.status(400).json({
      error: 'error'
    })
  }
});

app.get('/activity', cors(), async (req, res) => {
  const activityDB = new DynamoDBClass();
  const activity = await activityDB.getActivity();
  console.log('getactivity-> uu:  ', activity);
  
  if (activity) {
    res.json({
      success: 'true',
      Dues: Dues
    });
  } else {
    res.status(400).json({
      error: 'error'
    });
  }
});

app.post('/activity', cors(), async (req, res) => {
  try {
    const body = JSON.parse(req.apiGateway.event.body);
  
    const activityDB = new DynamoDBClass();
    const resulquery = await activityDB.putActivity(activityId);

    if (resulquery.Item) {
      if (resulquery.Item.activityId === body.activityId && resulquery.Item.activity === body.activity) {

        if (resulquery.Item.status) {
          console.log('success 200');
          const data = {
            activityId : resulquery.Item.activityId ,
            activity: resulquery.Item.activity,
            fecha: resulquery.Item.fecha,
            precio: resulquery.Item.precio

          }
          res.json({
            statusCode: 200,
            message: "Success",
            detail: "Success",
            body: data
          });

        } else {
          console.log('error en validacion de activity ');


        }

      } else {
        console.log('error en validacion de activity ');

      }
    } else {
      console.log('error en consulta de activity');

    }

  } catch (error) {
    console.log('catch/error: ', error);
    res.status(500).json({
      error: error
    });
  }
});

app.delete('/activity', cors(), async (req, res) => {
  const activityDB = new DynamoDBClass();
  console.log('req: ', req);
  console.log("....")

  const { activityId } = req.body;
  const data = {
    activityId: activityId
  }
  console.log('data: ', data.activityId);

  const response = await activityDB.deleteActivity(data.activityId);

  if (response) {
    res.json({
      success: 'true',
      Dues: response
    });
  } else {
    res.status(400).json({
      error: 'error'
    })
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





module.exports.generic = serverless(app);