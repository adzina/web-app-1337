declare var sails: any;

module.exports = {
  add: function(req,res){
      var eng=req.param('english'),
          pol=req.param('polish'),
          lessonID=req.param('lessonID');

          this.create(eng,pol, (wordID) => {
              this.addToLesson(lessonID,wordID,(wordLesson)=>{
                return res.json(200);
              })
          });


  },

   create: function(eng,pol,callback){
     sails.models.word.findOne({ english: eng, polish: pol })
       .exec(function(err, word) {
           if(!word){
             sails.models.word.create({
                 english:eng,
                 polish:pol})
             .exec(function (err,word){
               if(err){console.log(err);}
              return callback(word.id);

              })
         }
         else{
           return callback(word.id)
         }
       })
},

  addToLesson: function(lessonID,wordID,callback){
    sails.models.lessonword.create({
      lessonID:lessonID,
      wordID:wordID}).exec(function (err, wordLesson){
          if(err){console.log(err);}
          return callback(wordLesson);
			});

    }
};
