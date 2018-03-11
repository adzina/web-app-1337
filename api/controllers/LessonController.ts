 declare var sails: any;

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
        if (err) {
          sails.log.debug("Error adding lesson");
          sails.log.error(err);
          return res.serverError(err); }
        sails.log.debug("Lesson created");
        return res.json(lesson);
			});
	},

  getTeacherID: function(req,res){
    var id=req.param('teacherID');

    return sails.models.lesson.find({teacherID: id}).sort('date ASC')
            .exec(function (err, lessons){
                  if (err) {
                    sails.log.debug("Error getting teacher's lessons");
                    sails.log.error(err);
                    return res.serverError(err); }
                  sails.log.debug("Teacher's lessons collected");
                  sails.log.debug(lessons);
                  res.json(200, lessons );
			             });
  },

  getLessonID: function(req,res) {
    var sub=req.param('subject');
    return sails.models.lesson.findOne({subject: sub})
            .exec(function (err, lesson){
                  if (err) {
                    sails.log.debug("Error getting lesson's id");
                    sails.log.error(err);
                    return res.serverError(err); }
                  sails.log.debug("Got lesson's ID");
                  sails.log.debug(lesson.id);
                  res.json(200, {id:lesson.id});
			             });
 }
};
