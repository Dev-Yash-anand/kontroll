const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const {generateToken} = require('../utils/generateKey')

module.exports.registerUser =async function(req, res) {
    try {
        let { email, password, fullname } = req.body;

        if(!email || !password || !fullname) return res.send("All fields are required");
        let user = await userModel.findOne({email:email});
        if(user) return res.status(401).send("User already exist, please Login");

        bcrypt.genSalt(10, function(err, salt) {
            if (err) return res.status(500).send(err.message);
            bcrypt.hash(password, salt, async function(err, hash) {
                if(err) return res.send(err.message);
                
                    let user =await userModel.create({
                        email, password: hash, fullname
                    }); 
                

                let token = generateToken(user);
                res.cookie("token", token);
                res.redirect('/shop');
            })
        })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.loginUser = async function(req, res) {
    let { email, password } = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.send("Incorrect email or password");
    bcrypt.compare(password, user.password, function(err ,result) {
        if(result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect('/shop');
        }else{
            return res.send("Incorrect email or password");
        }
    })
}

module.exports.logout = function(req, res ) {
    res.cookie("token", "");
    res.redirect('/');
}