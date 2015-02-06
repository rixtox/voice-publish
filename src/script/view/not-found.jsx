var React = require('react');
var Router = require('react-router');

var NotFound = React.createClass({
  mixins: [Router.Navigation],

  render: function() {
    return (
      <div className="dashboard">
        <div className="menu">
          <div className="wrap">
            <a className="btn-back fa fa-arrow-circle-o-left" title="Go Back" href="javascript:" onClick={this.goBack}/>
            <h1 className="title">404 Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = NotFound;
