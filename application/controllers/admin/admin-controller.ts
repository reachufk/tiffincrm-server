// const express = require('express');
// const router = express.Router();
const adminService = require('../../services/admin/admin-service');

router.post('/RegisterAdmin',adminService.RegisterAdmin)
router.post('/Login',adminService.Login);

module.exports = router;