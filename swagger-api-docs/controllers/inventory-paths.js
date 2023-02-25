
const InventoryApis =
{
      "/Inventory/SaveCatagory": {
            "post": {
                  "summary": "Save Catagory",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "body",
                              "name": "Catagory",
                              "description": "Catagory save",
                              "required": true,
                              "schema": require('../definitions/inventory-definition.json')
                        }
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory saved successfully"
                        }
                  }
            }
      },

      "/Inventory/GetCatagory": {
            "get": {
                  "summary": "Get Catagory",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "catagory",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The catagory ID to get"
                        },
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory details"
                        }
                  }
            }
      },

      "/Inventory/GetCatagories": {
            "get": {
                  "summary": "Get Catagories",
                  "tags": [
                        "Inventory"
                  ],
                  "responses": {
                        "200": {
                              "description": "Catagories"
                        }
                  }
            }
      },

      "/Inventory/UpdateCatagory": {
            "put": {
                  "summary": "Update Catagory",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "catagory",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The catagory ID to update"
                        },
                        {
                              "in": "body",
                              "name": "catagory",
                              "description": "catagory to update",
                              "required": true,
                              "schema": require('../definitions/inventory-definition.json').Catagory
                        }
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory updated"
                        }
                  }
            }
      },

      "/Inventory/DeleteCatagory": {
            "delete": {
                  "summary": "Delete Catagory",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "catagory",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The catagory ID to delete"
                        },
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory deleted"
                        }
                  }
            }
      },

      "/Inventory/SaveCatagoryItem": {
            "post": {
                  "summary": "Save Catagory Item",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "body",
                              "name": "Catagory Item",
                              "description": "Catagory Item Save",
                              "required": true,
                              "schema": require('../definitions/inventory-definition.json').CatagoryItem
                        }
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory item saved successfully"
                        }
                  }
            }
      },

      "/Inventory/GetCatagoryItem": {
            "get": {
                  "summary": "Get Catagory Item",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "catagoryItem",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The catagoryItem ID to get"
                        },
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory item details"
                        }
                  }
            }
      },

      "/Inventory/GetCatagoryItems": {
            "get": {
                  "summary": "Get Catagory Items",
                  "tags": [
                        "Inventory"
                  ],
                  parameters: [
                        {
                              "in": "body",
                              "name": "Get Catagory items ",
                              "required": true,
                              "schema": require('../definitions/inventory-definition.json').CatagoryItems
                        }
                  ],
                  "responses": {
                        "200": {
                              "description": "Catagory Items []"
                        }
                  }
            }
      },

      "/Inventory/UpdateCatagoryItem": {
            "put": {
                  "summary": "Update CatagoryItem",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "catagoryItem",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The catagoryItem ID to update"
                        },
                        {
                              "in": "body",
                              "name": "catagory Item",
                              "description": "catagoryItem to update",
                              "required": true,
                              "schema": require('../definitions/inventory-definition.json').CatagoryItem
                        }
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory item updated"
                        }
                  }
            }
      },

      "/Inventory/DeleteCatagoryItem": {
            "delete": {
                  "summary": "Delete Catagory Item",
                  "tags": [
                        "Inventory"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "catagoryItem",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The catagoryItem ID to delete"
                        },
                  ],
                  "responses": {
                        "200": {
                              "description": "catagory item deleted"
                        }
                  }
            }
      },



}

module.exports = InventoryApis