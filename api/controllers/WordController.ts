declare var sails: any;

const AWS = require("aws-sdk");
const s3 = new AWS.S3({signatureVersion: "v4", region: "eu-central-1"});
const url_base = "https://s3.eu-central-1.amazonaws.com/polly-akn-bucket/";
AWS.config.update({ region: "eu-central-1", });
const credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
const lambda = new AWS.Lambda();

function replaceShorthands(expression: string): string {
  const replaced: string = expression.replace(" sb ", " somebody ").replace(" sth ", " something ").replace(" e.g. ", " for example ");
  return replaced;
}
module.exports = {
	getURL: async function(english: string) {

    const params = {
            FunctionName: "WordReader_NewWord",
            Payload: JSON.stringify({ "english": english }),
	        	InvocationType: "RequestResponse",
	        	LogType: "Tail"
        };
    const lambdaResult = await lambda.invoke(params).promise();
    // removing quotes
    lambdaResult.Payload = lambdaResult.Payload.substring(1, lambdaResult.Payload.length-1);
    return lambdaResult.Payload;
    },
  add: function(req:any, res:any):void {
    var eng :string = replaceShorthands(req.param("english")),
        pol :string = req.param("polish"),
        comment :string = req.param("comment"),
        lessonID :string = req.param("lessonID");

    this.create(eng, pol, comment, (wordID) => {
        this.addToLesson(lessonID, wordID, (wordLesson) => {
        sails.log.debug("Word added");
        sails.log.debug(wordLesson);
        return res.json(200);
        });
    });
  },

  create: function(eng:string, pol:string, comment:string, callback):void {
    const that = this;
    sails.models.word.findOne({ english: eng, polish: pol, comment: comment })
      .exec(function(err, word) {
        if (!word) {
          that.getURL(eng).then(
            data => {
              sails.models.word.create({
                english: eng,
                polish: pol,
                comment: comment,
                url: data
              }).exec(function(err, word) {
                  if (err) {
                    sails.log.debug("Error creating word");
                    sails.log.error(err);
                  }
                  return callback(word.id);
                });
            },
            error => {
              console.log(error);
              sails.models.word.create({
                english: eng,
                polish: pol,
                comment: comment
              }).exec(function(err, word) {
                if(err) {
                  sails.log.debug("Error creating word");
                  sails.log.error(err);
                }
                return callback(word.id);
              });
            }
          );

        } else {
          return callback(word.id);
        }
      });
  },
  update: function(req:any, res:any):void {
    let id :string = req.param("id"),
      pol :string = req.param("pol"),
      comment :string = req.param("comment");
    let data : object = { id: id, polish: pol, comment: comment };
    sails.models.word.update({ id: id }, data, function(err, updated) {
      if (err) {
        sails.log.err(err);
        sails.log.debug("Error updating word");
      }
      sails.log.debug("word updated");
      return res.json(updated);
    });
  },

  addToLesson: function(lessonID:string, wordID:string, callback:any):void {
    sails.models.lessonword.create({
      lessonID: lessonID,
      wordID: wordID
    }).exec(function(err, wordLesson) {
      if (err) {
        sails.log.debug("Error in addToLesson");
        sails.log.error(err);
      }
      return callback(wordLesson);
    });
  },

	getAudio: function(req:any, res:any): object {
    const id:string = req.param("id");
		return sails.models.word.findOne({id: id}).exec(function(err:any, word: any): any {
      if(!word.url) {
        return res.json("");
      }
      var params : object = { Bucket: "polly-akn-bucket", Key: word.url };
      var url : string = s3.getSignedUrl("getObject", params);
			return res.json(url);
		});
	}
};
