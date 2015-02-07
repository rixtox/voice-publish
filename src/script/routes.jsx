var React = require('react');
var Router = require('react-router');
var App = require('./view/app.jsx');
var SessionList = require('./view/session-list.jsx');
var SessionDetails = require('./view/session-details.jsx');
var Editor = require('./view/editor.jsx');
var Login = require('./view/login.jsx');
var Logout = require('./view/logout.jsx');
var NotFound = require('./view/not-found.jsx');

var {Route, DefaultRoute, NotFoundRoute} = Router;

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={SessionList}/>
    <Route path="sessions/?" handler={SessionList}/>
    <Route path="session/:sessionId" handler={SessionDetails}>
      <Route name="photos" handler={SessionDetails.Photos}/>
      <Route name="articles" path="articles" handler={SessionDetails.Articles}/>
      <Route name="session-default" path="/session/:sessionId/?" handler={SessionDetails.Articles}/>
    </Route>
    <Route path="edit" handler={Editor}>
      <Route path="session/:sessionId?" handler={Editor.Session}/>
      <Route path="session/:sessionId/article/:articleId?" handler={Editor.Article}/>
      <Route path="session/:sessionId/photo/:photoId?" handler={Editor.Photo}/>
    </Route>
    <Route name="login" path="login" handler={Login}/>
    <Route name="logout" path="logout" handler={Logout}/>
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

module.exports = routes;
