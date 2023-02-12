const express = require('express');
const router = express.Router();
const inventoryService = require('../../services/inventory/inventory-service')

//cataories apis
router.post('/SaveCatagory',inventoryService.SaveCatagory);
router.get('/GetCatagory/:id',inventoryService.GetCatagory);
router.get('/GetCatagories',inventoryService.GetCatagories);
router.put('/UpdateCatagory/:id',inventoryService.UpdateCatagory);
router.delete('/DeleteCatagory/:id',inventoryService.DeleteCatagory);

//catagory items apis
router.post('/SaveCatagoryItem',inventoryService.SaveCatagoryItem);
router.get('/GetCatagoryItem',inventoryService.GetCatagoryItem);
router.put('/UpdateCatagoryItem',inventoryService.UpdateCatagoryItem);
router.delete('/DeleteCatagoryItem/:id',inventoryService.DeleteCatagoryItem);
router.post('/GetCatagoryItems',inventoryService.GetCatagoryItems);

module.exports = router;