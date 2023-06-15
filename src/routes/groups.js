const express = require('express');
const genValidator = require('../shared/validator');
const controllers = require('../controllers/groups');
const { isLoggedIn, hasRole } = require('../shared/auth');
const schemas = require('../controllers/groups/schemas');

const router = express.Router();

router.post(
  '/groups',
  isLoggedIn,
  hasRole(['admin', 'super_admin']),
  genValidator(schemas.postGroupSchema),
  controllers.postGroup
);
router.get('/groups', isLoggedIn, controllers.getGroups);
router.get('/groups/:id', isLoggedIn, controllers.showGroup);
router.patch('/groups/:id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.patchGroup);
router.delete(
  '/groups/:id',
  isLoggedIn,
  hasRole(['super_admin', 'admin']),
  controllers.deleteGroup
);

module.exports = router;
