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
  }
};
