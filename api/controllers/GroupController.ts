declare var sails: any;

module.exports = {
  create: function(req:any,res:any){
      let _name=req.param('name');

      return sails.models.group.create({
        name:_name

      })
      .exec(function (err:any, group:any){
        if (err) { return res.serverError(err); }

        return res.ok();
      });
  },

  getGroups: function(req:any,res:any){
    let _userID=req.param('userID');
    return sails.models.group.find()
            .exec(function (err:any, groups:any){
                  if (err) { return res.serverError(err); }
                      res.json(200,groups);
			             });
  }
};
