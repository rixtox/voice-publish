var React = require('react');
var Parse = require('../app.ls').Parse;
var Pure = require('../components/pure.jsx');
var Form = require('../components/form.jsx');
var SessionListView = require('./session-list.jsx');
var SessionItemsView = require('./session-items.jsx');
var Session = require('../model/session.ls');

var DashboardView = React.createClass({

  getInitialState: function() {
    return {};
  },

  logout: function() {
    Parse.User.logOut();
    this.props.loggedOut();
  },

  sessionSelected: function(session) {
    this.setState({
      selectedSession: session,
      nowEditing: 'Session'
    });
  },

  newSession: function(event) {
    var session = new Session;
    session.set('title', '一个标题而已');
    session.set('isPublished', true);
    session.save();
    this.updateSessions();
  },

  articleSelected: function(article) {
    this.setState({
      selectedArticle: article,
      nowEditing: 'Article'
    });
  },

  newArticle: function() {
    
  },

  streetImageSelected: function(streetImage) {
    this.setState({
      selectedStreetImage: streetImage,
      nowEditing: 'StreetImage'
    });
  },

  newStreetImage: function() {
    
  },

  render: function() {
    var self = this;
    var selectedSession = this.state.selectedSession;
    return (
      <Pure>
        <Pure u="1">
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
        <Pure u="3-5">
          <h2>Edit Article</h2>
          <button>Save</button>
          <button>Discard</button>
          <button>Delete</button>
          <Form>
            <Form.Input tag="title" u autoFocus text="Title" />
            <Form.Input tag="author" u text="Author" />
            <Form.Input tag="url" u text="URL" />
            <Form.Input tag="briefImage" u type="file">
              <img src="http://files.parsetfss.com/5070786f-618a-4706-81d7-f1da861a1d4c/tfss-cb65a89e-723f-43de-9130-74c159cb04bc-11-pic-1-1.jpg" />
            </Form.Input>
          </Form>
        </Pure>
      </Pure>
    );
  }

});

module.exports = DashboardView;
