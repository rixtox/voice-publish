var React = require('react');
var Parse = require('../app.ls').Parse;
var Article = require('../model/article.ls');

var ArticleItemView = React.createClass({

  selected: function() {
    this.props.onSelected(this.props.article);
  },

  render: function() {
    return (
      <li>
        <a href="#" onClick={this.selected}>
          {this.props.article.get('title')}
        </a>
      </li>
    );
  }

});

var ArticleListView = React.createClass({

  getInitialState: function() {
    return {
      articles: []
    };
  },

  updateArticles: function(nextSession) {
    var session = nextSession || this.props.session;
    var query = new Parse.Query(Article);
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

  selected: function(article) {
    this.props.onSelected(article);
  },

  render: function() {
    self = this;
    return (
      <div>
        <h3>Articles</h3>
        <button onClick={this.props.newArticle}>New Article</button>
        <ul>
          {this.state.articles.map(function(article) {
            return (
              <ArticleItemView
                key={article.id}
                article={article}
                onSelected={self.selected} />
            );
          })}
        </ul>
      </div>
    );
  }

});

module.exports = ArticleListView;