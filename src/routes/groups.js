const express = require('express');
const genValidator = require('../shared/validator');
const { isLoggedIn, hasRole } = require('../shared/auth');
const { postGroupSchema, patchGroupSchema } = require('../controllers/groups/schemas');
const {
  postGroup,
  getGroups,
  showGroup,
  patchGroup,
  deleteGroup,
  addStudent,
  removeStudent,
} = require('../controllers/groups');

const router = express.Router();

const mPostGroup = [isLoggedIn, hasRole(['admin', 'super_admin']), genValidator(postGroupSchema)];
const mGetGroups = [isLoggedIn];
const mShowGroups = [isLoggedIn];
const mPatchGroup = [isLoggedIn, hasRole(['super_admin', 'admin']), genValidator(patchGroupSchema)];
const mDeleteGroup = [isLoggedIn, hasRole(['super_admin', 'admin'])];
const mAddStudent = [isLoggedIn, hasRole(['super_admin', 'admin'])];
const mRemoveStudent = [isLoggedIn, hasRole(['super_admin', 'admin'])];

router.post('/groups', mPostGroup, postGroup);
router.get('/groups', mGetGroups, getGroups);
router.get('/groups/:id', mShowGroups, showGroup);
router.patch('/groups/:id', mPatchGroup, patchGroup);
router.delete('/groups/:id', mDeleteGroup, deleteGroup);
router.post('/groups/:id/students/:student_id', mAddStudent, addStudent);
router.delete('/groups/:id/students/:student_id', mRemoveStudent, removeStudent);

module.exports = router;
