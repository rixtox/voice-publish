var React = require('react');
var App = require('./app.ls');
var Form = require('./components/form.jsx');

var Parse = App.Parse;

var LoginView = React.createClass({

  login: function(event) {
    event.preventDefault();
    self = this;
    var user = self.refs.user.state.value;
    var pass = self.refs.pass.state.value;
    Parse.User.logIn(user, pass, {
      success: function(user) {
        self.props.loggedIn();
      },
      error: function(user, error) {
        alert('Login failed!');
      }
    });
  },

  render: function () {
    return (
      <Form aligned onSubmit={this.login}>
        <Form.Input ref="user" tag="username" autoFocus label text="Username" />
        <Form.Input ref="pass" tag="password" password  label text="Password" />
        <Form.Button text="Login" />
      </Form>
    );
  }

});

module.exports = LoginView;