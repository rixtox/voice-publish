var React = require('react');
var Form = require('./components/form.jsx');

var LoginView = React.createClass({

  render: function () {
    return (
      <Form aligned>
        <Form.Input tag="username" autoFocus label text="Username" />
        <Form.Input tag="password" password  label text="Password" />
        <Form.Button text="Login" />
      </Form>
    );
  }

});

module.exports = LoginView;