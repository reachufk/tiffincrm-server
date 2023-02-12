const UserPaths = require('./controllers/user-paths');
const AdminPaths = require('./controllers/admin-paths')
const BannerPaths = require('./controllers/banner-paths');
const InventoryPaths = require('./controllers/inventory-paths');

const apidoc = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Tiffin Aaw API"
  },
  "paths": {
    "/User/RegisterUser": UserPaths['/User/RegisterUser'],
    "/User/Login": UserPaths['/User/Login'],
    "/User/UpdateUser":UserPaths['/User/UpdateUser'],

    "/Admin/Login": AdminPaths['/Admin/Login'],
    "/Admin/RegisterAdmin": AdminPaths['/Admin/RegisterAdmin'],

    "/Banner/SaveBanner":BannerPaths['/Banner/SaveBanner'],
    "/Banner/GetBanner":BannerPaths['/Banner/GetBanner'],
    "/Banner/GetBanners":BannerPaths['/Banner/GetBanners'],
    "/Banner/UpdateBanner":BannerPaths['/Banner/UpdateBanner'],
    "/Banner/DeleteBanner":BannerPaths['/Banner/DeleteBanner'],

    "/Inventory/SaveCatagory":InventoryPaths['/Inventory/SaveCatagory'],
    "/Inventory/GetCatagory":InventoryPaths['/Inventory/GetCatagory'],
    "/Inventory/GetCatagories":InventoryPaths['/Inventory/GetCatagories'],
    "/Inventory/UpdateCatagory":InventoryPaths['/Inventory/UpdateCatagory'],
    "/Inventory/DeleteCatagory":InventoryPaths['/Inventory/DeleteCatagory'],
    "/Inventory/SaveCatagoryItem":InventoryPaths['/Inventory/SaveCatagoryItem'],
    "/Inventory/GetCatagoryItem":InventoryPaths['/Inventory/GetCatagoryItem'],
    "/Inventory/GetCatagoryItems":InventoryPaths['/Inventory/GetCatagoryItems'],
    "/Inventory/UpdateCatagoryItem":InventoryPaths['/Inventory/UpdateCatagoryItem'],
    "/Inventory/DeleteCatagoryItem":InventoryPaths['/Inventory/DeleteCatagoryItem'],

  }
}

module.exports = apidoc
