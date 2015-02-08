var Q = require('q');
var path = require('path');
var React = require('react');
var {Util, Config, Parse, Mixin} = require('../app.ls');

var CKEditor = React.createClass({
  mixins: [Mixin.Upload],

  getInitialState: function() {
    return {
      editor: null
    };
  },

  loadCKEditor: function() {
    if (typeof CKEDITOR == 'undefined')
      return Util.loadScript(Config.CDN.CKEditor)
            .then(this.loadParseImagePlugin);
    else
      return Q();
  },

  loadParseImagePlugin: function() {
    var self = this;
    var fileInput = self.refs.file;

    CKEDITOR.plugins.add('parse-image', {
      init: function(editor) {
        CKEDITOR.addCss( '.cke_editable img,.cke_editable figure { width: 100%; margin: 0; padding: 0; display: block; vertical-align:text-bottom; border: none; }' );
        editor.addCommand('parse-image', {
          allowedContent: {
            img: {
              attributes: '!src,alt,width,height'
            },
            figure: {}
          },
          requiredContent: 'img',
          exec: function() {
          var {fileInput} = editor.config;
          fileInput.onchange = function() {
            self.uploadImages(this.files).then(function(images) {
              images.map(function(image) {
                var figureDOM = editor.document.createElement('figure');
                var imageDOM = editor.document.createElement('img');
                imageDOM.setAttribute('src', image.url());
                figureDOM.append(imageDOM);
                editor.insertElement(figureDOM);
              });
            }).catch(function(error) {
              console.error('Upload failed:', error);
              alert('Upload failed: ' + error.message);
            });
          };
          fileInput.click();
        }});
        editor.ui.addButton( 'ParseImage', {
          label: 'Image',
          command: 'parse-image',
          toolbar: 'insert,0',
          icon: './plugins/image2/icons/image.png'
        });
      }
    });
  },

  componentDidMount: function() {
    var self = this;

    self.loadCKEditor().then(function() {
      var textarea = self.refs.textarea.getDOMNode();
      var fileInput = self.refs.fileInput.getDOMNode();
      var editor = CKEDITOR.replace(textarea, {
        extraPlugins: 'autogrow,justify,find,basicstyles,font,colorbutton,parse-image',
        autoGrow_onStartup: true,
        autoGrow_minHeight: 500,
        fileInput: fileInput,
        toolbar: [
          { name: 'editing', groups: [ 'find', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'Scayt' ] },
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
          { name: 'insert', items: [ 'ParseImage', 'Table', 'HorizontalRule', 'SpecialChar' ] },
          { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
          { name: 'document', items: [ 'Source' ] },
          '/',
          { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
          { name: 'styles', items: [ 'TextColor', 'BGColor', 'Format', 'FontSize' ] }
        ]
      });
      editor.setData(self.props.value);
      editor.on('change', function(e) {
        self.props.onChange({
          target: {
            type: 'text',
            id: self.props.id,
            value: editor.getData()
          }
        });
      });
      self.setState({editor: editor});
    });
  },

  shouldComponentUpdate: function() {
    return false;
  },

  componentWillUnmount: function() {
    var {editor} = this.state;
    if (editor) {
      editor.removeAllListeners();
      CKEDITOR.remove(editor);
    }
  },

  render: function() {
    return (
      <div className="ckeditor">
        <textarea ref="textarea" style={{display: 'none'}}></textarea>
        <input type="file" multiple="true" ref="fileInput" style={{display: 'none'}}></input>
      </div>
    );
  }

});

module.exports = CKEditor;
