var React = require('react');
var App = require('../app.ls');
var {Parse} = require('parse');
var Router = require('react-router');
var {Article, Session} = require('../models.ls');

var {RouteHandler, Link} = Router;
var {Config} = App;

var ArticleItem = React.createClass({
  mixins: [Router.State],

  onDelete: function() {
    this.props.onDelete(this.props.article);
  },

  render: function() {
    var imgFile = this.props.article.get('briefImage');
    var imgUrl = imgFile ? imgFile.url() : '';

    return (
      <div
        className="item"
        style={{backgroundImage: 'url(' + imgUrl + ')'}}>
        <Link
          className="link"
          title="Edit"
          to={'/edit/session/' + this.getParams().sessionId + '/article/' + this.props.article.id}/>
        <div className="title">
          {this.props.article.get('title')}
        </div>
        <div className="controls">
          <a
            className="control-btn fa fa-trash-o"
            title="Delete"
            href="javascript:"
            onClick={this.onDelete}/>
          <a
            className="control-btn fa fa-eye"
            title="Preview"
            target="_blank"
            href={Config.Url.Preview + 'article/' + this.props.article.id}/>
        </div>
      </div>
    );
  }

});

var ArticleListView = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {
      articles: []
    };
  },

  updateArticles: function(nextSession) {
    var session = new Session;
    session.id = this.getParams().sessionId;
    var query = new Parse.Query(Article);
    query.descending("createdAt");
    query.equalTo('belongTo', session);
    query.find().then(function(articles) {
      this.setState({articles: articles});
    }.bind(this));
  },

  componentDidMount: function() {
    this.updateArticles();
  },

  componentWillReceiveProps: function(nextProps) {
    this.updateArticles(nextProps.session);
  },

  onDelete: function(article) {
    var self = this;

    article.destroy(function() {
      self.updateArticles();
    }, function(error) {
      self.props.showMessage('Article cannot be deleted!');
    });
  },

  render: function() {
    var self = this;
    var sessionId = self.getParams().sessionId;
    var {articles} = self.state;
    var linkClass = self.isActive('session-default') ? 'active' : '';
    return (
      <div className="inner wrap">
        <div className="selection">
          <Link className={linkClass} to={'/session/' + sessionId + '/articles'}>
            <h2 className="option">Articles</h2>
          </Link>
          <Link to={'/session/' + sessionId + '/photos'}>
            <h2 className="option">Photos</h2>
          </Link>
        </div>
        {articles.map(function(article) {
          return (
            <ArticleItem
              key={article.id}
              article={article}
              onDelete={self.onDelete} />
          );
        })}
      </div>
    );
  }

});

module.exports = ArticleListView;