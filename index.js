'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
const DynamoDBClass = require('./controllers/database');
const UserClass = require('./controllers/createUser');
const ActivityClass = require('./controllers/activityClass');
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

app.post('/addCuota', cors(), async (req, res) => {
  try {
    console.log('/addCuota ');
    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);
    const { username, value, interesSaving } = body;
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery.Item) {
      const date = new Date();
      const payload = {
        savingNumber: (resulquery.Item.saving.length + 1), //numero de aporte dado
        date: date.toISOString(), //fecha de aporte dado
        month: (date.getMonth() + 1), //mes de aporte
        value: value, //valor de aporte
        interesSaving: interesSaving //multa por atrazos en las aportes
      };

      console.log('payload ', payload);
      console.log('resulquery.Item ', resulquery.Item);
      const usersClass = new UserClass(resulquery.Item);
      usersClass.setUser(resulquery.Item);
      usersClass.user.saving.push(payload);

      const resulqueryInsert = await usersClass.createUser();

      console.log('success 200');

      res.json({
        statusCode: 200,
        message: "se inserto la cuota " + payload.savingNumber,
        detail: "Success",
        body: resulqueryInsert
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

app.put('/updateCuota', cors(), async (req, res) => {
  try {
    console.log('/updateCuota ');
    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);
    const { username, value, interesSaving, index } = body;
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery.Item) {
      const date = new Date();
      const payload = {
        savingNumber: (index + 1), //numero de aporte dado
        date: date.toISOString(), //fecha de aporte dado
        month: (date.getMonth() + 1), //mes de aporte
        value: value, //valor de aporte
        interesSaving: interesSaving //multa por atrazos en las aportes
      };

      console.log('payload ', payload);
      console.log('resulquery.Item ', resulquery.Item);
      const usersClass = new UserClass(resulquery.Item);
      usersClass.setUser(resulquery.Item);


      usersClass.user.saving[index] = payload;

      const resulqueryInsert = await usersClass.createUser();

      console.log('success 200');

      res.json({
        statusCode: 200,
        message: "se actializo el item " + index,
        detail: "Success",
        body: resulqueryInsert
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


app.post('/getCuota', cors(), async (req, res) => {
  try {
    console.log('/getCuota ');
    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);
    const { username } = body;
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery.Item) {
      console.log('success 200');
      const data = resulquery.Item.saving;

      console.log('success 200');

      res.json({
        statusCode: 200,
        message: "consulta de cuotas",
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


app.post('/addLoan', cors(), async (req, res) => {
  try {
    console.log('/addLoan ');
    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);
    const { username, totalLoan } = body;
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery.Item) {
      const date = new Date();
      const payload = {
        loansNumber: (resulquery.Item.loans.length + 1), //numero de prestamo
        status: true, //estado del prestamo
        totalLoan: totalLoan, //saldo total del prestamo
        balance: totalLoan, //saldo prestamo actual (totalLoan - abonos a capital)
        disbursementDate: date.toISOString(), //fecha de entrega de prestamo
        paymentsCapital: [ //lista de abonos a capital
        ],
        interestPayment: [ //lista de pagos de interes
        ]
      }

      console.log('payload ', payload);
      console.log('resulquery.Item ', resulquery.Item);
      const usersClass = new UserClass(resulquery.Item);
      usersClass.setUser(resulquery.Item);
      usersClass.user.loans.push(payload);

      const resulqueryInsert = await usersClass.createUser();

      console.log('success 200');

      res.json({
        statusCode: 200,
        message: `se inserto el prestamo ${payload.loansNumber} por valor de ${totalLoan}`,
        detail: "Success",
        body: resulqueryInsert
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

app.put('/updateLoan', cors(), async (req, res) => {
  try {
    console.log('/updateLoan');
    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);
    const { username, totalLoan, disbursementDate, paymentsCapital, interestPayment, index } = body;
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ',JSON.stringify(resulquery) );
    const resp = new ResponseClass();

    if (resulquery.Item) {

      const date = new Date();
      const payload = {
        loansNumber: (index + 1), //numero de prestamo
        status: true, //estado del prestamo
        totalLoan: totalLoan, //saldo total del prestamo
        balance: 0, //saldo prestamo actual (totalLoan - abonos a capital)
        disbursementDate: disbursementDate, //fecha de entrega de prestamo
        paymentsCapital: resulquery.Item.loans[index].paymentsCapital, //fecha de entrega de
        interestPayment: resulquery.Item.loans[index].interestPayment
      }

      console.log('payload ', JSON.stringify(payload));

      if (paymentsCapital > 0) {
        payload.paymentsCapital.push(
          {
            month: (date.getMonth() + 1),
            date: date.toISOString(),
            value: paymentsCapital,
          }
        );
      }
      if (interestPayment > 0) {
        payload.interestPayment.push(
          {
            month: (date.getMonth() + 1),
            date: date.toISOString(),
            value: interestPayment,
          }
        );
      }

      let summary = 0;

      console.log('resulquery.Item.loans[index].paymentsCapital',resulquery.Item.loans[index].paymentsCapital);
      if (resulquery.Item.loans[index].paymentsCapital && resulquery.Item.loans[index].paymentsCapital.length > 0) {
        resulquery.Item.loans[index].paymentsCapital.forEach(element => {
          console.log('antes',summary);
          summary += element.value;
          console.log('despues',summary);
        });
      }
      console.log('summary',summary);

      if (totalLoan === (summary + paymentsCapital) ) {
        payload.status = false;        
      } else {
        if (totalLoan > (summary + paymentsCapital)) {
          payload.balance = totalLoan - summary ;
        } else {
          console.log('error no puede pagar mas del la deuda');
          res.status(404).json(resp.NOT_FOUND_RESOURCE);
          
        }
      }

      
      
      const usersClass = new UserClass(resulquery.Item);
      usersClass.setUser(resulquery.Item);


      usersClass.user.loans[index] = payload;

      console.log('usersClass.user ', usersClass.user);

      const resulqueryInsert = await usersClass.createUser();

      console.log('success 200');

      res.json({
        statusCode: 200,
        message: "se actializo el item " + (index + 1),
        detail: "Success",
        body: resulqueryInsert
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


app.post('/getLoan', cors(), async (req, res) => {
  try {
    console.log('/getLoan ');
    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);
    const { username } = body;
    const userDB = new DynamoDBClass();
    const resulquery = await userDB.queryUser(username);
    console.log('resulquery ', resulquery);
    const resp = new ResponseClass();

    if (resulquery.Item) {
      console.log('success 200');
      const data = resulquery.Item.loans;

      console.log('success 200');

      res.json({
        statusCode: 200,
        message: "consulta de cuotas",
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

app.post('/createActivity', cors(), async (req, res) => {
  try {

    const body = JSON.parse(req.apiGateway.event.body);
    console.log('body ', body);


    const activityClass = new ActivityClass(body);
    console.log('body ', body);
    const resulquery = await activityClass.createActivity();
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

app.get('/activitys', cors(), async (req, res) => {
  try {
    console.log('/activitys ');
    const resp = new ResponseClass();
    const activtyDB = new DynamoDBClass();
    const resulquery = await activtyDB.scanActivity();

    console.log('resulquery ', resulquery);



    if (resulquery) {
      console.log('success 200');

      res.json({
        statusCode: 200,
        message: "Success query activity",
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