const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const controllers = require('../controllers/stuff');
const schemas = require('../controllers/stuff/schemas');

const router = express.Router();

router.post('/stuff', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.postStuffSchema), controllers.postStuff);
router.get('/stuff', isLoggedIn, controllers.getStuff);
router.get('/stuff/:id', isLoggedIn, controllers.showStuff);
router.post('/stuff/login', genValidator(schemas.loginStuffSchema), controllers.loginStuff);
router.patch('/stuff/:id', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.patchStuffSchema), controllers.patchStuff);
router.delete('/stuff/:id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.deleteStuff);

module.exports = router;
