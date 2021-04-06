const Links = require('../models/Links');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.new = async (req,res,next) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }

  const { originalName, name } = req.body;

  const link = new Links();
  link.url = shortid.generate();
  link.name = name;
  link.originalName = originalName;
  
  if(req.usuario){
    const { downloads, password } = req.body;
    
    if(password) {
      const salt = await bcrypt.genSalt(10);
      link.password = await bcrypt.hash(password, salt);
    };
    if(downloads) {
      link.downloads = downloads;
    }
    author = req.usuario;
  }

  try {
    link.save();
    return res.json({ msg: link.url });
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.getLink = async (req,res,next) => {
  const { url } = req.params;
  const link = await Links.findOne({ url });
  
  if(!link) {
    res.status(404).json({ msg: 'No existe ese enlace' });
    return next();
  }
  let { name } = link;
  res.json({ file: name, password: false });

  next()
};

exports.allLinks = async (req,res) => {
  try {
    const links = await Links.find({}).select('url -_id');
    res.json({ links })
  } catch (error) { 
    console.log(error);
  }
};

exports.hasPassword = async (req,res,next) => {
  const { url } = req.params;
  const link = await Links.findOne({ url });
  
  if(!link) {
    res.status(404).json({ msg: 'No existe ese enlace' });
    return next();
  };

  if(link.password){
    return res.json({
      password: true,
      link: link.url
    })
  }

  next();
};

exports.verifyPassword = async (req,res,next) => {
  const { url } = req.params;
  const { password } = req.body;
  const link = await Links.findOne({ url });

  if(bcrypt.compareSync(password, link.password)){
    next();
  }else {
    return res.status(401).json({ msg: 'Contraseña incorrecta' })
  }
}