var React = require('react');
var Pure = require('../components/pure.jsx');
var Form = require('../components/form.jsx');
var Session = require('../model/session.ls');

var SessionEditorView = React.createClass({

  getInitialState: function() {
    return {
      session: this.props.session || new Session
    };
  },

  onSave: function() {
    var self = this;
    var session = this.state.session;

    session.set('title', this.refs.title.state.value);
    session.set('who', this.refs.who.state.value);
    session.set('photoBy', this.refs.photoBy.state.value);
    session.set('number', parseInt(this.refs.number.state.value));
    session.save().then(function() {
      self.props.onSave(session);
    }, function(error) {
      alert('Session cannot be saved!');
    });
  },

  togglePublish: function() {
    var self = this;
    var session = this.state.session;

    session.set('isPublished', !session.get('isPublished'));
    session.save().then(function() {
      self.props.onSave(session);
    }, function(error) {
      alert('Session publish state cannot be changed!');
    });
  },

  onDelete: function() {
    var self = this;
    var session = this.state.session;

    session.destroy(function() {
      self.props.onDelete();
    }, function(error) {
      alert('Session cannot be deleted!');
    });
  },

  render: function() {
    var self = this;
    var session = this.state.session;
    return (
      <Pure u="3-5">
        <h2>Edit Session</h2>
        <button onClick={this.onSave}>Save</button>
        {
          session.get('isPublished')
          ? <button onClick={this.togglePublish}>Unpublish</button>
          : <button onClick={this.togglePublish}>Publish</button>
        }
        <button onClick={this.onDelete}>Delete</button>
        <Form>
          <Form.Input u
            tag="title"
            ref="title"
            autoFocus
            text="Title"
            value={session.get('title')} />
          <Form.Input u
            tag="who"
            ref="who"
            text="Character"
          value={session.get('who')} />
          <Form.Input u
            tag="photoBy"
            ref="photoBy"
            text="Photo by"
            value={session.get('photoBy')} />
          <Form.Input u
            tag="number"
            ref="number"
            text="Index number"
            value={session.get('number')} />
        </Form>
      </Pure>
    );
  }

});

module.exports = SessionEditorView;