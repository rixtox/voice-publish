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
      <div
        {...this.props}
        className={classString}/>
    );
  }

});

module.exports = Pure;