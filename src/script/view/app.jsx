var React = require('react');
var {Mixin} = require('../app.ls');
var Router = require('react-router');

var {Link, RouteHandler} = Router;

var AppView = React.createClass({

  render: function() {
    var navAccount = Mixin.Auth.getUser()
    ? (
      <li>
        <Link to="/logout">Logout</Link>
      </li>
    ) : null;
    
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
