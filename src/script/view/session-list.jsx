var React = require('react');
var App = require('../app.ls');
var Router = require('react-router');
var Pure = require('../components/pure.jsx');
var Session = require('../model/session.ls');

var {Parse, Mixin} = App,
    {Link, RouteHandler} = Router;

var SessionItem = React.createClass({

  render: function() {
    return (
      <li>
        <Link to={'/session/' + this.props.session.id + '/'}>
          {'[' + this.props.session.get('number') + '] '}
          {this.props.session.get('title')}
          {this.props.session.get('isPublished') ? '' : ' (draft)'}
        </Link>
      </li>
    );
  }

});

var SessionList = React.createClass({
  mixins: [ Mixin.Auth ],

  getInitialState: function() {
    return {
      sessions: []
    };
  },

  updateSessions: function() {
    var query = new Parse.Query(Session);
    query.ascending('number');
    query.find().then(function(sessions) {
      this.setState({sessions: sessions});
    }.bind(this));
  },

  componentDidMount: function() {
    this.updateSessions();
  },

  componentWillReceiveProps: function() {
    this.updateSessions();
  },

  render: function() {
    self = this;
    return (
      <Pure u="1-5">
        <h2>Sessions</h2>
        <Link to="/edit/session">New Session</Link>
        <ul>
          {this.state.sessions.map(function(session) {
            return (
              <SessionItem
                key={session.id}
                session={session} />
            );
          })}
        </ul>
      </Pure>
    );
  }

});

module.exports = SessionList;
