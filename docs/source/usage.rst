Usage
=====

.. _installation:

Installation
------------

**Setup and Running Instructions**

   **Installation Instructions**: This section provides a step-by-step guide to set up the project on your local machine. It includes prerequisites, installation steps, and how to run the application.

   **Prerequisites**

   Before you begin, ensure you have the following installed on your machine:

      1. Node.js installed (v16 or later recommended).
      2. PostgreSQL installed and running locally.
      3. A PostgreSQL database created (e.g., slotify_db) with correct user credentials.

   **Steps to Set Up**

1. Clone the repository:

.. code-block:: console

   git clone https://github.com/up2235881/SETAP-coursework-2D.git

2. Navigate to the project directory:

.. code-block:: console

   cd SETAP-coursework-2D

3. Install dependencies:

.. code-block:: console

   npm install

4. Configure the database:

   - Ensure the database credentials in db_config.js match your local setup.
   - Run the provided database.sql script to create necessary tables.

5. Start the server:

.. code-block:: console

   node server.js

The app should now be running on http://localhost:3000

6. Open `index.html` in a browser to interact with the frontend.

