const {User} = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
    try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    
    const user = new User({ email, password: hashedPassword });

    await user.save()
    res.status(201).send({ Message: "User saved !" })
    } catch(err) {
        res.status(409).send({ Message: "User not saved ! " + err });
    }
};

function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)
}

async function logUser(req, res) {
    try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(req.body);
    const user = await User.findOne({email: email});

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        res.status(403).send({ Message: "Wrong password !"})
    }
    const token = createToken(email, user)
    res.status(200).send({ userId: user._id, token: token })
    } catch(err) {
        console.error(err)
        res.status(500).send({Message: "internal error"})
    }
}

function createToken(email, user) {
    const jwtPassword = process.env.JWT_PASSWORD;
    return jwt.sign({ email: email, userId: user._id }, jwtPassword, {expiresIn: "24h"})
}

//User.deleteMany({}).then(() => console.log("all removed"))
module.exports = {createUser, logUser};