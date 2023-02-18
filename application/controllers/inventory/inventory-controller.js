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
router.put('/UpdateCatagoryItem',inventoryService.UpdateCatagoryItem);
router.delete('/DeleteCatagoryItem',inventoryService.DeleteCatagoryItem);
router.post('/GetCatagoryItems',inventoryService.GetCatagoryItems);

module.exports = router;