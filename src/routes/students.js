const express = require('express');
const genValidator = require("../shared/validator")
const controllers = require('../controllers/students');
const { isLoggedIn, hasRole } = require('../shared/auth');
const schemas = require('../controllers/students/schemas');

const router = express.Router()


router.get('/students', isLoggedIn, controllers.getStudents)
router.get('/students/:id', isLoggedIn, controllers.showStudents)
router.post('/students', isLoggedIn, genValidator(schemas.postStudentSchema), controllers.postStudent)
router.patch('/students/:id', isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(schemas.patchStudent), controllers.patchStudent )
router.delete('/students/:id', isLoggedIn, hasRole(['super_admin', 'admin']), controllers.deleteStudent)

module.exports = router;