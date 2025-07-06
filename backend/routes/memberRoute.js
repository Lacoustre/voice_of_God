const express = require('express');
const router = express.Router();
const memberController = require('../controller/memberController');

router.post('/', memberController.createMember);
router.get('/', memberController.getMembers);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);
router.post('/upload-image', memberController.uploadMemberImage);

module.exports = router;