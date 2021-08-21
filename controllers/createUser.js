'use strict';

const databaseCtrl = require('./database');

const ResponseClass = require('../commons/response');

class UserClass {
    user = {
        userId:'',
        name:'',
        lastName:'',
        email:'',
        admin: false,
        id: '',
        status: true,
        password: '',
        activity:[],
        saving:[],
        loans:[]
    }


    constructor(data) {
        console.log('constructor: data', data);
        this.user.userId = data.userId.toLowerCase();
        this.user.email = data.email;
        this.user.id = data.id;
        this.user.password = data.password;
        this.user.admin = data.admin;
        this.user.name = data.name;
        this.user.lastName = data.lastName;
         
    };

    getUser() {
        return this.user;
    }
    setUser(User) {
        this.user = User;
    }

    async  createUser() {
        try {
            console.log('createUser ');
            const usersDB = new databaseCtrl();
            console.log('user ', this.user);
            const resulInsert = await usersDB.putUser(this.user);

            console.log('resulInsert ', resulInsert);
            return  true;
        }
        catch(error){

            console.log('catch/error createUser: ', error);
            return false

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