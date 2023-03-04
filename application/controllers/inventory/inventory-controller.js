const express = require('express');
const router = express.Router();
const inventoryService = require('../../services/inventory/inventory-service')
const {verifyAdmin} = require('../../middlewares/authMiddleware');
//cataories apis
router.post('/SaveCatagory',verifyAdmin,inventoryService.SaveCatagory);
router.get('/GetCatagories',inventoryService.GetCatagories);
router.put('/UpdateCatagory/:catagoryId',verifyAdmin,inventoryService.UpdateCatagory);
router.delete('/DeleteCatagory/:catagoryId',verifyAdmin,inventoryService.DeleteCatagory);

//catagory items apis
router.post('/SaveCatagoryItem',verifyAdmin,inventoryService.SaveCatagoryItem);
router.put('/UpdateCatagoryItem/:item',verifyAdmin,inventoryService.UpdateCatagoryItem);
router.delete('/DeleteCatagoryItem/:item',verifyAdmin,inventoryService.DeleteCatagoryItem);
router.post('/GetCatagoryItems',inventoryService.GetCatagoryItems);
router.post('/GetAllItems',inventoryService.GetAllItems);

module.exports = router;