var React = require('react');
var App = require('../app.ls');
var Router = require('react-router');
var Pure = require('../components/pure.jsx');

var {Link, RouteHandler} = Router;

var AppView = React.createClass({

  render: function() {
    var navAccount = App.Mixin.Auth.getUser()
    ? ([
      <li>{App.Mixin.Auth.getUser().getUsername()}</li>,
      <li>
        <Link to="/logout">Logout</Link>
      </li>
    ]) : ([
      <li>
        <Link to="/login">Login</Link>
      </li>
    ]);
    
    return (
      <div className="container">
        <div className="nav-main">
          <div className="wrap">
            <Link className="nav-home" to="/">
              <div className="nav-logo"/>
            </Link>
            <ul className="nav-account">
              {navAccount}
            </ul>
          </div>
        </div>
        <section className="content">
          <RouteHandler/>
        </section>
        <footer></footer>
      </div>
    );
  }

});

module.exports = AppView;
