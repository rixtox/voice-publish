React   = require 'react'
{Parse} = require 'parse'
Router  = require 'react-router'

module.exports = App =
  Config: require '../../config.ls'
  Mixin : require './mixin/index.ls'
  Util  : require './util/index.ls'

document.title = App.Config.Name

Parse.initialize do
  App.Config.Parse['Application ID']
  App.Config.Parse['JavaScript Key']

window.onload = ->
  App.Util.loadScript App.Config.CDN.CKEditor
  .then ->
    require! './routes.jsx'
    Handler <- Router.run routes, _
    React.render do
      React.createElement Handler
      document.body
