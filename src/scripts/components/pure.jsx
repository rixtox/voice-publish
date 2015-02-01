var React = require('react');

var Pure = React.createClass({

  render: function() {
    var classString = 'pure-';
    if (this.props.u) {
      classString += 'u-' + this.props.u;
    } else {
      classString += 'g';
    }
    return (
      <div className={classString}>
        {this.props.children}
      </div>
    );
  }

});

module.exports = Pure;