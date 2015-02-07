var React = require('react');
var {Mixin} = require('../app.ls');
var Router = require('react-router');

var {RouteHandler} = Router;

var Editor = React.createClass({
  mixins: [ Mixin.Auth ],

  render: function() {
    return (
      <RouteHandler/>
    );
  }

});

Editor.Session = require('./session-editor.jsx');
Editor.Article = require('./article-editor.jsx');
Editor.Photo = require('./photo-editor.jsx');

module.exports = Editor;
