const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Links = require('../models/Links');

exports.upload = (req,res,next) => {

  const settingMulter = {
    limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: fileStorage = multer.diskStorage({
      destination: (req,file,cb) => {
        cb(null, __dirname+'/../uploads')
      },
      filename: (req,file,cb) => {
        // const extention = file.mimetype.split('/')[1];
        // cb(null, `${shortid.generate()}.${extention}`)
        const extention = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
        cb(null, `${shortid.generate()}${extention}`)
      }
    })
  };
  
  const upload = multer(settingMulter).single('file');

  upload(req,res,async error => {
    console.log(req.file);
    if(!error){
      res.json({ file: req.file.filename })
    } else {
      console.log(error);
      return next();
    }
  })  
};

exports.delete = (req,res,next) => {
  console.log(req.file);
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.file}`)
    console.log('eliminado el archivo');
  } catch (error) {
    console.log(error);
  }
};

exports.download = async (req,res, next) => {
  const link = await Links.findOne({ name: req.params.file })
  const file = __dirname + '/../uploads/' + req.params.file;
  res.download(file);

  let { downloads, name } = link;

  if(downloads === 1){
    req.file = name;
    await Links.findOneAndRemove(link.id)
    next();
  } else {
    link.downloads--;
    await link.save();
  }
}