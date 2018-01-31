 import { Model } from 'Sails';
 import * as async from "async";
 declare var sails: any;
module.exports = {
		addGroupToLesson: function(req,res){
			let _groupID=req.param('groupID'),
					_lessonID=req.param('lessonID');
					return sails.models.grouplesson.create({
						groupID: _groupID,
						lessonID: _lessonID

					})
					.exec(function (error, pair){
						if (error)  return res.negotiate(error);
						return res.json(pair);
					});

		},
		removeGroupFromLesson: function(req,res){
			let _groupID=req.param('groupID'),
					_lessonID=req.param('lessonID');
					return sails.models.grouplesson.destroy({
						groupID: _groupID,
						lessonID: _lessonID

					})
					.exec(function (error, deleted){
						if (error)  return res.negotiate(error);
						return res.json(deleted);
					});

		},
		getLessonsGroups:function(req,res){
		  let _lessonID=req.param('lessonID');

		  this.getGroupsID(_lessonID,GroupsID=>{
		      var output:group[];
		      output=[];
		      async.each(GroupsID, function (groupID, cb) {
		        sails.models.group.findOne({id: groupID})
		          .then(function(group){
		            var elem:group;
		            elem={id:<string>group.id,name: <string>group.name};
		            output.push(elem);
		            //inside the iterator function we call cb() once we are finished
		            cb();
		          })
		          .fail(function(error){
		            //you can pass an error...
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
		getGroupsID:function(_lessonID,callback){
		  sails.models.grouplesson.find({lessonID:_lessonID})
		    .exec(function(err,Groups){
		      if(err) console.log(err);
		      var output:string[];
		      output=[];
		      for(var i=0;i<Groups.length;i++){
		        output[i]=Groups[i].groupID;
		      }
		      return callback(output);
		    })
		},

    getGroupsLessons:function(req,res){
		  let _groupID=req.param("groupID");
		  this.getLessonsID(_groupID,LessonsID=>{
		      var output:lesson[];
		      output=[];
		      async.each(LessonsID, function (lessonID, cb) {
		        sails.models.lesson.findOne({id: lessonID})
		          .then(function(lesson){
                if(lesson){
                    var elem:lesson;
		                elem={id:<string>lesson.id,subject: <string>lesson.subject, date: <Date>lesson.date, teacherID: <string>lesson.teacherID};
		                output.push(elem);}

		            //inside the iterator function we call cb() once we are finished

                cb();
		          })
		          .fail(function(error){
		            //you can pass an error...
		            cb(error);
		          })
		      }, function(error){
		        //... and handle it in the final callback
		        if(error) res.negotiate(error);
            else
		        //here we can return our finished use
		        return res.json(output);
		});
		  })


		},
    getLessonsID:function(_groupID,callback){
		  sails.models.grouplesson.find({groupID:_groupID})
		    .exec(function(err,Lessons){
		      if(err) console.log(err);
		      var output:string[];
		      output=[];
		      for(var i=0;i<Lessons.length;i++){
		        output[i]=Lessons[i].lessonID;
		      }
		      return callback(output);
		    })
		}

};
interface group{
	id: string,
	name: string;
}
interface lesson{
  id:string,
  teacherID: string,
  date: Date,
  subject: string
}
