const pool = require('../configs/db_config');

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const getUserById = (req, res) => {
    const id = req.params.id;

    pool.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
        if(error){
            return res.status(500).json({message : error.message });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(results.rows)
    });
};

const getUserByUsernameOrEmail = (req, res) => {
    const { username, email, password } = req.body
    if(!password) return res.status(400).json({ message : "Password is required"});
    if(!username && !email) return res.status(400).json({ message : "Username or email required" });

    pool.query('SELECT * FROM users WHERE user_username = $1 OR user_email = $2', [username || null, email || null], (error, results) => {
        if (error) return res.status(500).json({ message : error.message });

        if (results.rows.length > 0) {
            const user = results.rows[0];

            if (user.user_password === password) {

                req.session.user_id = user.user_id;
                
                return res.status(200).json({
                    message : `Welcome back ${user.user_username || user.user_email}!`
                });
            }
            return res.status(401).json({message : "Invalid credentials. Try again"})
        }
        return res.status(401).json({message : "Invalid credentials. Try again"});
    });
};

const createUser = (req, res) => {
    const {username, email, password} = req.body
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email, and password are required' });
    }
    pool.query('INSERT INTO users (user_username, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [username, email, password], (error, results) => {
        if(error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(201).json({message : `User added with  ID: ${results.rows[0]?.user_id}`})
    });
};

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