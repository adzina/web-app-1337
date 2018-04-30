declare var sails: any;

module.exports = {
  add: function(req,res){
      var eng=req.param('english'),
          pol=req.param('polish'),
          comment=req.param('comment'),
          lessonID=req.param('lessonID');

          this.create(eng,pol,comment, (wordID) => {
              this.addToLesson(lessonID,wordID,(wordLesson)=>{
                sails.log.debug("Word added");
                sails.log.debug(wordLesson);
                return res.json(200);
              })
          });


  },

   create: function(eng,pol,comment,callback){
     sails.models.word.findOne({ english: eng, polish: pol, comment:comment })
       .exec(function(err, word) {
           if(!word){
             sails.models.word.create({
                 english:eng,
                 polish:pol,
                 comment:comment})
             .exec(function (err,word){
               if(err){
                sails.log.debug("Error creating word");
                 sails.log.error(err);}
              return callback(word.id);

              })
         }
         else{
           return callback(word.id)
         }
       })
},
update: function(req, res){
  let id = req.param("id"),
      pol = req.param("pol"),
      eng = req.param("eng"),
      comment = req.param("comment")
  let data = {id:id, polish:pol, english:eng, comment:comment}
  sails.models.word.update({ id: id },data,function(err,updated){
      if(err){
        sails.log.err(err)
        sails.log.debug("Error updating word")
      }
      sails.log.debug("word updated")
      return res.json(updated);
  })
},

  addToLesson: function(lessonID,wordID,callback){
    sails.models.lessonword.create({
      lessonID:lessonID,
      wordID:wordID}).exec(function (err, wordLesson){
          if(err){
            sails.log.debug("Error in addToLesson");
            sails.log.error(err);}
          return callback(wordLesson);
			});

    }
};
