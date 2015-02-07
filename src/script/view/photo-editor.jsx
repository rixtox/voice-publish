var Q = require('q');
var path = require('path');
var React = require('react');
var moment = require('moment');
var App = require('../app.ls');
var {Parse} = require('parse');
var Router = require('react-router');
var Session = require('../model/session.ls');
var StreetImage = require('../model/street-image.ls');
var StreetDetailImage = require('../model/street-detail-image.ls');

var {Config} = App;
var {Link} = Router;

var StreetImageEditor = React.createClass({
  mixins: [Router.State, Router.Navigation],

  getInitialState: function() {
    var session = new Session;
    session.id = this.getParams().sessionId;
    var streetImage = new StreetImage;
    streetImage.set('belongTo', session);
    return {
      streetImage: streetImage,
      streetDetailImages: [],
      session: session,
      message: ''
    };
  },

  updatePhotos: function() {
    var self = this;
    var streetImage = new StreetImage;
    streetImage.set('belongTo', self.state.session);
    self.setState({streetImage: streetImage});
    var {photoId} = self.getParams();
    if (photoId) {
      var query = new Parse.Query(StreetImage);
      query.equalTo('objectId', photoId);
      query.first({
        success: function(streetImage) {
          self.setState({streetImage: streetImage});
        }
      });
      var streetImageTmp = new StreetImage;
      streetImageTmp.id = photoId;
      var query2 = new Parse.Query(StreetDetailImage);
      query2.equalTo('belongTo', streetImageTmp);
      query2.descending("indexNumber");
      query2.find().then(function(streetDetailImages) {
        self.setState({streetDetailImages: streetDetailImages});
      });
    }
  },

  showMessage: function(message) {
    this.setState({message: (new Date).toLocaleTimeString() + ': ' + message});
  },

  componentDidMount: function() {
    this.updatePhotos();
  },

  addNewPhotos: function(files) {
    var self = this;
    for (var i = 0, file; file = files[i]; i++) {
      var filename = moment().format('YYYY-MM-DD-hh-mm-ss') + path.extname(file.name);
      console.log(filename);
      var parseFile = new Parse.File(filename, file);
      parseFile.save().then(function() {
        var streetDetailImage = new StreetDetailImage;
        streetDetailImage.set('belongTo', self.state.streetImage);
        streetDetailImage.set('image', this);
        self.state.streetDetailImages.unshift(streetDetailImage);
        self.forceUpdate();
      }.bind(parseFile), function(error) {
        self.showMessage('File cannot be uploaded!');
      });
    }
  },

  onFilesAdded: function(event) {
    var {files} = event.target;
    if (files.length)
      this.addNewPhotos(files);
  },

  onFilesDropped: function(event) {
    event.preventDefault();
    event.stopPropagation();
    var {files} = event.dataTransfer;
    if (files.length)
      this.addNewPhotos(files);
  },

  onPhotoRemoved: function(streetDetailImage) {
    var self = this;
    var {streetDetailImages} = self.state;
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
          self.showMessage('Image cannot be removed!');
        });
      }
    };
  },

  onSetCover: function(streetDetailImage) {
    var self = this;
    var {streetImage} = self.state;

    return function() {
      streetImage.set('coverImage', streetDetailImage);
      self.forceUpdate();
    };
  },

  onDelete: function() {
    var self = this;
    var {streetImage} = this.state;

    if (!streetImage.isNew())
      streetImage.destroy(function() {
        self.backToList();
      }, function(error) {
        self.showMessage('Street image cannot be deleted!');
      });
  },

  backToList: function() {
    this.transitionTo('/session/' + this.getParams().sessionId + '/photos');
  },

  preventDefault: function(event) {
    event.preventDefault();
  },

  onSave: function() {
    var self = this;
    var {streetImage} = self.state;

    streetImage.save().then(function() {
      Q.all(([].concat(self.state.streetDetailImages)).reverse().map(function(streetDetailImage, index) {
        var deferred = Q.defer();
        streetDetailImage.set('indexNumber', index);
        if (streetDetailImage.dirty()) {
          streetDetailImage.save(null, {
            success: function() {
              deferred.resolve();
            },
            error: function(error) {
              deferred.reject(new Error(error));
            }
          });
          return deferred.promise;
        }
      })).then(function() {
        self.showMessage('Street image saved.');
        self.forceUpdate();
      }).catch(function() {
        self.showMessage('Street image cannot be saved!');
      });
    }, function(error) {
      self.showMessage('Street image cannot be saved!');
    });
  },

  onChange: function(event) {
    var self = this;
    var data = self.state.streetImage;
    var {target} = event;
    switch (target.type) {
      case 'text':
      case 'url':
      case 'password':
        data.set(target.id, target.value);
        break;
      case 'checkbox':
        data.set(target.id, target.checked);
        break;
      case 'number':
        data.set(target.id, parseInt(target.value));
        break;
      case 'file':
        if (target.files.length) {
          var file = new Parse.File(
            target.value.split('/')
            .pop().split('\\').pop(),
            target.files[0]);
          file.save().then(function() {
            data.set(target.id, file);
            self.forceUpdate();
          }, function(error) {
            self.showMessage('File cannot be uploaded!');
          });
        }
    }
    self.forceUpdate();
  },

  render: function() {
    var self = this;
    var {streetImage, streetDetailImages} = self.state;
    var coverImage = streetImage.get('coverImage') || {};
    return (
      <div key={streetImage.isNew() ? 'new-photo' : streetImage.id} className="dashboard">
        <div className="menu">
          <div className="inner">
            <a
              title="Back"
              className="btn-back fa fa-arrow-circle-o-left"
              href="javascript:"
              onClick={self.backToList} />
            <h1 className="title">Edit Photo</h1>
            <a className="btn-add" href="javascript:" onClick={self.onSave}>
              <i className="btn-icon fa fa-check"></i>
              Save
            </a>
            <a className="btn-add" href="javascript:" onClick={self.onDelete}>
              <i className="btn-icon fa fa-trash-o"></i>
              Delete
            </a>
            <span className="message">{self.state.message}</span>
          </div>
        </div>
        <div className="inner wrap">
          <form onSubmit={self.preventDefault}>
            <div className="input-group">
              <label className="label" htmlFor="title">Character</label>
              <input
                id="who"
                className="input"
                autoFocus
                onChange={self.onChange}
                placeholder="Character"
                value={streetImage.get('who')} />
            </div>
            <div className="input-group">
              <label className="label" htmlFor="photoBy">Photo by</label>
              <input
                id="photoBy"
                className="input"
                onChange={self.onChange}
                placeholder="Photo by"
                value={streetImage.get('photoBy')} />
            </div>
          </form>
          <section className="photos">
            <div className="photo new-photo">
              <label
                htmlFor="new-photo"
                onDragOver={self.preventDefault}
                onDrop={self.onFilesDropped}>
                <span>Drop photos here</span>
              </label>
              <input
                type="file"
                id="new-photo"
                multiple="true"
                onChange={self.onFilesAdded}/>
            </div>
            {streetDetailImages.map(function(image) {
              var coverClass = 'control-btn fa fa-bookmark';
              if (image.id != coverImage.id)
                coverClass += '-o';
              return (
                <div className="photo">
                  <label style={{backgroundImage: 'url(' + image.get('image').url() + ')'}}/>
                  <div className="controls">
                    <a
                      className="control-btn fa fa-trash-o"
                      title="Delete"
                      href="javascript:"
                      onClick={self.onPhotoRemoved(image)}/>
                    <a
                      className={coverClass}
                      title="Cover Image"
                      href="javascript:"
                      onClick={self.onSetCover(image)}/>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    );
  }

});

module.exports = StreetImageEditor;
