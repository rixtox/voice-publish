var React = require('react');
var App = require('../app.ls');
var Router = require('react-router');
var Pure = require('../components/pure.jsx');
var Session = require('../model/session.ls');

var {Parse} = App;
var {RouteHandler} = Router;

var SessionDetails = React.createClass({
  mixins: [Router.State, App.Mixin.Auth],

  getInitialState: function() {
    return {
      session: null
    };
  },

  updateSession: function() {
    var sessionId = this.getParams().sessionId;
    var query = new Parse.Query(Session);
    query.equalTo('objectId', sessionId);
    query.find().then(function(sessions) {
      this.setState({session: sessions[0]});
    }.bind(this));
  },

  componentDidMount: function() {
    this.updateSession();
  },

  componentWillReceiveProps: function() {
    this.updateSession();
  },

  render: function() {
    var self = this;
    var session = self.state.session;
    if (session) {
      return (
        <Pure u="1-5">
          <h2>
            {'Session ' + session.get('number')}
            {session.get('isPublished') ? '' : ' (draft)'}
          </h2>
          <RouteHandler/>
        </Pure>
      );
    } else {
      return null;
    }
  }

});

module.exports = SessionDetails;
