var React = require('react');
var {Parse} = require('parse');
var Router = require('react-router');
var Session = require('../model/session.ls');

var {Link} = Router;

var SessionEditor = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function() {
    return {
      session: new Session
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
      error: function(error) {
        alert('Session cannot be saved!');
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
        alert('Session cannot be deleted!');
      });
  },

  onSubmit: function(event) {
    event.preventDefault();
  },

  onChange: function(event) {
    var {session} = this.state;
    var {target} = event;
    if (target.type == 'text') {
      session.set(event.target.id, event.target.value);
    } else if (target.type == 'checkbox') {
      session.set(event.target.id, event.target.checked);
    } else if (target.type == 'number') {
      session.set(event.target.id, parseInt(event.target.value));
    }
    this.forceUpdate();
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
          </div>
        </div>
        <div className="inner wrap">
          <form onSubmit={this.onSubmit} onChange={this.onChange}>
            <div className="input-group">
              <label className="label" htmlFor="title">Title</label>
              <input
                id="title"
                className="input"
                autoFocus
                placeholder="Title"
                value={session.get('title')} />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="who">Character</label>
              <input
                id="who"
                className="input"
                placeholder="Character"
                value={session.get('who')} />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="photoBy">Photo by</label>
              <input
                id="photoBy"
                className="input"
                placeholder="Photo by"
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
