User Requirements
=================

   **Register an Account**
      - A new user can create an account by providing a unique username, email, and password.
      - The user's details are stored in the users table, and a user_id is generated.

   **Login**
      - A registered user can log in using their credentials.
      - Upon successful login, a session is created (req.session.user_id), which is required for accessing most room functionalities.

   **Authentication**
      - A user can only access room-related features if they are logged in.
      - Session-based authentication (req.session.user_id) ensures only authenticated users can create or join rooms.

   **Create Room**
      - A logged-in user can create a new room by providing a room name.
      - Upon creation, a unique 6-character invite code is automatically generated and stored along with the room.

   **Join Room via Invite Code**
      - A user can join an existing room by submitting a valid invite code.
      - The system checks that the room exists and that the user is not already a participant.
      - Once joined, the user is added to the room’s participant list, and a notification is created.

   **Access Room Information**
      - A user can retrieve room details either by room ID or by room name.
   
   **Update or Delete Room**
      - Users can update or delete a room they created using the room ID.
      - Room name updates are validated to ensure data consistency.
   
   **Receive Notifications**
      - When a user joins a room, a notification is automatically generated to confirm the action.
