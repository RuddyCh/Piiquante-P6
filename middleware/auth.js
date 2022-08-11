const jwt = require("jsonwebtoken");

function anthenticateUser(req, res, next) {
    console.log("authenticate user");
    const header = req.header("Authorization");
    if (header == null) return res.status(403).send({ message: "Invalid" })

    const token = header.split(" ")[1];
    if (token == null) return res.status(403).send({ message: "Invalid" })

    jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
        if (err) return res.status(403).send({ message: "Invalid token " + err })
        console.log("Token valid, next step")
        next();
    })
}

module.exports = {anthenticateUser}