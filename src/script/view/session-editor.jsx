var React = require('react');
var {Parse} = require('parse');
var Router = require('react-router');
var Session = require('../model/session.ls');

var {Link} = Router;

var SessionEditor = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function() {
    return {
      session: new Session,
      message: ''
    };
  },

  updateSession: function() {
    var self = this;
    self.setState({session: new Session});
    var {sessionId} = self.getParams();
    if (sessionId) {
      var query = new Parse.Query(Session);
      query.equalTo('objectId', sessionId);
      query.first({
        success: function(session) {
          self.setState({session: session});
        }
      });
    }
  },

  showMessage: function(message) {
    this.setState({message: (new Date).toLocaleTimeString() + ': ' + message});
  },

  componentDidMount: function() {
    this.updateSession();
  },

  componentWillReceiveProps: function() {
    this.updateSession();
  },

  onSave: function() {
    var self = this;
    var session = this.state.session;

    session.save({
      success: function() {
        self.showMessage('Session saved.');
      },
      error: function(error) {
        self.showMessage('Session cannot be saved!');
      }
    });
  },

  onDelete: function() {
    var self = this;
    var {session} = this.state;

    if (!session.isNew())
      session.destroy(function() {
        self.transitionTo('/');
      }, function(error) {
        self.showMessage('Session cannot be deleted!');
      });
  },

  onSubmit: function(event) {
    event.preventDefault();
  },

  onChange: function(event) {
    var self = this;
    var {session} = self.state;
    var {target} = event;
    switch (target.type) {
      case 'text':
      case 'url':
      case 'password':
        session.set(target.id, target.value);
        break;
      case 'checkbox':
        session.set(target.id, target.checked);
        break;
      case 'number':
        session.set(target.id, parseInt(target.value));
        break;
      case 'file':
        if (target.files.length) {
          var file = new Parse.File(
            target.value.split('/')
            .pop().split('\\').pop(),
            target.files[0]);
          file.save().then(function() {
            session.set(target.id, file);
            self.forceUpdate();
          }, function(error) {
            self.showMessage('File cannot be uploaded!');
          });
        }
    }
    self.forceUpdate();
  },

  render: function() {
    var self = this;
    var {session} = this.state;
    return (
      <div key={session.isNew() ? 'new-session' : session.id} className="dashboard">
        <div className="menu">
          <div className="inner">
            <Link
              title="Back"
              className="btn-back fa fa-arrow-circle-o-left"
              to="/sessions"/>
            <h1 className="title">Edit Session</h1>
            <a className="btn-add" href="javascript:" onClick={this.onSave}>
              <i className="btn-icon fa fa-check"></i>
              Save
            </a>
            <a className="btn-add" href="javascript:" onClick={this.onDelete}>
              <i className="btn-icon fa fa-trash-o"></i>
              Delete
            </a>
            <span className="message">{this.state.message}</span>
          </div>
        </div>
        <div className="inner wrap">
          <form onSubmit={this.onSubmit}>
            <div className="input-group">
              <label className="label" htmlFor="title">Title</label>
              <input
                id="title"
                className="input"
                autoFocus
                placeholder="Title"
                onChange={this.onChange}
                value={session.get('title')} />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="who">Character</label>
              <input
                id="who"
                className="input"
                placeholder="Character"
                onChange={this.onChange}
                value={session.get('who')} />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="photoBy">Photo by</label>
              <input
                id="photoBy"
                className="input"
                placeholder="Photo by"
                onChange={this.onChange}
                value={session.get('photoBy')} />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="number">Index number</label>
              <input
                id="number"
                className="input"
                type="number"
                min="1"
                step="1"
                placeholder="Index number"
                onChange={this.onChange}
                value={session.get('number')} />
            </div>
            <div className="input-group">
              <div className="label"></div>
              <label
                htmlFor="isPublished"
                className="input">
                <input
                  id="isPublished"
                  type="checkbox"
                  onChange={this.onChange}
                  checked={session.get('isPublished')} />
                Is published
              </label>
            </div>
          </form>
        </div>
      </div>
    );
  }

});

module.exports = SessionEditor;
