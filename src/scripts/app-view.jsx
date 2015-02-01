var App = require('./app.ls');
var React = require('react');
var LoginView = require('./login-view.jsx');
var DashboardView = require('./dashboard-view.jsx');

var Parse = App.Parse;

var AppView = React.createClass({

  getInitialState: function() {
    return {user: Parse.User.current()};
  },

  userStateChanged: function() {
    this.setState({user: Parse.User.current()});
  },

  render: function () {
    return (
      <div className="content-wrapper">
        <h1>VOICE Publish</h1>
        {
          this.state.user
          ? <DashboardView loggedOut={this.userStateChanged}/>
          : <LoginView loggedIn={this.userStateChanged} />
        }
      </div>
    );
  }

});

module.exports = AppView;
