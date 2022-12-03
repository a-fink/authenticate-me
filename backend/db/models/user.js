'use strict';
const { Validator } = require('sequelize');

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
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
