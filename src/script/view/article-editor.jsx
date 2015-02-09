var path = require('path');
var React = require('react');
var App = require('../app.ls');
var {Parse} = require('parse');
var Router = require('react-router');
var {Session} = require('../models.ls');
var Form = require('../components/form.ls');
var DataModel = require('../models.ls').Article;
var CKEditor = require('../components/ckeditor.jsx');

var {Config, Util, Mixin} = App;
var {Link} = Router;

var ArticleEditor = React.createClass({
  mixins: [Router.State, Router.Navigation, Mixin.Events, Mixin.Upload],

  getInitialState: function() {
    var session = new Session;
    session.id = this.getParams().sessionId;
    var data = new DataModel;
    data.set('belongTo', session);
    return {
      data: data,
      session: session,
      message: ''
    };
  },

  updateData: function() {
    var self = this;
    var data = new DataModel;
    data.set('belongTo', self.state.session);
    self.setState({data: data});
    var {dataId} = self.getParams();
    if (dataId) {
      var query = new Parse.Query(DataModel);
      query.equalTo('objectId', dataId);
      query.first({
        success: function(data) {
          self.setState({data: data});
        }
      });
    }
  },

  componentDidMount: function() {
    this.updateData();
  },

  onSave: function() {
    var self = this;
    var {data} = this.state;

    data.save({
      success: function() {
        self.showMessage('Article saved.');
      },
      error: function(error) {
        self.showMessage('Article cannot be saved!');
      }
    });
  },

  onDelete: function() {
    var self = this;
    var {data} = this.state;

    if (!data.isNew())
      data.destroy(function() {
        self.transitionTo('/session/' + self.getParams().sessionId);
      }, function(error) {
        self.showMessage('Article cannot be deleted!');
      });
  },

  onChange: function() {
    this.forceUpdate();
  },

  render: function() {
    var self = this;
    var {data} = self.state;
    var briefImage = data.get('briefImage');
    if (briefImage)
      var coverImage = <img src={briefImage.url()} />;
    else
      var coverImage = <div className="empty-image"></div>
    var onFormChange = self.onFormChange('data');
    return (
      <div key={data.isNew() ? 'new-article' : data.id} className="dashboard">
        <div className="menu">
          <div className="inner">
            <Link
              title="Back"
              className="btn-back fa fa-arrow-circle-o-left"
              to={'/session/' + self.getParams().sessionId}/>
            <h1 className="title">Edit Article</h1>
            <a className="btn-add" href="javascript:" onClick={self.onSave}>
              <i className="btn-icon fa fa-check"></i>
              Save
            </a>
            <a className="btn-add" target="_blank" href={Config.Url.Preview + 'article/' + data.id}>
              <i className="btn-icon fa fa-external-link"></i>
              External Link
            </a>
            <a className="btn-add" href="javascript:" onClick={self.onDelete}>
              <i className="btn-icon fa fa-trash-o"></i>
              Delete
            </a>
            <span className="message">{self.state.message}</span>
          </div>
        </div>
        <div className="inner wrap">
          <div className="split">
            <div className="left">
              <div className="preview">
                <h1>Preview</h1>
                <Form.Input
                  groupClass="cover-image"
                  type="file"
                  data={data}
                  id="briefImage"
                  label={coverImage}
                  onChange={self.onChange}
                  accept="image/x-png, image/gif, image/jpeg" />
                <section className="title">
                  <h1>{data.get('title')}</h1>
                  <sub>
                    {data.get('writerName') ?
                      (data.createdAt ?
                        Util.formatDate(data.createdAt || new Date, 'yyyy-mm-dd')
                        + ' ' : '')
                      + 'by ' + data.get('writerName') : ''}
                  </sub>
                </section>
                <section
                  className="content"
                  dangerouslySetInnerHTML={{__html: data.get('content')}}></section>
              </div>
            </div>
            <div className="right">
              <Form data={data} onChange={self.onChange}>
                <Form.Input type="text" id="title" text="Title" autoFocus/>
                <Form.Input type="text" id="writerName" text="Author"/>
                <Form.Input type="text" id="content" text="Content" CKEditor/>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = ArticleEditor;