const jwt = require("jsonwebtoken")
const {pool} = require('../db')

const auth = (req, res, next) => {
    try {
        const token = req.header("x-auth-token")
        if (token) {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            if (!verified) {
                return res.status(401).json({message: "Token verification failed."});
            }
            pool.query('SELECT * FROM users WHERE email=$1', [verified.email], (err, result) => {
                if (err) {
                    return res.status(500).json({message: "Server error.", err});
                }
                if (Boolean(result.rowCount)) {
                    next()
                } else {
                    return res.status(400).json({message: "User invalid."});
                }
            })
        } else {
            return res.status(401).json({message: "No authorization. Action denied."});
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = auth