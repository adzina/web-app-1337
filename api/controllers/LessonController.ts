/**
 * LessonController
 *
 * @description :: Server-side logic for managing Lessons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 import { Model } from 'Sails';

 declare var sails: any;
 var LessonModel: Sails.Model = sails.models.lesson;

module.exports = {
  create: function(req,res){
			let _teacherID=req.param('teacherID'),
					_subject=req.param('subject'),
					_date=req.param('date');

			return sails.models.lesson.create({
				teacherID: _teacherID,
				subject: _subject,
				date:_date,

			})
    	.exec(function (err, lesson){
        if (err) { return res.serverError(err); }

        return res.json(lesson);
			});
	},

  getTeacherID: function(req,res){
    var id=req.param('teacherID');

    return sails.models.lesson.find({teacherID: id})
            .exec(function (err, lessons){
                  if (err) { return res.serverError(err); }
                  res.json(200, lessons );
			             });
  },

  getLessonID: function(req,res) {
    var sub=req.param('subject');
    return sails.models.lesson.findOne({subject: sub})
            .exec(function (err, lesson){
                  if (err) { return res.serverError(err); }
                  res.json(200, {id:lesson.id});
			             });
 }
};
