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
  countAllGuessed:function(req,res){
    var studentID = req.param("studentID");
    return sails.models.studentword.count({studentID: studentID,guessed:true}).exec(function countCB(error, number) {
      sails.log.debug("All guessed counted");
      sails.log.debug(number);
      res.json(number)
    });
  },
  countAll:function(req,res){
    var studentID = req.param("studentID");
    return sails.models.studentword.count({studentID: studentID}).exec(function countCB(error, number) {
      sails.log.debug("All words counted");
      sails.log.debug(number);
      res.json(number)
    });
  }



};
interface word {
  english: string,
  polish: string,
  id: string;
}
