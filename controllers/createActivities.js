'use strict';

const databaseCtrl = require('./database');

const ResponseClass = require('../commons/response');

class activityClass {
    activity = {
        activityId:'',
        activity:'',
        fecha:'',
        precio:0
        
    }


    constructor(data) {
        console.log('constructor: data', data);
        this.activity.activityId = data.activityId.toLowerCase();
        this.activity.activity = data.activity;
        this.activity.fecha= data.fecha;
        this.activity.precio = data.precio
         
    };

    getActivity() {
        return this.activity;
    }

    async  createActivity() {
        try {
            console.log('createActivity');
            const ActivityDB  = new databaseCtrl();
            console.log('activity ', this.activity);
            const resulInsert = await ActivityDB.putActivity(this.activity);

            console.log('createActivity ', resulInsert);
            return  true;
        }
        catch(error){

            console.log('catch/error createactivity: ', error);
            return false

        }


    }

    getActivity() {
        return this.activity;
    }




}


module.exports = activityClass;