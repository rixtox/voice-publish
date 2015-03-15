var Q = require('q');
var path = require('path');
var React = require('react');
var {Util, Config, Parse, Mixin} = require('../app.ls');

var MIN_HEIGHT = 500;
var MAX_HEIGHT = document.body.clientHeight - 200;
if (MAX_HEIGHT < MIN_HEIGHT)
  MAX_HEIGHT = MIN_HEIGHT;

var CKEditor = React.createClass({
  mixins: [Mixin.Upload],

  getInitialState: function() {
    return {
      editor: null
    };
  },

  loadParseImagePlugin: function() {
    var self = this;
    var imageInput = self.refs.imageInput;

    if (CKEDITOR.plugins.get('parse-image'))
      return;

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
          var {imageInput} = editor.config;
          imageInput.onchange = function() {
            self.uploadFiles(this.files).then(function(images) {
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
          imageInput.click();
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

    self.loadParseImagePlugin();
    var textarea = self.refs.textarea.getDOMNode();
    var imageInput = self.refs.imageInput.getDOMNode();
    var editor = CKEDITOR.replace(textarea, {
      extraPlugins: 'autogrow,justify,find,basicstyles,font,colorbutton,indentblock,pastefromword,parse-image',
      autoGrow_onStartup: true,
      autoGrow_minHeight: MIN_HEIGHT,
      autoGrow_maxHeight: MAX_HEIGHT,
      pasteFromWordPromptCleanup: true,
      imageInput: imageInput,
      toolbar: [
        { name: 'editing', groups: [ 'find', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'Scayt' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
        { name: 'insert', items: [ 'ParseImage', 'Table', 'HorizontalRule', 'SpecialChar' ] },
        { name: 'links', items: [ 'Link', 'Unlink' ] },
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
        <input type="file" multiple="true" ref="imageInput" style={{display: 'none'}} accept="image/x-png, image/gif, image/jpeg"></input>
      </div>
    );
  }

});

module.exports = CKEditor;
