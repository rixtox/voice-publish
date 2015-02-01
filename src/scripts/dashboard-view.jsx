var React = require('react');
var Parse = require('./app.ls').Parse;
var Pure = require('./components/pure.jsx');
var Form = require('./components/form.jsx');
var Session = require('./model/session.ls');

var DashboardView = React.createClass({

  getInitialState: function() {
    return {
      sessions: []
    };
  },

  componentDidMount: function() {
    var query = new Parse.Query(Session);
    query.find().then(function(sessions) {
      this.setState({sessions: sessions});
    }.bind(this));
  },

  newSession: function(event) {
    var session = new Session;
    session.set('title', '一个标题而已');
    session.set('isPublished', true);
    session.save();
  },

  logout: function() {
    Parse.User.logOut();
    this.props.loggedOut();
  },

  render: function() {
    return (
      <Pure>
        <Pure u="1">
          <button onClick={this.logout}>Logout</button>
        </Pure>
        <Pure u="1-5">
          <h2>Sessions</h2>
          <button onClick={this.newSession}>New Session</button>
          <ul>
            {this.state.sessions.map(function(session) {
              return <li>
                <a href="#">
                  {session.get('title')}
                  {session.get('isPublished') ? '' : ' (draft)'}
                </a>
              </li>;
            })}
          </ul>
        </Pure>
        <Pure u="1-5">
          <h2>第四期 (draft)</h2>
          <button>Publish</button>
          <button>Delete</button>
          <h2>Articles</h2>
          <button>New Article</button>
          <ul>
            <li><a href="#">文章一</a></li>
            <li><a href="#">文章二</a></li>
            <li><a href="#">文章三</a></li>
            <li><a href="#">文章四</a></li>
          </ul>
          <h2>Street Images</h2>
          <button>New bundle</button>
          <ul>
            <li><a href="#">街拍一</a></li>
            <li><a href="#">街拍二</a></li>
            <li><a href="#">街拍三</a></li>
            <li><a href="#">街拍四</a></li>
          </ul>
        </Pure>
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
