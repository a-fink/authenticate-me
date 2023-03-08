# Authenticate-Me
https://user-images.githubusercontent.com/107282070/223629543-3c454aad-398c-405a-971f-30ca3b2e6408.mp4

## Live Site
[Live Site](https://authenticate-me.herokuapp.com/)

## Goals
- Learn and implement PostgreSQL
- Learn and implement Redux Toolkit
- Gain a better understanding of the authentication pattern by building a mock authentication system
- Cement my understanding of how front-end/back-end technologies fit together and communicate
- Gain experience deploying a full-stack application

## Features
- Users can create a new account
    - Front-end validation ensures the user's email, username, and password follow the required formats the database expects
    - Back-end validation ensures the user data received from the front-end matches the required formats before insertion into the database
    - Passwords are hashed and salted using the bcrypt library and only every stored in their encrypted form
- Users can log in to an existing account
    - Submitted passwords are hashed and salted using bcrypt and compared to the stored encrypted value
- Successful log in or signup will set a JSON web token (JWT) in the user's cookies
    - This token encodes the user's id, username, and email
    - Presence or absence of this cookie/token is used to ensure only requests from logged in users can access protected endpoints
- Users can log out
    - This removes the JWT cookies from the user's cookies

## Technologies Used
- **Backend:** ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white) ![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
- **Frontend:** ![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## Recently Completed Improvements
- Troubleshoot routing between Express/React-Router/Heroku to solve not found on refresh bug
- Additional styling for better mobile experience

## Planned Future Improvements
- Add required and aria-required attributes to forms for better user experience and accessibility
- Add additional features for logged in users

### Acknowledgements
This is a solution to the App Academy Open Full Stack Capstone project
