var React = require('react');
var Router = require('react-router');
var {Parse} = require('../app.ls');

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

  componentWillMount: function () {
    if (Parse.User.current())
      this.transitionTo('/');
  },

  login: function(event) {
    event.preventDefault();
    self = this;
    var user = self.refs.user.getDOMNode().value;
    var pass = self.refs.pass.getDOMNode().value;
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
    var errorMessage = this.state.error
    ? (
      <div className="login-err-panel">
        <i className="login-icon fa fa-exclamation-circle"></i>
        <span>Invalid login credentials.</span>
      </div>
    )
    : null;

    return (
      <div className="login">
        <div className="banner">
          <div className="inner wrap">
            <div className="login-frame">
              <h2>Login</h2>
              <form onSubmit={this.login}>
                {errorMessage}
                <div className="login-input-panel">
                  <div className="login-input">
                    <i className="login-icon fa fa-user"></i>
                    <input ref="user" type="text" placeholder="Username" autoFocus/>
                  </div>
                  <div className="login-input">
                    <i className="login-icon fa fa-lock"></i>
                    <input ref="pass" type="password" placeholder="Password"/>
                  </div>
                </div>
                <div className="login-btn-panel">
                  <input type="submit" className="login-btn" href="javascript:" onClick={this.login} value="Login"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = Login;
