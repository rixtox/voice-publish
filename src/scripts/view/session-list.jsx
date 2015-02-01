var React = require('react');
var Parse = require('../app.ls').Parse;
var Pure = require('../components/pure.jsx');
var Session = require('../model/session.ls');

var SessionItemView = React.createClass({

  selected: function() {
    this.props.onSelected(this.props.session);
  },

  render: function() {
    return (
      <li>
        <a href="#" onClick={this.selected}>
          {this.props.session.get('title')}
          {this.props.session.get('isPublished') ? '' : ' (draft)'}
        </a>
      </li>
    );
  }

});

var SessionListView = React.createClass({

  getInitialState: function() {
    return {
      sessions: []
    };
  },

  updateSessions: function() {
    var query = new Parse.Query(Session);
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

  selected: function(session) {
    this.props.onSelected(session);
  },

  render: function() {
    self = this;
    return (
      <Pure u="1-5">
        <h2>Sessions</h2>
        <button onClick={this.props.newSession}>New Session</button>
        <ul>
          {this.state.sessions.map(function(session) {
            return (
              <SessionItemView
                key={session.id}
                session={session}
                onSelected={self.selected} />
            );
          })}
        </ul>
      </Pure>
    );
  }

});

module.exports = SessionListView;