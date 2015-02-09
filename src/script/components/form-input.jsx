var React = require('react');
var {Mixin} = require('../app.ls');
var CKEditor = require('../components/ckeditor.jsx');

var Input = React.createClass({
  mixins: [Mixin.Upload, Mixin.Events],

  getInitialState: function() {
    return {
      value: this.props.data.get(this.props.id)
    };
  },

  onChange: function(event) {
    var self = this;
    self.parseInput(event.target)
    .then(function(value) {
      self.props.data.set(self.props.id, value);
      self.setState({value: value});
      if (typeof self.props.onChange == 'function')
        self.props.onChange(value);
    });
  },

  render: function() {
    var self = this;
    var value = self.state.value;
    if (self.props.type == 'file')
      value = null;
    var checked = (self.props.type == 'checkbox')
      ? self.state.value
      : null;

    if (self.props.CKEditor) {
      var inputDOM = (
        <CKEditor
          {...self.props}
          id={self.props.id}
          value={self.state.value}
          onChange={self.onChange}/>
      );
    } else {
      var inputDOM = (
        <input
          {...self.props}
          id={self.props.id}
          className="input"
          onChange={self.onChange}
          checked={checked}
          placeholder={self.props.text}
          value={value}/>
      );
    }

    if (self.props.bare)
      return inputDOM;
    
    return (
      <div className={self.props.groupClass || 'input-group'}>
        <label htmlFor={self.props.id} className="label">{self.props.label || self.props.text}</label>
        {inputDOM}
      </div>
    );
  }

});

module.exports = Input;