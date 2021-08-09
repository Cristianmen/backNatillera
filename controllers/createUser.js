'use strict';

const databaseCtrl = require('./database');

const ResponseClass = require('../commons/response');

class UserClass {
    user = {
        userId: '',
        name:'',
        lastName:'',
        password: '',
        activity:[],
        saving:[],
        loans:[]
    }


    constructor(data) {
        console.log('constructor: data', data);
        this.user.userId = data.user;
        this.user.name = data.name;
        this.user.lastName = data.lastName;
        this.user.password = data.password; 
         
    };

    getUser() {
        return this.user;
    }

    async  createUser(event) {
        try {
            console.log('createUser ');
            const usersDB = new databaseCtrl();
            console.log('user ', this.user);
            const resulInsert = await usersDB.putUser(this.user);

            console.log('resulInsert ', resulInsert);
            return  ResponseClass.SAVE_SUCCESS;
        }
        catch(error){

            console.log('catch/error createUser: ', error);
            return {
                statusCode: 500,
                body:{
                     message: "InternalError",
                    detail: "Internal server error"
                }
            };

        }


    }

    getUser() {
        return this.user;
    }


    getUserName() {
        return this.user.name;
    }


}


module.exports = UserClass;