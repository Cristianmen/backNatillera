'use strict';

const AWS = require('aws-sdk'),
    USERS_TABLE = process.env.USERS_TABLE,
    ACTIVITY_TABLE = process.env.ACTIVITY_TABLE;
let params;

class DynamoDBClass {
    dynamoDB;

    constructor() {
        this.dynamoDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

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
                params.Key = { userId: value };

                console.log('queryUser -> params:  ', params);
                const resul = await this.dynamoDB.get(params).promise();
                console.log('queryUser -> resul:  ', resul);
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

                console.log('scanUser -> params:  ', params);
                const resul = await this.dynamoDB.scan(params).promise();
                console.log('scanUser -> resul:  ', resul);
                resolve(resul);
            } catch (error) {
                reject(error);
            }
        });
    }

    async putActivity(item) {
        return new Promise(async (resolved, reject) => {
            try {
                console.log('process.env', process.env);
                params = {};
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

    async scanActivity() {
        return new Promise(async (resolve, reject) => {
            try {
                params = {};
                params.TableName = ACTIVITY_TABLE;
                // params.ProjectionExpression = 'activityId';

                console.log('scanActivity -> params:  ', params);
                const resul = await this.dynamoDB.scan(params).promise();
                console.log('scanActivity -> resul:  ', resul);
                resolve(resul);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = DynamoDBClass;