'use strict';

class ResponseClass {
    constructor() {
         
    };

    NOT_FOUND_RESOURCE = {
        statusCode: 404,
        message: "NotFound",
        detail: "Búsqueda sin resultado"
    };

    INTERNAL_ERROR = {
        statusCode: 500,
        message: "InternalError",
        detail: "Internal server error"
    };

    SUCCESS = {
        statusCode: 200,
        message: "Success",
        detail: "Success"
    };

    SAVE_SUCCESS = {
        statusCode: 201,
        message: "Success",
        detail: "Item was saved successful"
    };




}


module.exports = ResponseClass;