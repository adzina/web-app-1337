 declare var sails: any;

module.exports = {
  create: function(req,res){
			let _teacherID=req.param('teacherID'),
          _groupID = req.param('groupID'),
					_subject=req.param('subject'),
					_date=req.param('date'),
          _hour=req.param('hour');

			return sails.models.lesson.create({
				teacherID: _teacherID,
        groupID: _groupID,
				subject: _subject,
				date:_date,
        hour: _hour

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
  getTeachersLessons: function(req,res){
    var id=req.param('teacherID');
    var lessons=[]
    return sails.models.lesson.find({teacherID: id}).populate('groupID').sort('date ASC')
            .exec(function (err, _lessons){
                  if (err) {
                    sails.log.debug("Error getting teacher's lessons");
                    sails.log.error(err);
                    return res.serverError(err); }
                  sails.log.debug("Teacher's lessons collected");
                  sails.log.debug(_lessons);
                  res.json(200, _lessons);
                })

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
