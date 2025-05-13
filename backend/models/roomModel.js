const pool = require('../configs/db_config');
const { randomUUID } = require('crypto');

const createRoom = (req,res) => {
    const { roomName } = req.body

    if(!roomName) return res.status(400).json({ message : "Room name is required to continue." });

    const user_id = req.session.user_id;
    if(!user_id) return res.status(401).json({ message : "Unauthorized - please log in" });
    const inviteCode = randomUUID().slice(0, 6);
    pool.query('INSERT INTO rooms (user_id, room_name, invite_code) VALUES ($1, $2, $3) RETURNING *', 
        [user_id, roomName, inviteCode], (error, results) => {
        if (error) {
            return res.status(500).json({ message : error.message })
        }
        res.status(201).json({ message : "Room has successfully been created!", room: results.rows[0] });
    });
};

const getRoomById = (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ message : "Invalid room ID" });
    pool.query('SELECT * FROM rooms WHERE room_id = $1', [id], (error, results) => {
        if (error) {
            return res.status(500).json({message : error.message});
        }
        if (results.rows.length === 0){
            return res.status(400).json({message : "Room not found" });
        }
        res.status(200).json(results.rows[0]);
    });
};

const getRoomByName = (req,res) => {
    const { roomName } = req.body;

    if (!roomName) return res.status(400).json({ message: "A room name is required." });
    pool.query('SELECT * FROM rooms WHERE room_name = $1', [roomName], (error, results) => {
        if (error) return res.status(500).json({message : error.message});
        if (results.rows.length === 0) return res.status(404).json({ message : "Room not found" });
        res.status(200).json(results.rows[0]);
    });
};

const updateRoom = (req, res) => {
    const id = parseInt(req.params.id);
    const {roomName} = req.body;
    if(!roomName) return res.status(400).json({ message : "Room name required" });
    pool.query('UPDATE rooms SET room_name = $1 WHERE room_id = $2', [roomName, id], (error, results) => {
            if (error)return res.status(500).json({message : error.message});
            res.status(200).json({ message : "Room updated!" })
        });
};

const deleteRoom = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM rooms WHERE room_id = $1', [id], (error, results) =>{
        if(error) return res.status(500).json({ message : error.message });
        res.status(200).json('Room has officially been deleted.');
    });
};

const Room = {

    // Get a room by its invite code
    async getByInviteCode(invite_code) {
        const query = 'SELECT room_id, room_name, invite_code FROM rooms WHERE invite_code = $1';
        const { rows } = await pool.query(query, [invite_code]); 
        return rows[0] || null;
    },

    // Check if a user is already in the room
    async checkUserInRoom(user_id, room_id) {
        const query = 'SELECT * FROM room_participants WHERE user_id = $1 AND room_id = $2';
        const { rows } = await pool.query(query, [user_id, room_id]);
        return rows.length > 0;
    },

    // Add a user to a room and create a notification
    async addUserToRoom(user_id, room_id, room_name) {
        const client = await pool.connect(); 
        try {
            await client.query('BEGIN'); 
            await client.query(
                'INSERT INTO room_participants (user_id, room_id, joined_at) VALUES ($1, $2, NOW())',
                [user_id, room_id]);
            await client.query(
                'INSERT INTO notifications (user_id, notification_type, message, sent_at, notification_status, expiration_date) VALUES ($1, $2, CURRENT_TIMESTAMP, $4, CURRENT_TIMESTAMP + INTERVAL \'7 days\')',
                [user_id, 'General', `You have joined room ${room_name}`, 'Sent']
            );

            await client.query('COMMIT'); // Commit the transaction if successful
            return true;
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback transaction in case of an error
            throw error;
        } finally {
            client.release(); // Release the database connection back to the pool
        }
    }

};

const joinRoom = async (req, res) => {
    const { inviteCode } = req.body;
    console.log('InviteCode: ', inviteCode);
    const user_id = req.session.user_id;
    if(!user_id || !inviteCode) {
        return res.status(400).json({ message : "User ID and invite code required" });
    }

    try {
        const room = await Room.getByInviteCode(inviteCode);
        console.log('Room', room);
        if (!room) {
            return res.status(404).json({ message : "Room not found" });
        }

        const isInRoom = await Room.checkUserInRoom(user_id, room.room_id);
        if (isInRoom) {
            return res.status(400).json({message : "User already in room!"})
        }

        await Room.addUserToRoom(user_id, room.room_id, room.room_name);
        res.status(200).json({ message : "Joined room!"});
    } catch (error) {
        res.status(500).json({ message : error.message });
    }
};


// Export the Room model

module.exports = {
    createRoom,
    getRoomById,
    getRoomByName,
    updateRoom, 
    deleteRoom, 
    getByInviteCode : Room.getByInviteCode,
    checkUserInRoom : Room.checkUserInRoom,
    addUserToRoom : Room.addUserToRoom,
    joinRoom
};