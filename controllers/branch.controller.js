const db=require('../models');
const branchModel = require('../models/branchModel');
const Op = db.Sequelize.Op;

//create main model
const Branch=db.branches;

//1. create branch
const addBranch = async (req,res)=>{
    let data={
        branch_code: req.body.branch_code,
        branch_name: req.body.branch_name,
        address: req.body.address
    }

    if (!req.body.branch_code) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
        return;
      }

    await Branch.create(data)
    .then(data=>{
        res.send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "some error occured while creating the Branch"
        })
    })

        // const branch = await Branch.create(data) //old model
    // res.status(200).send(branch)
    // console.log(branch)
}

//2. get all branchs
const getAllBranches=async (req,res)=>{
    branch_name=req.query.branch_name;
    var condition = branch_name ? { branch_name: { [Op.like]: `%${branch_name}%` } } : null;

    await Branch.findAll({where: condition }) // attributes:[  'branch_code', 'branch_name']
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

//3. get one branch
const getOneBranch=async (req,res)=>{
    let id=req.params.id
     await Branch.findOne({where: {id: id}})
     .then(data=>{
        if(data){
            res.send(data)
        }else{
            res.status(404).send({
                message:  `Cannot find Branch with id=${id}.`
            });
        }
     })
     .catch(err => {
        res.status(500).send({
          message: "Error retrieving Branch with id=" + id
        });
      });
}

//4. update branch
const updateBranch=async (req,res)=>{
    let id=req.params.id
    await Branch.update(req.body, {where: {id: id}})
    .then(num=>{
        if(num==1){
            res.send({
                message: "Branch was updated successfully"
            })
        }else{
            res.send({
                message: `Cannot update Branch with id=${id}. Maybe Branch was not found or req.body is empty!`
              });
        }
    })
}

//delete branch
const deleteBranch=async (req,res)=>{
    let id=req.params.id
    await Branch.destroy({where:{id: id}})
    .then(num=>{
        if(num==1){
            res.send({
                message: 'Branch deleted successfully'
            });
        }else{
            res.send({
                message: `Cannot delete Branch with id=${id}. Maybe Branch was not found!`
              })
        }
    }).catch(err=>{
        res.status(500).send({
            message : 'could not delete branch with id=' + id
        })
    })
    // res.status(200).send("branch deleted");
}

async function deleteAllBranches(req,res){
    Branch.destroy({
    where: {},
    truncate: false 
    })
    .then(nums=>{
        res.send({message: `${nums} Branches were deleted successfully!`})
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all branches."
        });
      });
}


module.exports={
    getAllBranches,
    getOneBranch,
    addBranch,
    updateBranch,
    deleteBranch,
    deleteAllBranches
}