 const  apidoc = {
      "swagger": "2.0",
      "info": {
        "version": "1.0.0",
        "title": "Tiffin Aaw API"
      },
      "paths": {
            "/User/RegisterUser": require('./controllers/user-paths.json').paths['/User/RegisterUser'],
            "/User/Login": require('./controllers/user-paths.json').paths['/User/Login'],
            "/Admin/Login":require('./controllers/admin-paths.json').paths['/Admin/Login'],
           "/Inventory/SaveCatagory":require('./controllers/admin-paths.json').paths['/Admin/Login']
      }
}

module.exports =  apidoc
