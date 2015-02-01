var React = require('react');
var Pure = require('../components/pure.jsx');
var ArticleListView = require('./article-list.jsx');
var StreetImageListView = require('./stree-image-list.jsx');

var SessionItemsView = React.createClass({

  render: function() {
    var self = this;
    var session = self.props.session;
    if (session) {
      return (
        <Pure u="1-5">
          <h2>
            {'Session ' + session.get('number')}
            {session.get('isPublished') ? '' : ' (draft)'}
          </h2>
          <ArticleListView
            session={session}
            onSelected={this.props.onArticleSelect}
            newArticle={this.props.onNewArticle} />
          <StreetImageListView
            session={session}
            onSelected={this.props.onStreetImageSelect}
            newStreetImage={this.props.onNewStreetImage} />
        </Pure>
      );
    } else {
      return null;
    }
  }

});

module.exports = SessionItemsView;