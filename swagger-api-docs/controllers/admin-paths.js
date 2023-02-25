const AdminPath = {
    "/Admin/Login": {
      "post": {
        "summary": "Admin login",
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "admin",
            "description": "login admin",
            "required": true,
            "schema": {
              "type": "object",
              "properties": {
                "email": {
                  "type": "string",
                  "format": "email",
                  "required": true
                },
                "password": {
                  "type": "string",
                  "required": true
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
    "/Admin/RegisterAdmin": {
      "post": {
        "summary": "Create a new admin",
        "tags": [
          "Admin"
        ],
        "parameters": [
          {
            "in": "body",
            "name": "user",
            "description": "The admin to be created",
            "required": true,
            "schema":require('../definitions/admin-definition.json').Admin
          }
        ],
        "responses": {
          "201": {
            "description": "admin created successfully"
          }
        }
      }
    }
}

module.exports = AdminPath