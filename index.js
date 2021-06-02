'use strict';

const databaseCtrl = require('./controllers/database');

let usersDB = null,
  data;

  

async function query(event) {
  console.log('event: query -> ', event);
  usersDB = new databaseCtrl();
  try {
    if (event.pathParameters) {
      const path = event.pathParameters.user;
      console.log('path -> ', path);
      const resulquery = await usersDB.queryUser(path);
      return responseHtt(200, 'peticions exitosa/queryUser', resulquery);
    } else {
      const resulquery = await usersDB.scanUser();
      return responseHtt(200, 'peticions exitosa/scanUser', resulquery);
    }
  } catch (error) {
    console.log('catch/error: ', error);
    return responseHtt(500, 'Error', error);
  }


};

async function create(event) {

  console.log('create: create -> ', event);
  data = JSON.parse(event.body);
  try {
    usersDB = new databaseCtrl();
    const userId = data.user,
      name = data.name;

    // const resulInsert = await usersDB.queryUser( userId);
    const resulInsert = await usersDB.putUser({ userId, name });
    // const resulInsert = await usersDB.scanUser();
    console.log('resulInsert: ', typeof resulInsert);
    console.log('resulInsert: ', resulInsert);


    // resulInsert.then(() => {
    //   console.log('then: ', then);
    // }).catch((error) => {

    //   console.log('error: ', error);
    // });

    return responseHtt(200, 'peticions exitosa', resulInsert);


  } catch (error) {
    console.log('catch/error: ', error);
    return responseHtt(500, 'Error', error);
  }
};

function responseHtt(status, message, output) {
  return {
    statusCode: status,
    body: JSON.stringify(
      {
        message: message,
        input: output,
      },
      null,
    ),
  };

}


module.exports.query = query;
module.exports.create = create;