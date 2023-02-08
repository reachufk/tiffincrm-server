const express = require('express');
const router = express.Router();
const inventoryService = require('../../services/inventory/inventory-service');

router.post('/SaveCatagory',inventoryService.SaveCatagory);
router.get('/GetCatagory/:id',inventoryService.GetCatagory);
router.get('/GetCatagories',inventoryService.GetCatagories);
router.put('/UpdateCatagory/:id',inventoryService.UpdateCatagory);
router.delete('/DeleteCatagory/:id',inventoryService.DeleteCatagory);

module.exports = router;