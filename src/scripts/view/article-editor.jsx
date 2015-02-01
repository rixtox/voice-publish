var React = require('react');
var Parse = require('../app.ls').Parse;
var Pure = require('../components/pure.jsx');
var Form = require('../components/form.jsx');
var Article = require('../model/article.ls');

var ArticleEditorView = React.createClass({

  getInitialState: function() {
    if (this.props.article) {
      var article = this.props.article;
    } else {
      var article = new Article;
      article.set('belongTo', this.props.session);
    };
    return {
      article: article
    };
  },

  onSave: function() {
    var self = this;
    var article = this.state.article;
    var file = this.refs.briefImage.refs.input.getDOMNode();

    article.set('title', this.refs.title.state.value);
    article.set('writerName', this.refs.author.state.value);
    article.set('url', this.refs.url.state.value);
    if (file.files[0]) {
      article.set('briefImage', new Parse.File(
        file.value.split('/').pop().split('\\').pop(), file.files[0]));
    }
    article.save().then(function() {
      self.props.onSave(article);
    }, function(error) {
      alert('Article cannot be saved!');
    });
  },

  onDelete: function() {
    var self = this;
    var article = this.state.article;

    if (article.isNew())
      self.props.onDelete();
    else
      article.destroy(function() {
        self.props.onDelete();
      }, function(error) {
        alert('Article cannot be deleted!');
      });
  },

  onSubmit: function(event) {
    event.preventDefault();
  },

  render: function() {
    var article = this.state.article;
    var briefImage = article.get('briefImage');
    return (
      <Pure u="3-5">
        <h2>Edit Article</h2>
        <button onClick={this.onSave}>Save</button>
        <button onClick={this.onDelete}>Delete</button>
        <Form onSubmit={this.onSubmit}>
          <Form.Input u
            ref="title"
            tag="title"
            autoFocus
            text="Title"
            value={article.get('title')} />
          <Form.Input u
            ref="author"
            tag="author"
            text="Author"
            value={article.get('writerName')} />
          <Form.Input u
            ref="url"
            tag="url"
            text="URL"
            value={article.get('url')} />
          <Form.Input u
            ref="briefImage"
            tag="briefImage"
            type="file" >
            <img src={briefImage ? briefImage.url() : null} />
          </Form.Input>
        </Form>
      </Pure>
    );
  }

});

module.exports = ArticleEditorView;