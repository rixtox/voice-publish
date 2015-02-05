var React = require('react');
var {Parse} = require('../app.ls');
var Router = require('react-router');

var Link = Router.Link,
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    RouteHandler = Router.RouteHandler;

var Login = React.createClass({
  mixins: [ Router.Navigation ],

  statics: {
    attemptedTransition: null
  },

  getInitialState: function() {
    return {
      error: false
    };
  },

  login: function(event) {
    event.preventDefault();
    self = this;
    var user = self.refs.user.state.value;
    var pass = self.refs.pass.state.value;
    Parse.User.logIn(user, pass, {
      success: function(user) {
        if (Login.attemptedTransition) {
          var transition = Login.attemptedTransition;
          Login.attemptedTransition = null;
          transition.retry();
        } else {
          self.replaceWith('/');
        }
      },
      error: function(user, error) {
        self.setState({error});
      }
    });
  },

  render: function () {
    if (this.state.error) {
      var errorMessage = (
        <div className="error-message">
          {"Error: " + this.state.error.code + " " + this.state.error.message}
        </div>
      );
    } else
      var errorMessage = '';
    return (
      <div className="login">
        <div className="banner">
          <div className="inner wrap">
            <div className="login-frame">
              <h2>Login</h2>
              <form onSubmit={this.login}>
                <div className="login-input-panel">
                  <div className="login-input">
                    <i className="icon-login fa fa-user"></i>
                    <input ref="user" type="text" placeholder="Username" autoFocus/>
                  </div>
                  <div className="login-input">
                    <i className="icon-login fa fa-lock"></i>
                    <input ref="pass" type="password" placeholder="Password"/>
                  </div>
                </div>
                <div className="login-btn-panel">
                  <a className="btn-login" href="javascript:">Login</a>
                </div>
                {errorMessage}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Login;
