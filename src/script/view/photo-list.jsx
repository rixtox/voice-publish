var React = require('react');
var App = require('../app.ls');
var {Parse} = require('parse');
var Router = require('react-router');
var {Session, StreetImage} = require('../models.ls');

var {Config} = App;
var {RouteHandler, Link} = Router;

var StreetImageItem = React.createClass({
  mixins: [Router.State],

  render: function() {
    var image = this.props.streetImage.get('coverImage');
    var imgUrl = image ? image.get('image').url() : '';

    return (
      <div
        className="item"
        style={{backgroundImage: 'url(' + imgUrl + ')'}}>
        <Link
          className="link"
          title="Edit"
          to={'/edit/session/' + this.getParams().sessionId + '/photo/' + this.props.streetImage.id}/>
        <div className="title">
          {this.props.streetImage.get('who')}
        </div>
        <div className="controls">
          <a
            className="control-btn fa fa-trash-o"
            title="Delete"
            href="javascript:"/>
          <a
            className="control-btn fa fa-eye"
            title="Preview"
            target="_blank"
            href={Config.Url.Preview + 'photos/' + this.props.streetImage.id}/>
        </div>
      </div>
    );
  }

});

var StreetImageList = React.createClass({
  mixins: [Router.State],

  getInitialState: function() {
    return {
      streetImages: []
    };
  },

  updateStreetImages: function(nextSession) {
    var session = new Session;
    session.id = this.getParams().sessionId;
    var query = new Parse.Query(StreetImage);
    query.descending("createdAt");
    query.equalTo('belongTo', session);
    query.include('coverImage');
    query.find().then(function(streetImages) {
      this.setState({streetImages: streetImages});
    }.bind(this));
  },

  componentDidMount: function() {
    this.updateStreetImages();
  },

  componentWillReceiveProps: function(nextProps) {
    this.updateStreetImages(nextProps.session);
  },

  render: function() {
    var self = this;
    var sessionId = self.getParams().sessionId;
    return (
      <div className="inner wrap">
        <div className="selection">
          <Link to={'/session/' + sessionId + '/articles'}>
            <h2 className="option">Articles</h2>
          </Link>
          <Link to={'/session/' + sessionId + '/photos'}>
            <h2 className="option">Photos</h2>
          </Link>
        </div>
        {this.state.streetImages.map(function(streetImage) {
          return (
            <StreetImageItem
              key={streetImage.id}
              streetImage={streetImage} />
          );
        })}
      </div>
    );
  }

});

module.exports = StreetImageList;
