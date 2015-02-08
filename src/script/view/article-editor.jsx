var path = require('path');
var React = require('react');
var App = require('../app.ls');
var {Parse} = require('parse');
var Router = require('react-router');
var Article = require('../model/article.ls');
var Session = require('../model/session.ls');
var CKEditor = require('../components/ckeditor.jsx');

var {Config} = App;
var {Link} = Router;

var ArticleEditor = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function() {
    var session = new Session;
    session.id = this.getParams().sessionId;
    var article = new Article;
    article.set('belongTo', session);
    return {
      article: article,
      session: session,
      message: ''
    };
  },

  updateArticle: function() {
    var self = this;
    var article = new Article;
    article.set('belongTo', self.state.session);
    self.setState({article: article});
    var {articleId} = self.getParams();
    if (articleId) {
      var query = new Parse.Query(Article);
      query.equalTo('objectId', articleId);
      query.first({
        success: function(article) {
          self.setState({article: article});
        }
      });
    }
  },

  componentDidMount: function() {
    this.updateArticle();
  },

  showMessage: function(message) {
    this.setState({message: (new Date).toLocaleTimeString() + ': ' + message});
  },

  onChange: function(event) {
    var self = this;
    var {article} = self.state;
    var {target} = event;
    switch (target.type) {
      case 'text':
      case 'url':
      case 'password':
        article.set(target.id, target.value);
        break;
      case 'checkbox':
        article.set(target.id, target.checked);
        break;
      case 'number':
        article.set(target.id, parseInt(target.value));
        break;
      case 'file':
        var {files} = target;
        if (files.length) {
          var filename = (new Date).toJSON().replace(/\..*$/, '').replace(/[T:]/g, '-') + path.extname(files[0].name);
          var file = new Parse.File(filename, files[0]);
          file.save().then(function() {
            article.set(target.id, file);
            self.forceUpdate();
          }, function(error) {
            self.showMessage('File cannot be uploaded!');
          });
        }
    }
    self.forceUpdate();
  },

  onSave: function() {
    var self = this;
    var article = this.state.article;

    article.save({
      success: function() {
        self.showMessage('Article saved.');
      },
      error: function(error) {
        self.showMessage('Article cannot be saved!');
      }
    });
  },

  onDelete: function() {
    var self = this;
    var {article} = this.state;

    if (!article.isNew())
      article.destroy(function() {
        self.transitionTo('/session/' + self.getParams().sessionId);
      }, function(error) {
        self.showMessage('Article cannot be deleted!');
      });
  },

  onSubmit: function(event) {
    event.preventDefault();
  },

  render: function() {
    var article = this.state.article;
    var briefImage = article.get('briefImage');
    if (briefImage)
      var coverImage = <img src={briefImage.url()} />;
    else
      var coverImage = <div className="empty-image"></div>
    return (
      <div key={article.isNew() ? 'new-article' : article.id} className="dashboard">
        <div className="menu">
          <div className="inner">
            <Link
              title="Back"
              className="btn-back fa fa-arrow-circle-o-left"
              to={'/session/' + this.getParams().sessionId}/>
            <h1 className="title">Edit Article</h1>
            <a className="btn-add" href="javascript:" onClick={this.onSave}>
              <i className="btn-icon fa fa-check"></i>
              Save
            </a>
            <a className="btn-add" target="_blank" href={Config.Url.Preview + 'article/' + article.id}>
              <i className="btn-icon fa fa-external-link"></i>
              External Link
            </a>
            <a className="btn-add" href="javascript:" onClick={this.onDelete}>
              <i className="btn-icon fa fa-trash-o"></i>
              Delete
            </a>
            <span className="message">{this.state.message}</span>
          </div>
        </div>
        <div className="inner wrap">
          <div className="split">
            <div className="left">
              <div className="preview">
                <h1>Preview</h1>
                <div className="cover-image">
                  <label htmlFor="briefImage">
                    {coverImage}
                  </label>
                  <input
                    type="file"
                    id="briefImage"
                    onChange={this.onChange}/>
                </div>
                <section className="title">
                  <h1>{article.get('title')}</h1>
                  <sub>
                    {article.get('writerName') ?
                      (article.createdAt ?
                        (article.createdAt || new Date).toLocaleDateString()
                        + ' ' : '')
                      + 'by ' + article.get('writerName') : ''}
                  </sub>
                </section>
                <section
                  className="content"
                  dangerouslySetInnerHTML={{__html: article.get('content')}}></section>
              </div>
            </div>
            <div className="right">
              <form onSubmit={this.onSubmit}>
                <div className="input-group">
                  <label className="label" htmlFor="title">Title</label>
                  <input
                    id="title"
                    className="input"
                    autoFocus
                    placeholder="Title"
                    onChange={this.onChange}
                    value={article.get('title')} />
                </div>
                <div className="input-group">
                  <label className="label" htmlFor="writerName">Author</label>
                  <input
                    id="writerName"
                    className="input"
                    placeholder="Author"
                    onChange={this.onChange}
                    value={article.get('writerName')} />
                </div>
                <div className="input-group">
                  <label className="label" htmlFor="url">URL</label>
                  <input
                    id="url"
                    type="url"
                    className="input"
                    placeholder="URL"
                    spellCheck="false"
                    onChange={this.onChange}
                    value={article.get('url')} />
                </div>
                <div className="input-group">
                  <label className="label" htmlFor="content">Content</label>
                  <CKEditor
                    id="content"
                    value={article.get('content')}
                    onChange={this.onChange}/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = ArticleEditor;