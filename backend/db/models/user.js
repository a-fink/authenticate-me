'use strict';
const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error('Cannot be an email.');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 256]
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  },
  {
    // default scope - all queries outside of special testing queries should exclude private user data for security
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      // if we need to specifically find a user we can access user data with this scope, but still exclude password for security
      currentUser: {
        attributes: { exclude: ['hashedPassword']}
      },
      // when logging a user in we need to get all fields including password, this scope should only be used in that instance
      loginUser: {
        attributes: {}
      }
    }
  });

  // included by default when user model made, if need to associate with other tables for relational info can do here
  User.associate = function(models) {
    // associations can be defined here
  };

  // function will be used to get the user data that it is safe to include in a JWT - destructures the data from the current user intance (this)
  // inputs - none
  // returns - object containing the id, username, and email of the current user instance
  User.prototype.toSafeObject = function(){
    const {id, username, email} = this;
    return {id, username, email}
  }

  // function used to check password matches
  // inputs - password
  // returns - true or false for whether password is valid
  User.prototype.validatePassword = function(password){
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  }

  // function to get current user by id - async b/c finding methods return promises that resolve to data from DB - uses scope to get user data but not password
  // inputs - a user id
  // returns - the matching user intance or null
  User.getCurrentUserById = async function(id){
    return await User.scope('currentUser').findByPk(id);
  }

  // function to log in a user - async b/c finding methods return promises that resolve to data from DB
  // inputs - an object containing a credential (either email or username) and a password
  // returns - the matching user intance (user exists & password valid) or undefined (no user, or invalid password)
  User.login = async function({credential, password}){
    const {Op} = require('sequelize');
    // using login scope so we get access to password too - find user who's email or username matches the given credential
    const user = await User.scope('loginUser').findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });
    // if a user was found, use our validatePassword method to make sure passwords match - use currentUser scope to exclude password when returning
    if(user && user.validatePassword(password)) {
      return await User.scope('currentUser').findByPk(user.id);
    }
  };

  // function to sign up a new user - async b/c finding/inserting methods return promises that resolve to data from DB - use currentUser scope to exclude password when returning
  // inputs - object containing username, email, and password
  // returns - matching user instance (once create) or null (user not created/found)
  User.signup = async function({username, email, password}){
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      username,
      email,
      hashedPassword
    });
    return await User.scope('currentUser').findByPk(user.id);
  }

  return User;
};
