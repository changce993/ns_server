const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/',
  [
    check('email', 'Agrega un email valido').isEmail(),
    check('password', 'La contraseña no puede ir vacia').not().isEmpty()
  ]
, authController.authUser);
router.get('/', auth, authController.userAuthenticated);

module.exports = router;
 