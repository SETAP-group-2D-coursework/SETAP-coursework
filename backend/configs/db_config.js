const { error } = require('console')

const Pool = require('pg').Pool

const pool = new Pool ({
    user:'slotify_team',
    host: 'localhost',
    database: 'slotify_db',
    password:'team_password',
    port: 5432,
})

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error 
        }
        res.status(200).json(results.rows)
    })
}

const getUserById = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if(error){
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getUserByUsernameOrEmail = (req, res) => {

    const { username, email, password } = req.body
    
    pool.query('SELECT * FROM users WHERE user_username = $1 OR user_email = $2', [username, email], (error, results) => {

        if (error) {
            return res.status(500).send({message : error.message})
        } 
        if (results.rows.length > 0) {
            const user = results.rows[0];
            if (user.user_password === password) {
                return res.status(200).send({
                    message : `You have signed in successfully, welcome back ${user.user_username || user.user_email}!`
                });
            } else {
                return res.status(401).send({message : "Invalid credentials. Try again"})
            }
        } else { 
            return res.status(401).send({message : "Invalid credentials. Try again"});
    }});
};

const createUser = (req, res) => {
    const {username, email, password} = req.body

    pool.query('INSERT INTO users (user_username, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [username, email, password], (error, results) => {
        if(error) {
            throw error
        }
        res.status(201).send(`User added with  ID: ${results.rows[0].id}`)
    })
}

const updateUser = (req, res) => {
    const id = parseInt(req.params.id)
    const {username, email, password} = req.body

    pool.query(
        'UPDATE users SET user_username = $1, user_email = $2, user_password = $3 WHERE user_id = $4',
        [username, email, password, id],
        (error, results) => {
            if (error){
                throw error
        }
        res.status(200).send(`User modified with id ${id}`)
        }
    )
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id)

    pool.query('DELETE FROM users WHERE user_id = $1', [id], (error, results) => {
        if(error) {
            throw error
        }
        res.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers, 
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByUsernameOrEmail
};