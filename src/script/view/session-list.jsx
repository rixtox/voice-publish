var React = require('react');
var App = require('../app.ls');
var Router = require('react-router');
var Session = require('../model/session.ls');
var Article = require('../model/article.ls');

var {Parse, Mixin, Config} = App,
    {Link, RouteHandler} = Router;

var SessionItem = React.createClass({

  onDelete: function() {
    this.props.onDelete(this.props.session);
  },

  render: function() {
    if (this.props.article)
      var imgFile = this.props.article.get('briefImage');
    var imgUrl = imgFile ? imgFile.url() : '';
    var {session} = this.props;

    return (
      <div
        className="item"
        style={{backgroundImage: 'url(' + imgUrl + ')'}}>
        <Link
          className="link"
          title="Details"
          to={'/session/' + session.id + '/'}/>
        <div className="title">
          {'Session ' + session.get('number')}
          {session.get('isPublished') ? '' : ' (draft)'}
        </div>
        <div className="controls">
          <a
            className="control-btn fa fa-trash-o"
            title="Delete"
            href="javascript:"
            onClick={this.onDelete}/>
          <Link
            className="control-btn fa fa-pencil"
            title="Edit"
            to={'/edit/session/' + session.id}/>
        </div>
      </div>
    );
  }

});

var SessionList = React.createClass({
  mixins: [ Mixin.Auth ],

  getInitialState: function() {
    return {
      sessions: [],
      articles: {},
      message: ''
    };
  },

  updateSessions: function() {
    var self = this;
    var query = new Parse.Query(Session);
    query.descending('number');
    query.find().then(function(sessions) {
      sessions.map(function(session) {
        var query = new Parse.Query(Article);
        query.equalTo('belongTo', session);
        query.descending("createdAt");
        query.first({
          success: function(article) {
            var articles = self.state.articles;
            articles[session.id] = article;
            self.setState({articles: articles});
          }
        });
      });
      self.setState({sessions: sessions});
    });
  },

  showMessage: function(message) {
    this.setState({message: (new Date).toLocaleTimeString() + ': ' + message});
  },

  onDelete: function(session) {
    var self = this;

    session.destroy(function() {
      self.updateSessions();
    }, function(error) {
      self.showMessage('Session cannot be deleted!');
    });
  },

  componentDidMount: function() {
    this.updateSessions();
  },

  componentWillReceiveProps: function() {
    this.updateSessions();
  },

  render: function() {
    var self = this;
    var sessions = this.state.sessions;
    var articles = this.state.articles;
    return (
      <div className="dashboard">
        <div className="menu">
          <div className="inner">
            <h1 className="title">Sessions</h1>
            <Link className="btn-add" to="/edit/session/">
              <i className="btn-icon fa fa-plus"></i>
              Add
            </Link>
            <span className="message">{this.state.message}</span>
          </div>
        </div>
        <div className="inner wrap">
          {sessions.map(function(session) {
            return (
              <SessionItem
                key={session.id}
                session={session}
                article={articles[session.id]}
                onDelete={self.onDelete}/>
            );
          })}
        </div>
      </div>
    );
  }

});

module.exports = SessionList;
