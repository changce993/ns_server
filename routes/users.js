const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');

router.post('/', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'Agrega un email valido').isEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 })
],userController.newUser);

module.exports = router;
