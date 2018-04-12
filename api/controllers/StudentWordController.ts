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
          var at=pair.attempt;
          if (at + 1 == 3 && guessed) {
            //slówko odgadnięte 3 razy z rzedu jest odgadnięte
            var data={studentID: studentID, wordID: wordID,attempt:at,guessed:true};
            sails.models.studentword.update({ studentID: studentID, wordID: wordID },data,function(err,updated){

                return res.json(updated);
            })
          }
          else{//zeruje podejscia jesli student popelnil blad
          if(!guessed) at=0;
          else at=pair.attempt+1;
          var data={studentID: studentID, wordID: wordID,attempt:at,guessed:false};
          sails.models.studentword.update({ studentID: studentID, wordID: wordID },data,function(err,updated){
              return res.json(updated);
          })}

        }
        //creating a pair
        if (!pair && !guessed) {
          var attempt:number;
          attempt=0;
          sails.models.studentword.create({ studentID: studentID, wordID: wordID, attempt: attempt, guessed: false })
          .exec(function(created){
            sails.log.debug("StudentWord created");
            sails.log.debug(created);
            return res.json(created);
          })
        }
        if(!pair && guessed){
          var attempt:number;
          attempt=0;
          sails.models.studentword.create({ studentID: studentID, wordID: wordID, attempt: attempt, guessed: true })
          .exec(function(created){
            sails.log.debug("StudentWord created");
            sails.log.debug(created);
            return res.json(created);
          })
        }
      })


  },
  getAllGuessed:function(req,res){
    var studentID = req.param("studentID");
    return  sails.models.studentword.find({studentID: studentID,guessed:true})
      .exec(function(err,found){
        if(err){
          sails.log.debug("Error getting all guessed");
          sails.log.error(err);
        }
        sails.log.debug("All guessed collected");
        sails.log.debug(found);
        res.json(found);
      })
  },

  countWordsForManyStudents:function(req,res){
    var StudentsID = req.param("studentsID");
    var output:any[];
    output=[];
    var tmp=this;
    console.log(StudentsID)
    async.each(StudentsID, async function (studentID, cb) {
      var allWordsPromise = sails.models.studentword.count({studentID: studentID })

      var guessedWordsPromise = sails.models.studentword.count({studentID: studentID,guessed:true })
      var allWords = await allWordsPromise;
      var guessedWords = await guessedWordsPromise;
       output.push({studentID:studentID,all:allWords,guessed:guessedWords});
       console.log("pośredni output")
       console.log(output)
       cb()

   },  function(error){
       if(error)
         res.negotiate(error);
       else
         {
           sails.log.debug(output);
           console.log("ostateczny output")
           console.log(output)
           return res.json(output);
         }
     })
  }


};
interface word {
  english: string,
  polish: string,
  id: string;
}
