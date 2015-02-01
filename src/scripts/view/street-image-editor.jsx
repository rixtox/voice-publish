var React = require('react');
var Pure = require('../components/pure.jsx');
var Form = require('../components/form.jsx');

var StreetImageEditorView = React.createClass({

  render: function() {
    return (
      <Pure u="3-5">
        <h2>Edit Street Image</h2>
        <button>Save</button>
        <button>Delete</button>
        <Form>
          <Form.Input tag="title" u autoFocus text="Title" />
          <Form.Input tag="author" u text="Author" />
          <Form.Input tag="url" u text="URL" />
          <Form.Input tag="briefImage" u type="file">
            <img src="http://files.parsetfss.com/5070786f-618a-4706-81d7-f1da861a1d4c/tfss-cb65a89e-723f-43de-9130-74c159cb04bc-11-pic-1-1.jpg" />
          </Form.Input>
        </Form>
      </Pure>
    );
  }

});

module.exports = StreetImageEditorView;