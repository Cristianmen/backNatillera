'use strict';

const databaseCtrl = require('./database');

const ResponseClass = require('../commons/response');

class ActivityClass {
    activity = {
        activityId: '',
        activity: '',
        fecha: '',
        costo: 0,
        total: 0,
        detail: ''

    }
    constructor(data) {
        console.log('constructor: data', data);
        this.activity.activityId = data.activityId.toLowerCase();
        this.activity.activity = data.activity;
        this.activity.fecha = data.fecha;
        this.activity.costo = data.costo;
        this.activity.total = data.total;
        this.activity.detail = data.detail;
    };

    async createActivity() {
        try {
            console.log('createActivity');
            const ActivityDB = new databaseCtrl();
            console.log('activity ', this.activity);
            const resulInsert = await ActivityDB.putActivity(this.activity);

            console.log('createActivity ', resulInsert);
            return true;
        }
        catch (error) {

            console.log('catch/error createactivity: ', error);
            return false

        }


    }

    setActivity(activity) {
        this.activity = activity;
    }

    getActivity() {
        return this.activity;
    }

}


module.exports = ActivityClass;