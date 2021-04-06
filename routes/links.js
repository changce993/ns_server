const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const linksController = require('../controllers/linksController');
const auth = require('../middlewares/auth');

router.post('/',
  check('name', 'Sube un archivo').not().isEmpty(),
  check('originalName', 'Sube un archivo').not().isEmpty(),
auth, linksController.new);

router.get('/', linksController.allLinks);

router.get('/:url', linksController.hasPassword, linksController.getLink);

router.post('/:url', linksController.verifyPassword, linksController.getLink);

module.exports = router;