const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 12)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(data => {
      res.status(200).json({
        message: 'User Created Successfully!'
      })
    }).catch(err => {
      res.status(500).json({
        err: 'Email Already Exists, pick another one!'
      })
    })
  })
}

exports.getlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email})
  .then(user => {
    if(!user){
      return res.status(404).json({
        message: 'User Not found'
      })
    }
   return bcrypt.compare(password, user.password)
    .then(result => {
      if(!result){
        return res.status(404).json({
          message: 'Authentication Failed'
        })
      }
      const token = jwt.sign({email:user.email, userId: user._id},
        'abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*',
        { expiresIn: '1h'}
      );
      res.status(200).json({
        message: 'Authentication successfull!',
        token: token
      })
    }).catch(error => {
      console.log(error);
    })
  }).catch(error => {
    console.log(error);
  })
}
