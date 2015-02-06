var React = require('react');
var App = require('../app.ls');
var Router = require('react-router');
var StreetImage = require('../model/street-image.ls');

var {Parse} = App;
var {RouteHandler} = Router;

var StreetImageItem = React.createClass({
  mixins: [App.Mixin.Auth],

  selected: function() {
    this.props.onSelected(this.props.streetImage);
  },

  render: function() {
    return (
      <li>
        <a href="#" onClick={this.selected}>
          {this.props.streetImage.id}
        </a>
      </li>
    );
  }

});

var StreetImageList = React.createClass({

  getInitialState: function() {
    return {
      streetImages: []
    };
  },

  updateStreetImages: function(nextSession) {
    var session = nextSession || this.props.session;
    var query = new Parse.Query(StreetImage);
    query.equalTo('belongTo', session);
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

  selected: function(streetImage) {
    this.props.onSelected(streetImage);
  },

  render: function() {
    self = this;
    return (
      <div>
        <h3>Street Images</h3>
        <button onClick={this.props.newStreetImage}>New Bundle</button>
        <ul>
          {this.state.streetImages.map(function(streetImage) {
            return (
              <StreetImageItem
                key={streetImage.id}
                streetImage={streetImage}
                onSelected={self.selected} />
            );
          })}
        </ul>
      </div>
    );
  }

});

module.exports = StreetImageList;