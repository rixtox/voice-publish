var React = require('react');
var App = require('./view/app.jsx');
var SessionList = require('./view/session-list.jsx');
var SessionDetails = require('./view/session-details.jsx');
var ArticleList = require('./view/article-list.jsx');
var PhotoList = require('./view/photo-list.jsx');
var Editor = require('./view/editor.jsx');
var Login = require('./view/login.jsx');
var Logout = require('./view/logout.jsx');
var NotFound = require('./view/not-found.jsx');

var Router = require('react-router');
var Route = Router.Route,
    DefaultRoute = Router.DefaultRoute;
    NotFoundRoute = Router.NotFoundRoute;

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={SessionList}/>
    <Route path="sessions/?" handler={SessionList}/>
    <Route path="session/:sessionId" handler={SessionDetails}>
      <Route name="photos" handler={PhotoList}/>
      <Route name="articles" path="articles" handler={ArticleList}/>
      <Route name="session-default" path="/session/:sessionId/?" handler={ArticleList}/>
    </Route>
    <Route path="edit" handler={Editor}>
      <Route path="session/:sessionId" handler={Editor.Session}>
        <Route path="article/:articleId?" handler={Editor.Article}/>
        <Route path="photo/:photoId?" handler={Editor.Photo}/>
      </Route>
      <Route path="session/?" handler={Editor.Session}/>
    </Route>
    <Route name="login" path="login" handler={Login}/>
    <Route name="logout" path="logout" handler={Logout}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

module.exports = routes;
