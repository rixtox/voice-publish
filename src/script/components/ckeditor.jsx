var React = require('react');
var {Util, Config} = require('../app.ls');

var CKEditor = React.createClass({

  getInitialState: function() {
    return {
      editor: null
    };
  },

  componentDidMount: function() {
    var self = this;
    Util.loadScript(Config.CDN.CKEditor).then(function() {
      var textarea = self.refs.textarea.getDOMNode();
      var editor = CKEDITOR.replace(textarea, {
        extraPlugins: 'autogrow,justify,find,basicstyles,font,colorbutton',
        autoGrow_onStartup: true,
        autoGrow_minHeight: 500,
        toolbar: [
          { name: 'editing', groups: [ 'find', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'Scayt' ] },
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
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
      </div>
    );
  }

});

module.exports = CKEditor;
