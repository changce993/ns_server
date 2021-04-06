const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const filesController = require('../controllers/filesController');
const auth = require('../middlewares/auth');

router.post('/', auth, filesController.upload);
router.get('/:file', filesController.download, filesController.delete);

module.exports = router;