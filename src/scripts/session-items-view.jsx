var React = require('react');
var Pure = require('./components/pure.jsx');
var ArticleListView = require('./article-list-view.jsx');
var StreetImageListView = require('./stree-image-list-view.jsx');

var SessionItemsView = React.createClass({

  render: function() {
    var self = this;
    var session = self.props.session;
    if (session) {
      return (
        <Pure u="1-5">
          <h2>
            {session.get('title')}
            {session.get('isPublished') ? '' : ' (draft)'}
          </h2>
          <button>Publish</button>
          <button>Delete</button>
          <ArticleListView
            session={session}
            onSelected={this.props.onArticleSelect}
            newArticle={this.props.onNewArticle} />
          <StreetImageListView
            session={session}
            onSelected={this.props.onStreetImageSelect}
            newArticle={this.props.onNewStreetImage} />
        </Pure>
      );
    } else {
      return (
        <Pure u="1-5">
          <h2>None</h2>
        </Pure>
      );
    }
  }

});

module.exports = SessionItemsView;