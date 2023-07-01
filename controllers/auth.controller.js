const db = require("../models");
const config = require("../config/auth.config");
const ldap = require('ldapjs');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 //sec, 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//////////////////////////////////////////////////////
exports.signinwithActiveDirectory = (req, res) => {
 
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // AD_authenticate_success=true;
      const ldapClient = ldap.createClient({
        url: 'ldap://192.168.100.200', // Replace with your domain controller's address

      });

      const username = req.body.username + "@nibbanksc.com"; // Replace with the user's username
      const password = req.body.password; // Replace with the user's password
      let AD_authenticate_success = false;

      ldapClient.bind(username, password, (bindErr) => {
        if (bindErr) {
          //  console.error('LDAP bind error:', bindErr);
          return res.status(404).send({ message: "Invalid credentials." });// error
          // AD_authenticate_success = false;
          // success(user,AD_authenticate_success,res) //to show error
          // console.log('Invalid user credentials')
          // return;
        }

        AD_authenticate_success = true;
        ldapClient.unbind();
        console.log('User authenticated successfully.');
        // success(user,AD_authenticate_success,res)
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 //sec, 24 hours
        });
        // console.log("token "+token)      
    
        var authorities = [];
        user.getRoles().then(roles => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
          }
    
          res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
          });
        });
    
        
      });

      /*
       console.log('User authenticated outside? ' + AD_authenticate_success);
       if (!AD_authenticate_success) {
         return res.status(404).send({ message: "Invalid credentials." });
       }
 
       var token = jwt.sign({ id: user.id }, config.secret, {
         expiresIn: 86400 //sec, 24 hours
       });
       // console.log("token "+token)      
 
       var authorities = [];
       user.getRoles().then(roles => {
         for (let i = 0; i < roles.length; i++) {
           authorities.push("ROLE_" + roles[i].name.toUpperCase());
         }
 
         res.status(200).send({
           id: user.id,
           username: user.username,
           email: user.email,
           roles: authorities,
           accessToken: token
         });
       });*/

      //addedd
      // })

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}

function success(user,AD_authenticate_success,res){
  
    if (!AD_authenticate_success) {
      return res.status(404).send({ message: "Invalid credentials." });
    }
      
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 //sec, 24 hours
    });
    // console.log("token "+token)      

    var authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });

  
}

