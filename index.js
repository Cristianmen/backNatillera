'use strict';

const databaseCtrl = require('./controllers/database');
const UserClass = require('./controllers/createUser');

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

  let response = null;
  console.log('create: create -> ', event);
  data = JSON.parse(event.body);
  try {
    const user = new UserClass(data); 
    console.log('user: ', user);   

    response = await user.createUser(event);

    console.log('response ', response);
    return response;


  } catch (error) {
    console.log('catch/error: ', error);
    return responseHtt(404, 'Error EN INDEX', error);
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