 import * as async from "async";
 declare var sails: any;

module.exports = {

	addUserToGroup: function(req,res){
		let _groupID=req.param('groupID'),
				_userID=req.param('userID');
				return sails.models.groupuser.create({
					groupID: _groupID,
					userID: _userID

				})
				.exec(function (error, pair){
					if (error)  {
            sails.log.debug("Error adding user to group");
            sails.log.error(error);
            return res.negotiate(error);}
          sails.log("User added to group");
					return res.json(pair);
				});

	},
	removeUserFromGroup: function(req,res){
		let _groupID=req.param('groupID'),
				_userID=req.param('userID');
				return sails.models.groupuser.destroy({
					groupID: _groupID,
					userID: _userID

				})
				.exec(function (error, deleted){
					if (error)  {
            sails.log.debug("Error removing user form group");
            sails.log.error(error);
            return res.negotiate(error);}
					return res.json(deleted);
				});

	},
  getGroupsUsersMergeName:function(req,res){
    let _groupID=req.param('groupID');

    this.getUsersID(_groupID,UsersID=>{
        var output=[];
        async.each(UsersID, function (userID, cb) {
          sails.models.user.findOne({id: userID})
            .then(function(user){
              var elem={id:user.id, name: user.first_name+" "+user.last_name, role: user.role};
              //elem={id:<string>user.id,first_name: <string>user.first_name, last_name: <string>user.last_name, role: <string>user.role};
              output.push(elem);
              //inside the iterator function we call cb() once we are finished
              cb();
            })
            .fail(function(error){
              sails.log.debug("Error in getGroupsUsers");
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
	getGroupsUsers:function(req,res){
	  let _groupID=req.param('groupID');

	  this.getUsersID(_groupID,UsersID=>{
	      var output:user[];
	      output=[];
	      async.each(UsersID, function (userID, cb) {
	        sails.models.user.findOne({id: userID})
	          .then(function(user){
	            var elem:user;
	            //elem={id:<string>user.id,first_name: <string>user.first_name, last_name: <string>user.last_name, role: <string>user.role};
	            output.push(user);
	            //inside the iterator function we call cb() once we are finished
	            cb();
	          })
	          .fail(function(error){
	            sails.log.debug("Error in getGroupsUsers");
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
	getUsersID:function(_groupID,callback){

	  sails.models.groupuser.find({groupID:_groupID})
	    .exec(function(err,Users){
	      if(err) {
            sails.log.debug("Error getting users id");
            sails.log.error(err);
        }
	      var output:string[];
	      output=[];
	      for(var i=0;i<Users.length;i++){
	        output[i]=Users[i].userID;
	      }
	      return callback(output);
	    })
	},
  getMyGroups: function(req,res){
  	 let _userID=req.param('userID');

    this.getGroupsID(_userID,GroupsID=>{
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
	            sails.log.debug("Error in getMyGroups");
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
  getGroupsID:function(_userID,callback){
	  sails.models.groupuser.find({userID:_userID})
	    .exec(function(err,Groups){
	      if(err) {
            sails.log.debug("Error in getGroupsID");
            sails.log.error(err);
        }
	      var output:string[];
	      output=[];
	      for(var i=0;i<Groups.length;i++){
	        output[i]=Groups[i].groupID;
	      }
	      return callback(output);
	    })
	},
}

interface user{
	id: string,
	role: string,
	first_name: string,
	last_name:string,
}
interface group{
  id:string,
  name: string
}
