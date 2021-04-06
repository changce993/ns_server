const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

exports.authUser = async (req,res,next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user){
    res.status(401).json({ msg: 'El usuario no existe' });
    return next();
  }

  if(bcrypt.compareSync(password, user.password)){
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.SECRET, { expiresIn: '8h' });
    res.json({ token });
  } else {
    res.status(401).json({ msg: 'La contraseña es incorrecta' })
    return next()
  }
};

exports.userAuthenticated = (req,res, next) => {
  res.json({user: req.usuario});
};