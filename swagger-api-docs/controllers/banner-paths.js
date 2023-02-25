const BannerApis =
{
      "/Banner/SaveBanner": {
            "post": {
                  "summary": "save banner",
                  "tags": [
                        "Banner"
                  ],
                  "parameters": [
                        {
                              "in": "body",
                              "name": "banner",
                              "description": "banner save",
                              "required": true,
                              "schema": require('../definitions/banner-definition.json').Banner
                        }
                  ],
                  "responses": {
                        "200": {
                              "description": "banner saved successfully"
                        }
                  }
            }
      },

      "/Banner/GetBanner": {
            "get": {
                  "summary": "get banner",
                  "tags": [
                        "Banner"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "banner",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The banner ID to get"
                        },
                  ],
                  "responses": {
                        "200": {
                              "description": "banner details"
                        }
                  }
            }
      },

      "/Banner/GetBanners": {
            "get": {
                  "summary": "get banners",
                  "tags": [
                        "Banner"
                  ],
                  "responses": {
                        "200": {
                              "description": "banners"
                        }
                  }
            }
      },

      "/Banner/UpdateBanner": {
            "put": {
                  "summary": "update banner",
                  "tags": [
                        "Banner"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "banner",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The banner ID to update"
                        },
                        {
                              "in": "body",
                              "name": "banner",
                              "description": "banner to update",
                              "required": true,
                              "schema": require('../definitions/banner-definition.json').Banner
                        }
                  ],
                  "responses": {
                        "200": {
                              "description": "banner updated"
                        }
                  }
            }
      },
      
      "/Banner/DeleteBanner": {
            "delete": {
                  "summary": "delete banner",
                  "tags": [
                        "Banner"
                  ],
                  "parameters": [
                        {
                              "in": "query",
                              "name": "banner",
                              "schema": {
                                    "type": "string",
                                    "required": true
                              },
                              "description": "The banner ID to delete"
                        },
                  ],
                  "responses": {
                        "200": {
                              "description": "banner deleted"
                        }
                  }
            }
      },

}

module.exports = BannerApis
