const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {pool} = require('../db')

const login = async (req, res) => {
    
    let code, message, data

    try {

        const {
            email,
            password
        } = req.body
        
        if (email && password) {

            const getQuery = await pool.query('SELECT * FROM users WHERE email=$1', [email])


            if (Boolean(getQuery.rowCount)) {

                const user = getQuery.rows[0]

                const passMatch = await bcrypt.compare(password, user.password)

                if (!passMatch) {
                    code = 403
                    message = 'Invalid credentials.'

                    return res.status(code).json({message})
                }

                const token = jwt.sign({email: user.email, username: user.username}, process.env.JWT_SECRET)

                delete user.password

                code = 200
                message = 'User authenticated.'
                data = {
                    token,
                    user,
                }

            } else {
                code = 404
                message = 'No user found with those credentials.'
                data = {}
            }

            return res.status(code).json({message, data})
            
        } else {

            code = 400
            message = 'Please enter all the necessary credentials.'

            return res.status(code).json({message})
        }

    } catch (e) {
        
        code = 500
        message = e.message

        return res.status(code).json({message})

    }
}

const register = async (req, res) => {

    const {
        email,
        password,
        username,
        name,
    } = req.body

    let message, code, data

    if (email && password && username && name) {

        pool.query('SELECT * FROM users WHERE email=$1', [email], async (err, result) => {
            if (err) {
                throw err
            }
            if (!Boolean(result.rows.length)) {
                try {

                    const salt = await bcrypt.genSalt()
                    const passwordEncrypted = await bcrypt.hash(password, salt)
                    
                    const insertQuery = await pool.query('INSERT INTO users (email, username, name, password) VALUES ($1, $2, $3, $4) RETURNING *', [email, username, name, passwordEncrypted])

                    const token = jwt.sign({email, username}, process.env.JWT_SECRET)

                    const user = insertQuery.rows[0]
                    
                    delete user.password

                    message = 'User created.'
                    code = 200
                    data = {
                        token,
                        user,
                    }

                } catch (e) {
                    code = 500
                    message = 'Server error.'
                    data = {
                        e
                    }
                }
                


            } else {
                code = 400
                message = 'User already exists with these credentials'
                data = {}
            }
            res.status(code).json({message, data})
        })
    } else {
        code = 400
        message = 'Please fill in the necessary fields.'
        data = {}
        res.status(code).json({message, data})
    }
    
}

const update = async (req, res) => {
    
    const {
        email,
        name,
        username,
        id,
    } = req.body
    
    let message, code, data
    
    try {
        if (email && name && username) {

            const updateQuery = await pool.query('UPDATE users SET name=$1 , email=$2 , username=$3 WHERE id=$4 AND email=$2 RETURNING *', [name, email, username, id])

            if (Boolean(updateQuery.rowCount)) {
                
                user = updateQuery.rows[0]
                delete user.password

                code = 200
                message = 'Details updated.'
                data = {
                    user,
                }

            } else {
                code = 400
                message = 'Invalid credentials.'
                data = {}
            }
            
            res.status(code).json({message, data})
        }
        
    } catch (e) {
        code = 500
        message = 'Server error.'
        data = {e}
        res.status(code).json({message, data})
    }
}



module.exports = {
    login,
    register,
    update
}