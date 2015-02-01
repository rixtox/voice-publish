var React = require('react');
var Parse = require('../app.ls').Parse;
var Pure = require('../components/pure.jsx');
var Form = require('../components/form.jsx');
var SessionListView = require('./session-list.jsx');
var SessionItemsView = require('./session-items.jsx');
var ArticleEditorView = require('./article-editor.jsx');
var SessionEditorView = require('./session-editor.jsx');
var StreetImageEditorView = require('./street-image-editor.jsx');
var Session = require('../model/session.ls');

var DashboardView = React.createClass({

  getInitialState: function() {
    return {};
  },

  logout: function() {
    Parse.User.logOut();
    this.props.loggedOut();
  },

  articleSelected: function(article) {
    this.setState({
      selectedArticle: article,
      nowEditing: 'Article'
    });
  },

  newArticle: function() {
    this.setState({
      selectedArticle: null,
      nowEditing: 'Article'
    });
  },

  articleSaved: function(article) {
    this.setState({
      selectedArticle: article,
    });
  },

  articleDeleted: function() {
    this.setState({
      selectedArticle: null,
      nowEditing: null
    });
  },

  sessionSelected: function(session) {
    this.setState({
      selectedSession: session,
      nowEditing: 'Session'
    });
  },

  newSession: function() {
    this.setState({
      selectedSession: null,
      nowEditing: 'Session'
    });
  },

  sessionSaved: function(session) {
    this.setState({
      selectedSession: session,
    });
  },

  sessionDeleted: function(session) {
    this.setState({
      selectedSession: null,
      nowEditing: null
    });
  },

  streetImageSelected: function(streetImage) {
    this.setState({
      selectedStreetImage: streetImage,
      nowEditing: 'StreetImage'
    });
  },

  newStreetImage: function() {
    this.setState({
      selectedStreetImage: null,
      nowEditing: 'StreetImage'
    });
  },

  streetImageSaved: function(streetImage) {
    this.setState({
      selectedStreetImage: streetImage,
    });
  },

  streetImageDeleted: function() {
    this.setState({
      selectedStreetImage: null,
      nowEditing: null
    });
  },

  render: function() {
    var self = this;
    var selectedArticle = this.state.selectedArticle;
    var selectedSession = this.state.selectedSession;
    var selectedStreetImage = this.state.selectedStreetImage;
    var EditorView = null;
    switch(self.state.nowEditing) {
      case 'Article':
        EditorView = <ArticleEditorView
          key={selectedArticle ? selectedArticle.id : 'newArticle'}
          article={selectedArticle}
          session={selectedSession}
          onSave={self.articleSaved}
          onDelete={self.articleDeleted} />;
        break;
      case 'Session':
        EditorView = <SessionEditorView
          key={selectedSession ? selectedSession.id : 'newSession'}
          session={selectedSession}
          onSave={self.sessionSaved}
          onDelete={self.sessionDeleted} />;
        break;
      case 'StreetImage':
        EditorView = <StreetImageEditorView
          key={selectedStreetImage ? selectedStreetImage.id : 'newStreetImage'}
          streetImage={selectedStreetImage}
          session={selectedSession}
          onSave={self.streetImageSaved}
          onDelete={self.streetImageDeleted} />;
        break;
    }
    return (
      <Pure>
        <Pure u="1">
          <p>Welcome, {this.props.user.getUsername()}</p>
          <button onClick={this.logout}>Logout</button>
        </Pure>
        <SessionListView
          onSelected={this.sessionSelected}
          newSession={this.newSession} />
        <SessionItemsView
          session={selectedSession}
          onArticleSelect={this.articleSelected}
          onNewArticle={this.newArticle}
          onStreetImageSelect={this.streetImageSelected}
          onNewStreetImage={this.newStreetImage} />
        {EditorView}
      </Pure>
    );
  }

});

module.exports = DashboardView;
