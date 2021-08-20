'use strict';

const databaseCtrl = require('./database');

const ResponseClass = require('../commons/response');

class shareClass {
    share = {
        loanId:'',
        disbursementDate: '',
        status: true,
        amount: 0 

        
    }


    constructor(data) {
        console.log('constructor: couta', data);

        this.share.loanId = data.loanId;
        this.share.disbursementDate = data.disbursementDate;
        this.share.amount = data.amount;

         
    };

    getShare() {
        return this.share;
    }

    async  createShare() {
        try {
            console.log('createUser ');
            const usersDB = new databaseCtrl();
            console.log('share ', this.share);
            const resulInsert = await usersDB.queryUser(this.share);

            console.log('resulInsert ', resulInsert);
            return  true;
        }
        catch(error){

            console.log('catch/error createUser: ', error);
            return false

        }


    }

    getShare() {
        return this.share;
    }

}


module.exports = shareClass;