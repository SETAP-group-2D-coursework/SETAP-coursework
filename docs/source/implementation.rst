Implementation
==============

This section provides a detailed overview of the implementation of the project, including the technologies used, the core components, and the database structure. It also outlines the key features and functionalities that were developed to meet the project requirements.


Elements of Implementation
---------------------------

   **Technologies Used**: The project was developed using a combination of technologies to ensure a robust and scalable application.
      
      - *Frontend:* HTML5, CSS3, and vanilla JavaScript were used to build the user interface. The design focuses on simplicity and accessibility for tasks like room creation and joining.
    

      - *Backend:* Node.js with Express.js was used to handle server-side logic, including routing, session handling, and API requests.
      

      - *Database:* PostgreSQL was used as the relational database system, managed through the pg Node.js library. It stores user data, room information, participants, and notifications.


      - *Authentication:* Session-based authentication was implemented using express-session to manage user login states securely across requests.


      - *Notifications(Planned):* Internal notification logic is implemented, with room to extend to email or push notifications in future iterations.

      More detail about this in the "Core Components of the Project" section below.

   **Development Tools:**
      
      - *Version Control:* Git was used for version control, with a repository hosted on GitHub to facilitate collaboration and code management.
      
      - *Testing:* Basic unit tests were written using Jest to ensure the functionality of critical components, especially in the backend.



Core Components of the Project
------------------------------


   **Frontend Components**
      
      - *HTML Pages:*

         - index.html: Provides a landing interface for users to either create or join a room.

         - createroom.html: Contains the room creation form with client-side validation.

         - joinroom.html: Allows users to enter a room via an invite code.

      - *JavaScript:*

         - index.js: Handles form validation and user interactions, and sends requests to the backend API.

      - *Styling:*

         - styling.css: Provides consistent and responsive styling for all pages using custom layout and UI classes.
      
      - *Implementation:*
         
         The frontend is built using plain HTML, CSS, and JavaScript without any frameworks. Forms like room creation and joining use JavaScript to validate user input and send requests to the server using fetch(). This approach keeps things simple and lightweight, making it easy to understand and maintain.
   
   **Backend Structure**
      - *Routing Modules:*

         - userRoutes.js: Handles user-related endpoints such as registration and login.

         - roomRoutes.js: Manages room creation, joining, updating, and deletion.

      - *Logic & Data Access:*

         - userModel.js and roomModel.js: Contain functions that process user input, perform validations, and interact directly with the database.

      - *Middleware:*

         - authMiddleware.js: Restricts access to certain API routes based on user session authentication.
      
      - *Implementation:*

         The backend is created using Node.js and Express. All API routes are organized into separate files (userRoutes.js and roomRoutes.js) for clarity. The actual logic for handling data and interacting with the database is written inside userModel.js and roomModel.js. While these files mix controller logic and database queries, it helped keep the code compact and easier to manage for this project. Middleware like authMiddleware.js is used to protect certain routes so only logged-in users can access them. Session management is handled using express-session.
         
   **Database Structure**
      - *Schema Overview (database.sql):*

         - users: Stores user credentials and account details.

         - rooms: Keeps track of room metadata like name, creator, and invite code.

         - room_participants: Records user-room associations and join timestamps.

         - notifications: Logs messages related to user actions (e.g., joining rooms), prepared for future integration with external notification services.

      - *Implementation:*

         The database uses PostgreSQL, with a schema defined in the database.sql file. It includes tables for users, rooms, participants, and notifications. Each table has a primary key and foreign keys where necessary to maintain relationships. SQL queries are written directly in the model files and use placeholders to protect against SQL injection. While the notifications table is not fully used yet, it's set up for future features like reminders or alerts when users join rooms.
         