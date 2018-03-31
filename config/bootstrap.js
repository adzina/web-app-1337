
module.exports.bootstrap = function (done) {

  // Don't seed fake data when running in production.
  if (process.env.NODE_ENV === 'production') {
    return done();
  }

  User.find()
  .exec(function (err, existingUsers) {
    if (err) { return done(err); }

    if (existingUsers.length >= 1) {
      console.log("all ok");
      return done();
    }


    console.log("creating admin");
    User.create({"first_name": "admin",
     "last_name": "admin",
     "password":"admin",
      "email": "admin@akn.com",
       "role": ["admin"]}).exec(function (err){
      if (err) { return done(err); }

      return done();

    });
  });

};
