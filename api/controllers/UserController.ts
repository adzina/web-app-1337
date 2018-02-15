/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

import { Model } from 'Sails';

declare var sails: any;

import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

module.exports = {

  getAll: function(req, res) {
    sails.models.user.find()
      .exec(function callback(err, users) {
        var output: user[];
        output = [];
        for (var i = 0; i < users.length; i++) {
          output[i] = {
            id: users[i].id,
            first_name: users[i].first_name,
            last_name: users[i].last_name,
            role: users[i].role
          };
        }
        res.json(200, output);
      })
  },
  findByID: function(req, res) {
    var id = req.param('id');
    sails.models.user.findOne({
      id: id
    }).exec(function callback(err, user) {
      if (err) return res.serverError(err);


      res.json(200, {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      });

    });
  },
  login: function(req, res) {
    /**
     * check if the username matches any email
     */
    sails.models.user.findOne({
      email: req.body.email
    }).exec(function callback(err, user) {
      if (err) return res.serverError(err);
      if (!user) return res.serverError("User not found, please sign up.");


      //check password
      bcrypt.compare(req.body.pswd, user.password, function(error, matched) {
        if (error) return res.serverError(error);

        if (!matched) return res.serverError("Invalid password.");

        //save the date the token was generated for already inside toJSON()

        var token = jwt.sign(user.toJSON(), "this is my secret key", {
          expiresIn: '90m'
        });

        //return the token here
        res.json(200, { id_token: token, id: user.id, role: user.role, first_name: user.first_name });
      });

    });
  },
  create: function(req, res) {
    let _first_name = req.param('first_name'),
      _last_name = req.param('last_name'),
      _email = req.param('email'),
      _password = req.param('password'),
      _role = req.param('role');

    if (!_first_name) return res.badRequest({ err: 'Invalid first name' });
    if (!_last_name) return res.badRequest({ err: 'Invalid last name' });
    if (!_role) return res.badRequest({ err: 'Invalid role' });
    if (!_email) return res.badRequest({ err: 'Invalid email' });
    if (!_password) return res.badRequest({ err: 'Invalid password' });

    return sails.models.user.create({
      first_name: _first_name,
      last_name: _last_name,
      email: _email,
      password: _password,
      role: _role
    })
      .exec(function(err, user) {
        if (err) { return res.serverError(err); }

        return res.ok();
      });
  },
  adminChangePassword: function(req,res){
    let _email = req.param('email'),
        _new_password = req.param('new_password');

      sails.models.user.findOne({
        email: _email
      }).exec(function callback(err, user) {
        if (err) return res.serverError(err);
        if (!user) return res.serverError("Invalid email");

        var data={first_name: user.first_name,
                  last_name: user.last_name,
                  password: _new_password,
                  role: user.role};
        sails.models.user.update({ email:user.email },data,function(err,updated){
            if (err) return res.serverError(err);
            return res.json(200);
        })

      });
  },
  changeMyPassword: function(req,res){
    let _id = req.param('id'),
        _old_password = req.param('old_password'),
        _new_password = req.param('new_password');

      sails.models.user.findOne({
        id: _id
      }).exec(function callback(err, user) {
        if (err) return res.serverError(err);
        if (!user) return res.serverError("Invalid email");


        //check password
        bcrypt.compare(_old_password, user.password, function(error, matched) {
          if (error) return res.serverError(error);

          if (!matched) return res.serverError("Invalid password");

          else{

            var data={first_name: user.first_name,
                      last_name: user.last_name,
                      email: user.email,
                      password: _new_password,
                      role: user.role};
            sails.models.user.update({ email:user.email },data,function(err,updated){
                      if (err) return res.serverError(err);
                      return res.json(200);
            })
          }
        });

      });
  }
};

interface user {
  id: string,
  first_name: string,
  last_name: string,
  role: string
}
