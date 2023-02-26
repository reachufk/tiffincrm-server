const express = require('express');
const router = express.Router();
const inventoryService = require('../../services/inventory/inventory-service')

//cataories apis
router.post('/SaveCatagory',inventoryService.SaveCatagory);
router.get('/GetCatagories',inventoryService.GetCatagories);
router.put('/UpdateCatagory/:catagoryId',inventoryService.UpdateCatagory);
router.delete('/DeleteCatagory/:catagoryId',inventoryService.DeleteCatagory);

//catagory items apis
router.post('/SaveCatagoryItem',inventoryService.SaveCatagoryItem);
router.put('/UpdateCatagoryItem/:item',inventoryService.UpdateCatagoryItem);
router.delete('/DeleteCatagoryItem/:item',inventoryService.DeleteCatagoryItem);
router.post('/GetCatagoryItems',inventoryService.GetCatagoryItems);
router.post('/GetAllItems',inventoryService.GetAllItems);

module.exports = router;