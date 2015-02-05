var {Parse} = require('parse');
var LoginView = require('../view/login.jsx');

var Auth = {
  getUser: function() {
    return Parse.User.current();
  },

  statics: {
    willTransitionTo: function (transition) {
      if (!Parse.User.current()) {
        LoginView.attemptedTransition = transition;
        transition.redirect('/login');
}}}};

module.exports = Auth;
