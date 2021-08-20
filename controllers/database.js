'use strict';

const AWS = require('aws-sdk'),
    USERS_TABLE = process.env.USERS_TABLE;
    DUES_TABLE = process.emv.DUES_TABLE;
    ACTIVITY_TABLE= process.env.ACTIVITY_TABLE;

let params;

class DynamoDBClass {
    dynamoDB;

    constructor() {
        this.dynamoDB = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
         
    };

    async putUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                params = {};
                params.TableName = USERS_TABLE;
                params.Item = data
                console.log('putUser -> params:  ', params);
                const resul = await this.dynamoDB.put(params).promise();
                console.log('putUser -> resul:  ', resul);
                resolve(resul);
            } catch (error) {
                reject(error);
            }
        });
    }
    async queryUser(value) {
        return new Promise(async (resolve, reject) => {
            try {
                params = {};
                params.TableName = USERS_TABLE;
                params.Key = { userId: value};

                console.log('putUser -> params:  ', params);
                const resul = await this.dynamoDB.get(params).promise();
                console.log('putUser -> resul:  ', resul);
                resolve(resul);
            } catch (error) {
                reject(error);
            }
        });
    }

    async scanUser() {
        return new Promise(async (resolve, reject) => {
            try {
                params = {};
                params.TableName = USERS_TABLE;
                params.ProjectionExpression = 'userId';

                console.log('putUser -> params:  ', params);
                const resul = await this.dynamoDB.scan(params).promise();
                console.log('putUser -> resul:  ', resul);
                resolve(resul);
            } catch (error) {
                reject(error);
            }
        });
    }

    async getDUES() {
        return new Promise(async (resolved, reject) => {
            try {
                const params = {};
                params.TableName = DUES_TABLE;
                console.log('getDUES -> params:  ', params);
                this.dynamoDB.scan(params, (error, result) => {
                    if (error) {
                        console.log('getDUES -> error:  ', error);
                        reject(error);
                    } else {
                        const { Items } = result;
                        console.log('Items', Items);
                        resolved(Items);
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }


    async deleteDUES(item) {

        return  new Promise(async(resolved, reject) => {
            try {
               
                const cuota= DUES_TABLE
            
                const loanId= item
              
                const params = {
                    TableName:cuota,
                    Key:{
                        "eventId":loanId
                    },
                }

                THIS.dynamoDB.delete(params, (error, result) => {
                    if (error) {
                        console.log('deleteEvento -> error:  ', error);
                        reject(error);
                    } else {
                        console.log('deleteEvento -> result:  ', result);
                        resolved(result);
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }


    async getActivity() {
        return new Promise(async (resolved, reject) => {
            try {
                const params = {};
                params.TableName = ACTIVITY_TABLE;
                console.log('getActivity -> params:  ', params);
                this.dynamoDB.scan(params, (error, result) => {
                    if (error) {
                        console.log('getActivity -> error:  ', error);
                        reject(error);
                    } else {
                        const { Items } = result;
                        console.log('Items', Items);
                        resolved(Items);
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    async putActivity(item) {
        return new Promise(async (resolved, reject) => {
            try {
                const params = {};
                params.TableName = ACTIVITY_TABLE;
                params.Item = item
                console.log('putActivity -> params:  ', params);
                this.dynamoDB.put(params, (error, result) => {
                    if (error) {
                        console.log('putActivity -> error:  ', error);
                        reject(error);
                    } else {
                        console.log('putActivity-> result:  ', result);
                        resolved(result);
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    async deleteActivity(item) {

        return  new Promise(async(resolved, reject) => {
            try {
               
                const ACTIVIDAD = ACTIVITY_TABLE
            
                const activityId= item
              
                const params = {
                    TableName:ACTIVIDAD,
                    Key:{
                        "eventId":activityId
                    },
                }

                this.DynamoDB.delete(params, (error, result) => {
                    if (error) {
                        console.log('deleteActivity -> error:  ', error);
                        reject(error);
                    } else {
                        console.log('deleteActivity -> result:  ', result);
                        resolved(result);
                    }
                })
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = DynamoDBClass;