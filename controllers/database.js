'use strict';

const AWS = require('aws-sdk'),
    USERS_TABLE = process.env.USERS_TABLE;
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
}

module.exports = DynamoDBClass;