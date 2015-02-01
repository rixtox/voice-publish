var React = require('react');
var Pure = require('./components/pure.jsx');
var Form = require('./components/form.jsx');

var DashboardView = React.createClass({

  render: function() {
    return (
      <Pure>
        <Pure u="1-5">
          <h2>Sessions</h2>
          <button>New Session</button>
          <ul>
            <li>第一期</li>
            <li>第二期</li>
            <li>第三期</li>
            <li>第四期</li>
          </ul>
        </Pure>
        <Pure u="1-5">
          <h2>Articles</h2>
          <button>New Article</button>
          <ul>
            <li>文章一</li>
            <li>文章二</li>
            <li>文章三</li>
            <li>文章四</li>
          </ul>
          <h2>Street Images</h2>
          <button>New bundle</button>
          <ul>
            <li>街拍一</li>
            <li>街拍二</li>
            <li>街拍三</li>
            <li>街拍四</li>
          </ul>
        </Pure>
        <Pure u="3-5">
          <h2>Edit Article</h2>
          <button>Save</button>
          <button>Discard</button>
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
      </Pure>
    );
  }

});

module.exports = DashboardView;
