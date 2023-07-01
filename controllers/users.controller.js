const db=require('../models');
const userModel = require('../models/user.model');
const roleMode=require('../models/role.model');
const Op = db.Sequelize.Op;

//create main model
const User=db.user;

const getAllUsers=async (req,res)=>{
    // username=req.query.username;
    // var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;

    await User.findAll({ include: db.role}) //{where: condition } attributes:[  'username', 'email']
    .then(data=>{
        res.send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "some error occured"
        })
    })

    // res.status(200).send(branches);
}

//3. get one User
const getOneUser=async (req,res)=>{
    let id=req.params.id
     await User.findOne({where: {id: id}})
     .then(data=>{
        if(data){
            res.send(data)
        }else{
            res.status(404).send({
                message:  `Cannot find User with id=${id}.`
            });
        }
     })
     .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
}

//4. update User
const updateUser=async (req,res)=>{
    let id=req.params.id
    await User.update(req.body, {where: {id: id}})
    .then(num=>{
        if(num==1){
            res.send({
                message: "User was updated successfully"
            })
        }else{
            res.send({
                message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
              });
        }
    })
}

//delete User
const deleteUser=async (req,res)=>{
    let id=req.params.id
    await User.destroy({where:{id: id}})
    .then(num=>{
        if(num==1){
            res.send({
                message: 'User deleted successfully'
            });
        }else{
            res.send({
                message: `Cannot delete User with id=${id}. Maybe User was not found!`
              })
        }
    }).catch(err=>{
        res.status(500).send({
            message : 'could not delete User with id=' + id
        })
    })
    // res.status(200).send("branch deleted");
}



module.exports={
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}