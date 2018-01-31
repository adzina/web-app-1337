/**
 * Students-word.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "studentWord",
  attributes: {
    studentID: {type:'string', required: true},
    wordID: {type:'string', required: true},
    attempt: {type: 'integer', required: true},
    guessed: {type: 'boolean', required:true}
  }
};
