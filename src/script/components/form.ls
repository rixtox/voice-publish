React = require 'react/addons'
{Mixin} = require '../app.ls'

{form} = React.DOM

Form = React.createClass do
  mixins: [Mixin.Events]

  renderChildren: ->
    onChange = @onChange
    props =
      data: @props.data
    child <- React.Children.map @props.children
    unless child.props.onChange
      props.onChange = onChange
    if child.type is Form.Input.type
      React.addons.cloneWithProps child, props
    else child

  onChange: ->
    @props.onChange? ...arguments

  render: ->
    form do
      React.__spread {}, @props,
        onSubmit: @props.onSubmit or @preventDefault
      @renderChildren!

Form.Input = require './form-input.jsx'

module.exports = Form
