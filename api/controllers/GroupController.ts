declare var sails: any;

module.exports = {
  create: function(req:any,res:any){
      let _name=req.param('name');
      let _teacher=req.param('teacher');
      return sails.models.group.create({
        name:_name

      })
      .exec(function (err:any, group:any){
        if (err) {
          sails.log.debug("Error creating group");
          sails.log.error(err);
          return res.serverError(err); }
        sails.log.debug("Group created");
        return res.json(200,group);

      });
  },

  getGroups: function(req:any,res:any){
    let _userID=req.param('userID');
    return sails.models.group.find()
            .exec(function (err:any, groups:any){
                  if (err) {
                    sails.log.debug("Error getting groups");
                    sails.log.error(err);
                    return res.serverError(err); }
                  sails.log.debug("Groups found");
                  sails.log.debug(groups)
                  res.json(200,groups);
			             });
  },
  getGroupsLessons: function(req:any,res:any){
    let _groupID=req.param('groupID');
    return sails.models.group.findOne({id:_groupID}).populate("lessons")
            .exec(function (err:any, group:any){
                  if (err) {
                    sails.log.debug("Error getting groups lessons");
                    sails.log.error(err);
                    return res.serverError(err); }
                  sails.log.debug("Lessons found");
                  sails.log.debug(group.lessons)
                  res.json(200,group.lessons);
                   });
  },
  delete: function(req:any,res:any){
    let _groupID = req.param('groupID');
    this.canRemove(_groupID, can=>{
      if(can){
        console.log(_groupID)
        return sails.models.group.destroy({id:_groupID}).exec(function(err:any, group:any){
          sails.log(err)
          console.log(group)
          return res.json(200)
    })
      }

    else
      return res.json(200)
  })

  },
  canRemove: function(_groupID, callback){
    sails.models.groupuser.findOne({groupID:_groupID})
      .exec(function(err,groups){
        if(err) {
            sails.log.debug("no users");
            sails.log.error(err);
        }
      let output=true
      if(groups)
        output=false
      return callback(output);
      })
  }

};
