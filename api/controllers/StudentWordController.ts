import * as async from "async";
declare var sails: any;

module.exports = {
  addOrUpdateStudentWord: function(req, res) {
    var guessed = req.param("guessed"),
      studentID = req.param("studentID"),
      wordID = req.param("wordID");
    sails.models.studentword.findOne({ studentID: studentID, wordID: wordID })
      .exec(function(err, pair) {
        if (pair) {
          var at = pair.attempt;
          if (at + 1 >= 3 && guessed) {
            //slówko odgadnięte 3 razy z rzedu jest odgadnięte
            if (at + 1 == 3)
              var data = { studentID: studentID, wordID: wordID, attempt: at, guessed: true };
            else
              at = at - 3 //jeśli slówko zostao przypisane do student drugi raz(kolejna lekcja)
                //to musi sie go nauczyc jeszcze raz
            var data = { studentID: studentID, wordID: wordID, attempt: at, guessed: false };

            sails.models.studentword.update({ studentID: studentID, wordID: wordID }, data, function(err, updated) {

              return res.json(updated);
            })
          }
          else {//zeruje podejscia jesli student popelnil blad
            if (!guessed) at = 0;
            else at = pair.attempt + 1;
            var data = { studentID: studentID, wordID: wordID, attempt: at, guessed: false };
            sails.models.studentword.update({ studentID: studentID, wordID: wordID }, data, function(err, updated) {
              return res.json(updated);
            })
          }

        }
        //creating a pair
        if (!pair && !guessed) {
          var attempt: number;
          attempt = 0;
          sails.models.studentword.create({ studentID: studentID, wordID: wordID, attempt: attempt, guessed: false })
            .exec(function(created) {
              sails.log.debug("StudentWord created");
              sails.log.debug(created);
              return res.json(created);
            })
        }
        if (!pair && guessed) {
          var attempt: number;
          attempt = 0;
          sails.models.studentword.create({ studentID: studentID, wordID: wordID, attempt: attempt, guessed: true })
            .exec(function(created) {
              sails.log.debug("StudentWord created");
              sails.log.debug(created);
              return res.json(created);
            })
        }
      })


  },
  getAllGuessed: function(req, res) {
    var studentID = req.param("studentID");
    return sails.models.studentword.find({ studentID: studentID, guessed: true })
      .exec(function(err, found) {
        if (err) {
          sails.log.debug("Error getting all guessed");
          sails.log.error(err);
        }
        sails.log.debug("All guessed collected");
        sails.log.debug(found);
        res.json(found);
      })
  },
  getMyProgress: function(req, res){
    var studentID = req.param("studentID");
    var lessonID  = req.param("lessonID");
    var all_guessed = 0
    var all = 0
    this.getWordsID(lessonID, ids=>{
      async.each(ids, async function(id,cb){
        var guessedPromise = sails.models.studentword
                      .find({studentID:studentID,wordID:id, guessed:true})
        var guessed = await guessedPromise
        console.log(guessed)
        if(guessed.length>0)
                  all_guessed += 1
        all+=1
        cb()
      }, function(error){
        if (error)
          sails.log.error(error);
        else {
          sails.log.debug({guessed:all_guessed,all:all});
          return res.json(200,{guessed:all_guessed,all:all})
        }
      }
    )
  })


  },
  getWordsID:function(_lessonID,callback){
      var output: any[];
      output = []
      async.each(_lessonID, async function(lessonID, cb) {
        var wordsPromise = sails.models.lessonword.find({ lessonID: lessonID })
        var words = await wordsPromise;
        for(var i=0;i<words.length;i++){
          output.push(words[i].wordID)
        }
        cb()
      }, function(error) {
        if (error)
          sails.log.error(error);
        else {
          sails.log.debug("words found")
          sails.log.debug(output);
          return callback(output)
        }
      })
  },
  getLastNLessons:function(group, limit, callback){
    sails.models.lesson.find({groupID:group})
                        .sort('date DESC')
                        .limit(limit)
                        .exec(function(err,lessons){
                          if(err) {
                              sails.log.debug("Error getting lessons' id");
                              sails.log.error(err);
                          }
                          var output:string[];
                          output=[];
                          for(var i=0;i<lessons.length;i++){
                            output[i]=lessons[i].id;
                          }
                          sails.log.debug("Last n lessons found")
                          sails.log.debug(lessons)
                          return callback(output);
                        })
  },
  countWordsForManyStudents: function(req, res) {
    var StudentsID = req.param("studentsID");
    var group = req.param("groupID");
    var limit = req.param("limit")
    var output: any[];
    output = [];

    this.getLastNLessons(group, limit, ids=>{
        this.getWordsID(ids,words=>{
          var allWords = words.length

          async.each(StudentsID, async function(studentID, cb) {

              var guessedWordsPromise = sails.models.studentword.count({ studentID: studentID, guessed: true })

              var guessedWords = await guessedWordsPromise;
              output.push({ studentID: studentID, all: allWords, guessed: guessedWords });
              console.log("pośredni output")
              console.log(output)
              cb()

            }, function(error) {
              if (error)
                res.negotiate(error);
              else {
                sails.log.debug(output);
                console.log("ostateczny output")
                console.log(output)
                return res.json(output);
              }
            })
        })
    })

  }


};
interface word {
  english: string,
  polish: string,
  comment: string,
  id: string;
}
