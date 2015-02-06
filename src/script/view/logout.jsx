var React = require('react');
var {Parse} = require('../app.ls');
var Router = require('react-router');

var Logout = React.createClass({
  mixins: [ Router.Navigation ],

  componentWillMount: function () {
    Parse.User.logOut();
    this.transitionTo('/');
  },

  render: function () {
    return <p>You are now logged out</p>;
  }
});

module.exports = Logout;
