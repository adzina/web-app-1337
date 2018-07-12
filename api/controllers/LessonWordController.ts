import * as async from "async";
declare var sails: any;

module.exports={
create: function(req,res){
    let _teacherID=req.param('teacherID'),
        _wordID=req.param('wordID');

    return sails.models.lessonword.create({
      lessonID: _teacherID,
      wordID: _wordID

    })
    .exec(function (err, lessonWord){
      if (err) {
        sails.log.debug("Error creating LessonWord");
        sails.log.error(err);
        return res.serverError(err); }
      sails.log.debug("LessonWord created");
      sails.log.debug(lessonWord);
      return res.ok();
    });
},

getLessonsWords:function(req,res){
  let _lessonID=req.param('lessonID');

  this.getWordsID(_lessonID,wordsID=>{
      var output:word[];
      output=[];
      async.each(wordsID, function (wordID, cb) {
        sails.models.word.findOne({id: wordID})
          .then(function(word){
            var elem:word;
            elem={id:<string>word.id,
              polish: <string>word.polish,
              english: <string>word.english,
              comment: <string>word.comment,
              url: <string>word.url};
            output.push(elem);
            //inside the iterator function we call cb() once we are finished
            cb();
          })
          .fail(function(error){
            sails.log.debug("Error in getLessonsWords");
            sails.log.error(error);
            cb(error);
          })
      }, function(error){
        //... and handle it in the final callback
        if(error) return res.negotiate(error);

        //here we can return our finished use
        return res.json(output);
});
  })


},
getWordsID:function(_lessonID,callback){
  sails.models.lessonword.find({lessonID:_lessonID})
    .exec(function(err,words){
      if(err) {
          sails.log.debug("Error getting word's id");
          sails.log.error(err);
      }
      var output:string[];
      output=[];
      for(var i=0;i<words.length;i++){
        output[i]=words[i].wordID;
      }
      return callback(output);
    })
},
removeWordFromLesson:function(req,res){
  var _wordID=req.param('wordID'),
      _lessonID=req.param('lessonID');

  sails.models.lessonword.destroy(
    { wordID: _wordID,
      lessonID: _lessonID})
      .exec(function (err, deleted){
        if (err) {
          sails.log.debug("Error deleting word from lesson");
          sails.log.error(err);
          return res.serverError(err); }
        sails.log.debug("Word removed from lesson");
        sails.log.debug(deleted);
        sails.models.studentword.destroy({wordID:_wordID})
        .exec(function(err,removed){
          return res.json(removed);

        })
      });
}
}
interface lesson{
  id: string,
  teacherID: string,
  date: Date,
  subject: string
}
interface word{
  id: string,
  polish: string,
  english: string,
  comment: string,
  url: string
}
interface lessonword{
  id: string,
  lessonID: string,
  wordID: string
}
