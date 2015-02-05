var Q = require('q');
var React = require('react');
var Parse = require('../app.ls').Parse;
var Pure = require('../components/pure.jsx');
var Form = require('../components/form.jsx');
var StreetImage = require('../model/street-image.ls');
var StreetDetailImage = require('../model/street-detail-image.ls');

var StreetImageEditor = React.createClass({

  getInitialState: function() {
    var streetImage = this.props.streetImage;
    if (!streetImage) {
      streetImage = new StreetImage;
      streetImage.set('belongTo', this.props.session);
    }
    return {
      streetImage: streetImage,
      streetDetailImages: []
    };
  },

  updateStreetDetailImages: function(nextStreetImage) {
    var streetImage = nextStreetImage || this.state.streetImage;
    if (!streetImage.isNew()) {
      var query = new Parse.Query(StreetDetailImage);
      query.ascending('indexNumber');
      query.equalTo('belongTo', streetImage);
      query.find().then(function(streetDetailImages) {
        this.setState({streetDetailImages: streetDetailImages});
      }.bind(this));
    }
  },

  componentDidMount: function() {
    this.updateStreetDetailImages();
  },

  componentWillReceiveProps: function(nextProps) {
    this.updateStreetDetailImages(nextProps.streetImage);
  },

  onNewImage: function() {
    var streetDetailImages = this.state.streetDetailImages;
    var streetDetailImage = new StreetDetailImage;
    if (streetDetailImages.length > 0) {
      streetDetailImage.set(
        'indexNumber',
        streetDetailImages[streetDetailImages.length - 1]
        .get('indexNumber') + 1);
    } else {
      streetDetailImage.set('indexNumber', 1);
    }
    streetDetailImages.push(streetDetailImage);
    this.forceUpdate();
  },

  onImageChanged: function(streetDetailImage) {
    var self = this;
    return function(event, element) {
      var file = event.target;
      if (file.files[0])
        streetDetailImage.set('image', new Parse.File(
          file.value.split('/').pop().split('\\').pop(), file.files[0]));
    };
  },

  onImageRemoved: function(streetDetailImage) {
    var self = this;
    var streetDetailImages = self.state.streetDetailImages;
    return function() {
      var index = streetDetailImages.indexOf(streetDetailImage);
      if (streetDetailImage.isNew()) {
        streetDetailImages.splice(index, 1);
        self.forceUpdate();
      } else {
        streetDetailImage.destroy(function() {
          streetDetailImages.splice(index, 1);
          self.forceUpdate();
        }, function(error) {
          alert('Image cannot be removed!');
        });
      }
    };
  },

  onDelete: function() {
    var self = this;
    var streetImage = this.state.streetImage;

    if (streetImage.isNew())
      self.props.onDelete();
    else
      streetImage.destroy(function() {
        self.props.onDelete();
      }, function(error) {
        alert('Street image cannot be deleted!');
      });
  },

  onSubmit: function(event) {
    event.preventDefault();
  },

  onSave: function() {
    var self = this;
    var streetImage = self.state.streetImage;
    var file = this.refs.coverImage.refs.input.getDOMNode();

    streetImage.set('photoBy', this.refs.photoBy.state.value);
    streetImage.set('who', this.refs.who.state.value);
    if (file.files[0])
      streetImage.set('image', new Parse.File(
        file.value.split('/').pop().split('\\').pop(), file.files[0]));
    streetImage.save().then(function() {
      Q.all(self.state.streetDetailImages.map(function(streetDetailImage) {
        var deferred = Q.defer();
        streetDetailImage.set('belongTo', streetImage);
        streetDetailImage.save(null, {
          success: function() {
            deferred.resolve();
          },
          error: function(error) {
            deferred.reject(new Error(error));
          }
        });
        return deferred.promise;
      })).then(function() {
        self.props.onSave(streetImage);
        self.forceUpdate();
      }).catch(function() {
        alert('Street image cannot be saved!');
      });
    }, function(error) {
      alert('Street image cannot be saved!');
    });
  },

  render: function() {
    var self = this;
    var streetImage = this.state.streetImage;
    var coverImage = streetImage.get('image');
    return (
      <Pure u="3-5">
        <h2>Edit Street Images</h2>
        <button onClick={this.onSave}>Save</button>
        <button onClick={this.onDelete}>Delete</button>
        <Form onSubmit={this.onSubmit}>
          <Form.Input u
            ref="who"
            tag="who"
            autoFocus
            text="Character"
            value={streetImage.get('who')} />
          <Form.Input u
            ref="photoBy"
            tag="photoBy"
            text="Photo by"
            value={streetImage.get('photoBy')} />
          <Form.Input u
            ref="coverImage"
            tag="coverImage"
            type="file" >
            <p>Cover Image</p>
            <p>{'（推荐尺寸：800*1200 Pixels）'}</p>
            <img src={coverImage ? coverImage.url() : null} />
          </Form.Input>
          {this.state.streetDetailImages.map(function(streetDetailImage) {
            var image = streetDetailImage.get('image');
            return (
              <Form.Input u
                type="file"
                onChange={self.onImageChanged(streetDetailImage)}
                key={streetDetailImage.id}>
                <div>
                  <button
                    onClick={self.onImageRemoved(streetDetailImage)}>
                    Remove Image
                  </button>
                </div>
                <p>{'（推荐尺寸：800*1200 Pixels）'}</p>
                <img src={image ? image.url() : null} />
              </Form.Input>
            );
          })}
          <button onClick={this.onNewImage}>Add</button>
        </Form>
      </Pure>
    );
  }

});

module.exports = StreetImageEditor;
