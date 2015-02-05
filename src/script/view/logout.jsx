var React = require('react');
var {Parse} = require('../app.ls');

var Logout = React.createClass({
  componentDidMount: function () {
    Parse.User.logOut();
  },

  render: function () {
    return <p>You are now logged out</p>;
  }
});

module.exports = Logout;
