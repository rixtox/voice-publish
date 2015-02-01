var React = require('react');

var Form = React.createClass({

  render: function() {
    var classString = 'pure-form';
    if (this.props.aligned) {
      classString += ' pure-form-aligned';
    }
    return (
      <form {...this.props} className={classString}>
        {this.props.children}
      </form>
    );
  }

});

Form.Input = React.createClass({

  propTypes: {
    text: React.PropTypes.string
  },

  getInitialState: function() {
    return {value: this.props.value || ''};
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
  },

  render: function() {
    var classString = '';
    if (this.props.u) {
      classString += 'pure-input-1';
    }
    return (
      <fieldset>
        <div className="pure-control-group">
          {
            this.props.label
            ? <label htmlFor={this.props.tag}>{this.props.text}</label>
            : null
          }
          <input
            ref="input"
            id={this.props.tag}
            name={this.props.tag}
            title={this.props.text}
            className={classString}
            value={this.state.value}
            onChange={this.handleChange}
            placeholder={this.props.text}
            autoFocus={this.props.autoFocus}
            type={this.props.password ? "password" : (this.props.type || "text")} />
          {this.props.children}
        </div>
      </fieldset>
    );
  }

});

Form.Button = React.createClass({

  propTypes: {
    text: React.PropTypes.string
  },

  render: function() {
    return (
      <fieldset>
        <div className="pure-control-group">
          <label />
          <input
            className="pure-button pure-button-primary"
            type="submit"
            value={this.props.text} />
        </div>
      </fieldset>
    );
  }

});

module.exports = Form;