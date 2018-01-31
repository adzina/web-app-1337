/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 import * as bcrypt from "bcryptjs"


module.exports = {
  tableName:"users",
  attributes: {
    first_name: {type:'string', required: true},
    last_name: {type:'string', required: true},
    email: {type: 'string', required: true, email: true, unique: true},
    password: {type: 'string', required:true},
    role: {type: 'array', required:true},

 },
 /**
  * this holds our validation message by
  * sails-hook-validation dependency
  */
 validationMessages: { //hand for i18n & l10n
   names: {
     required: 'Name is required'
   },
   email: {
     email: 'Provide valid email address',
     required: 'Email is required',
     unique: 'This email is already existing'
   },
   password: {
     required: 'Password is required'
   }
 },

 /**
  * this is called so we can create our password hash for us
  *
  * before saving
  * @param values
  * @param cb
  */
 beforeCreate: function (values, cb) {

   // Hash password
   bcrypt.hash(values.password, 10, function (err, hash) {
     if (err) return cb(err);
     values.password = hash;
     cb();
   });
 }
}
