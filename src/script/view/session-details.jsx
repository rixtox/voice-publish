var React = require('react');
var App = require('../app.ls');
var {Parse} = require('parse');
var Router = require('react-router');
var {Session} = require('../models.ls');

var {RouteHandler, Link} = Router;

var SessionDetails = React.createClass({
  mixins: [Router.State, App.Mixin.Auth],

  getInitialState: function() {
    return {
      session: null,
      message: ''
    };
  },

  showMessage: function(message) {
    this.setState({message: (new Date).toLocaleTimeString() + ': ' + message});
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
    var session = this.state.session;
    if (session) {
      return (
        <div className="dashboard">
          <div className="menu">
            <div className="inner">
              <Link className="btn-back fa fa-arrow-circle-o-left" title="Back" to={'/sessions/'}/>
              <h1 className="title">
                {'Session ' + session.get('number')}
                {session.get('isPublished') ? '' : ' (draft)'}
              </h1>
              <Link className="btn-add" to={'/edit/session/' + session.id + '/article/'}>
                <i className="btn-icon fa fa-plus"></i>
                New Article
              </Link>
              <Link className="btn-add" to={'/edit/session/' + session.id + '/photo/'}>
                <i className="btn-icon fa fa-plus"></i>
                New Photos
              </Link>
              <span className="message">{this.state.message}</span>
            </div>
          </div>
          <RouteHandler showMessage={this.showMessage}/>
        </div>
      );
    } else return null;
  }

});

SessionDetails.Articles = require('./article-list.jsx');
SessionDetails.Photos = require('./photo-list.jsx');

module.exports = SessionDetails;
