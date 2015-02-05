var React = require('react');
var Pure = require('../components/pure.jsx');
var Form = require('../components/form.jsx');
var Session = require('../model/session.ls');

var SessionEditor = React.createClass({

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
    session.set('isPublished', this.refs.isPublished.state.value);
    session.save().then(function() {
      self.props.onSave(session);
    }, function(error) {
      alert('Session cannot be saved!');
    });
  },

  onDelete: function() {
    var self = this;
    var session = this.state.session;

    if (session.isNew())
      self.props.onDelete();
    else
      session.destroy(function() {
        self.props.onDelete();
      }, function(error) {
        alert('Session cannot be deleted!');
      });
  },

  onSubmit: function(event) {
    event.preventDefault();
  },

  render: function() {
    var self = this;
    var session = this.state.session;
    return (
      <Pure u="3-5">
        <h2>Edit Session</h2>
        <button onClick={this.onSave}>Save</button>
        <button onClick={this.onDelete}>Delete</button>
        <Form onSubmit={this.onSubmit}>
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
          <Form.Checkbox u
            tag="isPublished"
            ref="isPublished"
            text="Is published"
            value={session.get('isPublished')} />
        </Form>
      </Pure>
    );
  }

});

module.exports = SessionEditor;
