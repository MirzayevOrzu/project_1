const express = require('express');
const genValidator = require("../shared/validator")
const controllers = require('../controllers/directions');
const { isLoggedIn, hasRole } = require('../shared/auth');
const schemas = require('../controllers/directions/schemas');

const router = express.Router()


router.get('/directions', isLoggedIn, controllers.getDirections)
router.get('/directions/:id', isLoggedIn, controllers.showDirection)
router.post('/directions', isLoggedIn, genValidator(schemas.postDirectionSchema), controllers.postDirection)
router.patch('/directions/:id', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.patchDirectionSchema), controllers.patchDirection )
router.delete('/directions/:id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.deleteDirection)

module.exports = router;