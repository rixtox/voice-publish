var App = require('./app.ls');
var React = require('react');
var LoginView = require('./login-view.jsx');
var DashboardView = require('./dashboard-view.jsx');

var Parse = App.Parse;

var AppView = React.createClass({

  render: function () {
    return (
      <div className="content-wrapper">
        <h1>VOICE Publish</h1>
        {
          !Parse.User.current()
          ? <DashboardView />
          : <LoginView />
        }
      </div>
    );
  }

});

module.exports = AppView;
