var React = require('react');

var Form = React.createClass({

  render: function() {
    var classString = 'pure-form';
    if (this.props.aligned) {
      classString += ' pure-form-aligned';
    }
    return (
      <form className={classString}>
        {this.props.children}
      </form>
    );
  }

});

Form.Input = React.createClass({

  propTypes: {
    text: React.PropTypes.string
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
            id={this.props.tag}
            name={this.props.tag}
            className={classString}
            type={this.props.password ? "password" : (this.props.type || "text")}
            autoFocus={this.props.autoFocus}
            placeholder={this.props.text} />
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