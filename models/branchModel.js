module.exports =(sequelize,Sequelize) =>{

    const Branch = sequelize.define("branches", {
        branch_code: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        branch_name: {
            type: Sequelize.STRING
        },
        address:{
            type: Sequelize.TEXT
        }
    });

    return Branch;
};

