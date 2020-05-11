const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require("../models");
const User = db.users;
const saltRounds = 10;

// Create user
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.password || !req.body.email) {
        res.status(400).send({
            message: "Missing required fields"
        });
        return;
    }

    let password = req.body.password;
    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds)
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||  req.socket.remoteAddress || req.connection.socket.remoteAddress;
                
    // Create a User
    const postObj = {
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
        ip: ip === "::1" ? 'localhost' : ip
    };

    User.create(postObj)
        .then(data => {
            res.send({
                id:data.id,
                name:data.name,
                email:data.email
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Login user
exports.login = async (req, res) => {
    let email= req.body.email;
    let password = req.body.password;
    // Validate request
    if (!req.body.password || !req.body.email) {
        res.status(400).send({
            message: "Missing required fields"
        });
        return;
    }
    const transaction = await db.sequelize.transaction();
    try {

        let user = await User.findAll({raw: true, where: { email: email } }, {transaction});
        await transaction.commit();
        if(user.length >0){
            const comparision = await bcrypt.compare(password, user[0].password)
            if(comparision){
                let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||  req.socket.remoteAddress || req.connection.socket.remoteAddress;
                let token = jwt.sign(user[0], 'varvar', { expiresIn: 60*5 });
                await User.update({
                    lastLogin:new Date(Date.now()).toISOString(),
                    loginCount: user[0].loginCount+1,
                    ip: ip === "::1" ? 'localhost' : ip
                }, {where: { id: user[0].id } }, {transaction});
                return res.send({
                    "code":200,
                    "token":token
                });
            }
            else{
                return res.send({
                    "code":204,
                    "success":"Email and password does not match"
                });
            }
        } else{
            return res.send({
                "code":206,
                "success":"Email does not exits"
            });
        }

        res.send(user);

    } catch (err) {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving posts."
        });
    }
};
