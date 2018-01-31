/**
 * Lesson.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "lesson",
  attributes: {
      teacherID: {type:'string', required: true},
      date: {type: 'date', required: true},//type: 'ref'
      subject: {type: 'string', required: true, unique:true}
  }
};
