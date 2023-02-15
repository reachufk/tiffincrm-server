const UserApis = {
    "/User/RegisterUser": {
      "post": {
        "summary": "Create a new user",
        "operationId": "createUser",
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "user",
            "description": "The user to be created",
            "required": true,
            "schema":require('../definitions/user-definition.json').User
          }
        ],
        "responses": {
          "201": {
            "description": "User created successfully"
          }
        }
      }
    },
    "/User/Login": {
      "post": {
        "summary": "User login",
        "operationId": "loginuser",
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "user",
            "description": "user login",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "phoneNumber": {
                  "type": "number",
                  "format": "number"
                },
                "password": {
                  "type": "string"
                }
              }
            }
          }
        ],
        "responses": {
          "200": {
            "description": "login successfully"
          }
        }
      }
    },
    "/User/UpdateUser": {
      "put": {
        "summary": "User update",
        "operationId": "update user",
        "tags": [
          "User"
        ],
        "parameters": [
          {
            "in": "query",
            "name": "user",
            "schema": {
              "type": "string",
              "required": true
            },
            "description": "The user ID to update"
          },
          {
            "in": "body",
            "name": "user",
            "description": "user login",
            "required": true,
            "schema":require('../definitions/user-definition.json').User
          }
        ],
        "responses": {
          "200": {
            "description": "login successfully"
          }
        }
      }
    }
}

module.exports = UserApis